from datetime import datetime
from time import mktime
import traceback
from typing import Optional
import uuid

from pydantic import BaseModel

import feedparser
from newspaper import Article, Config
import nltk
from st_module.db import Database, Story

newspaper_config = Config()
newspaper_config.number_threads = 1
newspaper_config.request_timeout = 20
newspaper_config.fetch_images = False

RSS_URLS_SETTING_NAME = "rssUrls"


class RssStory(BaseModel):
    url: str
    pub_date: Optional[datetime] = None
    title: Optional[str] = None


class RssProcessResponse(BaseModel):
    stories: list[RssStory]


def process_rss_feed(rss_url, from_date) -> RssProcessResponse:
    feed = feedparser.parse(rss_url)
    stories = []
    for entry in feed.entries:
        try:
            pub_date = datetime.fromtimestamp(mktime(entry.published_parsed))
            if pub_date >= from_date:
                stories.append(
                    RssStory(
                        title=entry.title,
                        url=entry.link,
                        pub_date=pub_date,
                    )
                )
        except Exception as err:
            print(f"error parsing rss entry: {entry} - {err}")

    print(f"Found {len(stories)} in {rss_url}")
    return RssProcessResponse(stories=stories)


def add_feeds(source_id: uuid.UUID, rss_urls: list[str]):
    try:
        database = Database(auth=True)

        # Get the source info from storytrends db

        source = database.get_source(source_id)
        configured_rss_urls = (
            set(source.custom_settings.get(RSS_URLS_SETTING_NAME))
            if source.custom_settings
            else set()
        )

        configured_rss_urls.update(rss_urls)

        if source.custom_settings is None:
            source.custom_settings = {}
        source.custom_settings[RSS_URLS_SETTING_NAME] = list(configured_rss_urls)

        database.update_source_custom_settings(source)
        return True, ""

    except Exception as err:
        print(traceback.format_exc())
        message = f"Error adding rss urls: {str(err)}"
        return False, message


def process_feeds(source_id: uuid.UUID, from_date: datetime) -> tuple[bool, str]:
    try:
        # Needed for Newspaper3k
        nltk.download("punkt")

        database = Database(auth=True)

        # Get the source info from storytrends db

        source = database.get_source(source_id)
        configured_rss_urls = (
            set(source.custom_settings.get(RSS_URLS_SETTING_NAME))
            if source.custom_settings
            else set()
        )

        print(f"--- Parsing {len(configured_rss_urls)} rss feeds")

        all_stories = []

        for _rss_url in configured_rss_urls:
            resp = process_rss_feed(rss_url=_rss_url, from_date=from_date)
            all_stories.extend(resp.stories)

        if all_stories:
            bulk_data = []
            seen_urls = set()  # Set to keep track of seen URLs -> avoid duplicates
            for story in all_stories:
                if story.url not in seen_urls:
                    # Extract additional info using Newspaper3k
                    title = ""
                    pub_date = None
                    summary = ""
                    text = ""
                    try:
                        fectched_article = Article(
                            url=story.url, config=newspaper_config
                        )
                        fectched_article.download()
                        fectched_article.parse()
                        fectched_article.nlp()
                        title = story.title if story.title else fectched_article.title
                        pub_date = (
                            story.pub_date
                            if story.pub_date
                            else fectched_article.publish_date
                        )
                        summary = fectched_article.summary
                        text = fectched_article.text
                        print(f"- fetched {story.url}")
                    except Exception as err:
                        print(
                            f"Error downloading article ({story.url}) with Newspaper3k: {err}"
                        )
                    bulk_data.append(
                        Story(
                            title=title,
                            summary=summary,
                            pub_date=pub_date,
                            foreign_id=story.url,
                            source_id=str(source_id),
                            text=text,
                        )
                    )
                    seen_urls.add(story.url)

            print(
                f"--- Uploading {len(bulk_data)} stories on Storytrends database - please wait...."
            )
            database = Database(
                auth=True
            )  # Reinstantiate as token may have expired due to long process
            database.upsert_stories(bulk_data)

        return True, ""
    except Exception as err:
        print(traceback.format_exc())
        message = f"Error processing source: {str(err)}"
        return False, message
