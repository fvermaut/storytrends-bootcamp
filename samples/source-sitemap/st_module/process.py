import os
from datetime import datetime
import traceback
import uuid
import pandas as pd
from st_module.db import Database, Story
import urllib.robotparser

LOCAL_FILE = ".data/bbc_news.csv"
LOCAL_BACKUP_FILE = "source_kaggle/test_sources_bkp/bbc_news.csv"


def process_import(
    source_id: uuid.UUID, site_base_url: str, from_date: datetime
) -> tuple[bool, str]:
    try:
        database = Database(auth=True)

        print(f"{source_id} / {site_base_url} / {from_date}")

        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(f"{site_base_url}/robots.txt")
        rp.read()
        rrate = rp.request_rate("*")
        crawl_delay = rp.crawl_delay("*")
        print(f"{rrate}  / {crawl_delay}")
        sitemaps = rp.site_maps()
        for sitemap in sitemaps:
            print(sitemap)

        return True, ""
    except Exception as err:
        print(traceback.format_exc())
        message = f"Error processing source: {str(err)}"
        return False, message
