import copy
from datetime import datetime
import traceback
from typing import Optional
import uuid
from pydantic import BaseModel
from st_module.db import Database, Story
import urllib.robotparser
from usp.tree import sitemap_tree_for_homepage
from st_module.custom_client import RequestsCustomWebClient
from newspaper import Article, Config
import nltk

# Needed for Newspaper3k
nltk.download("punkt")
newspaper_config = Config()
newspaper_config.number_threads = 1
newspaper_config.request_timeout = 20
newspaper_config.fetch_images = False

# CUSTOM SETTINGS
# Only fetch the sitemap items that are "News Sitemap" elements (recommended: True - otherwise this could fetch a lot of noise)
FETCH_ONLY_SITEMAP_NEWS = True

# COMMON SETTINGS
EXCLUDED_SITEMAP_URLS_SETTING_NAME = "excludedSitemapUrls"


class SitemapStory(BaseModel):
    url: str
    last_modified: datetime
    pub_date: Optional[datetime] = None
    title: Optional[str] = None


class SitemapProcessResponse(BaseModel):
    excluded_sitemap_urls: list[str]
    stories: list[SitemapStory]


def process_sitemap(sitemap, from_date: datetime) -> SitemapProcessResponse:
    stories = []
    excluded_sitemap_urls = []
    if hasattr(sitemap, "pages"):
        for page in sitemap.pages:
            """
            Check if it is a SitemapNews story -> in that case we fetch the title and pub_date from the sitemap itself.
            Otherwise, we'll fetch it with Newspaper3k later.
            """
            if hasattr(page, "news_story") and page.news_story:
                try:
                    if page.news_story.publish_date.timestamp() > from_date.timestamp():
                        stories.append(
                            SitemapStory(
                                url=page.url,
                                pub_date=page.news_story.publish_date,
                                last_modified=page.last_modified,
                                title=page.news_story.title,
                            )
                        )
                except Exception as err:
                    print(f"Error parsing page info: {page} - {err}")
            elif (
                not FETCH_ONLY_SITEMAP_NEWS
                and hasattr(page, "last_modified")
                and page.last_modified.timestamp() > from_date.timestamp()
            ):
                try:
                    stories.append(
                        SitemapStory(
                            url=page.url,
                            last_modified=page.last_modified,
                        )
                    )
                except Exception as err:
                    print(f"Error parsing page info: {page} - {err}")

    if hasattr(sitemap, "sub_sitemaps"):
        for submap in sitemap.sub_sitemaps:
            resp = process_sitemap(sitemap=submap, from_date=from_date)
            if resp.stories:
                stories.extend(copy.deepcopy(resp.stories))
            if resp.excluded_sitemap_urls:
                excluded_sitemap_urls.extend(copy.deepcopy(resp.excluded_sitemap_urls))
    if not stories:
        excluded_sitemap_urls.append(sitemap.url)
    return SitemapProcessResponse(
        excluded_sitemap_urls=excluded_sitemap_urls, stories=stories
    )


def process_sitemap_import(
    source_id: uuid.UUID, site_base_url: str, from_date: datetime
) -> tuple[bool, str]:
    try:
        database = Database(auth=True)

        # Get the source info from storytrends db

        source = database.get_source(source_id)
        excluded_sitemap_urls = (
            set(source.custom_settings.get(EXCLUDED_SITEMAP_URLS_SETTING_NAME))
            if source.custom_settings
            else set()
        )

        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(f"{site_base_url}/robots.txt")
        rp.read()
        # rrate = rp.request_rate("*")
        # crawl_delay = rp.crawl_delay("*")

        webclient = RequestsCustomWebClient(
            base_host=site_base_url,
            excluded_sitemap_urls=excluded_sitemap_urls,
            robots=rp,
        )
        print("--- Parsing sitemap tree...")
        tree = sitemap_tree_for_homepage(site_base_url, web_client=webclient)
        print("--- Processing sitemap tree...")
        resp = process_sitemap(sitemap=tree, from_date=from_date)
        if resp.stories:
            bulk_data = []
            seen_urls = set()  # Set to keep track of seen URLs -> avoid duplicates
            for sitemap_story in resp.stories:
                if sitemap_story.url not in seen_urls:
                    # Extract additional info using Newspaper3k
                    title = ""
                    pub_date = None
                    summary = ""
                    text = ""
                    try:
                        fectched_article = Article(
                            url=sitemap_story.url, config=newspaper_config
                        )
                        fectched_article.download()
                        fectched_article.parse()
                        fectched_article.nlp()
                        title = (
                            sitemap_story.title
                            if sitemap_story.title
                            else fectched_article.title
                        )
                        pub_date = (
                            sitemap_story.pub_date
                            if sitemap_story.pub_date
                            else fectched_article.publish_date
                        )
                        summary = fectched_article.summary
                        text = fectched_article.text
                        print(f"- fetched {sitemap_story.url}")
                    except Exception as err:
                        print(
                            f"Error downloading article ({sitemap_story.url}) with Newspaper3k: {err}"
                        )
                    bulk_data.append(
                        Story(
                            title=title,
                            summary=summary,
                            pub_date=pub_date,
                            foreign_id=sitemap_story.url,
                            source_id=str(source_id),
                            text=text,
                        )
                    )
                    seen_urls.add(sitemap_story.url)

            print(
                f"--- Uploading {len(bulk_data)} stories on Storytrends database - please wait...."
            )
            database = Database(
                auth=True
            )  # Reinstantiate as token may have expired due to long process
            database.upsert_stories(bulk_data)

        if resp.excluded_sitemap_urls:
            updated_excluded_sitemap_urls = resp.excluded_sitemap_urls
            # Remove the urls that had errors
            new_excluded_sitemap_urls = set(updated_excluded_sitemap_urls) - set(
                webclient.get_urls_with_errors()
            )
            # Merge with the previous excluded urls
            merged_excluded_sitemap_urls = new_excluded_sitemap_urls.union(
                excluded_sitemap_urls
            )
            source.custom_settings[EXCLUDED_SITEMAP_URLS_SETTING_NAME] = list(
                merged_excluded_sitemap_urls
            )

            database = Database(
                auth=True
            )  # Reinstantiate as token may have expired due to long process
            database.update_source_custom_settings(source)
            print(
                "--- Updating excluded sitemap URLs on Storytrends database - please wait...."
            )

        return True, ""
    except Exception as err:
        print(traceback.format_exc())
        message = f"Error processing source: {str(err)}"
        return False, message
