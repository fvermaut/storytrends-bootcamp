import os
from datetime import datetime
import time
import uuid
import kaggle
import pandas as pd
from source_kaggle.db import Database

LOCAL_FILE = ".data/bbc_news.csv"
LOCAL_BACKUP_FILE = "source_kaggle/test_sources_bkp/bbc_news.csv"

database = Database(auth=True)


def import_kaggle_bbc(source_id: uuid.UUID, from_date: datetime) -> tuple[bool, str]:
    try:
        os.environ["KAGGLE_USERNAME"] = os.getenv("KAGGLE_USERNAME")
        os.environ["KAGGLE_KEY"] = os.getenv("KAGGLE_KEY")

        data = None

        try:
            kaggle.api.dataset_download_files(
                "gpreda/bbc-news", path=".data/", unzip=True
            )
            # Load the dataset∏

            data = pd.read_csv(LOCAL_FILE)
            print(f"fetched data from Kaggle - {data.shape[0]} rows")
        except:
            # Fallback on local copy
            print(
                "Kaggle BBC dataset could not be fetched, falling back on local test copy"
            )
            data = pd.read_csv(LOCAL_BACKUP_FILE)
            print(f"Fetched data from local backup - {data.shape[0]} rows")

        # Filter the data

        data["pubDate"] = pd.to_datetime(data["pubDate"], utc=True)
        if from_date is not None:
            date_filter = pd.Timestamp(
                from_date, tz="UTC"
            )  # TODO review the need of forcing TZ
            data = data[data["pubDate"] > date_filter]

        print(f"filtered data - {data.shape[0]} rows")

        # Loop through all items of the DataFrame, and update the db (use list comprehension for performance)
        [
            database.upsert_story(
                guid=guid[
                    : guid.find("#")
                ],  # need to do this because those would be duplicates
                title=title,
                description=description,
                pubdate=pubdate,
                overwrite=True,
                source_id=source_id,
            )
            for guid, title, description, pubdate in zip(
                data["guid"], data["title"], data["description"], data["pubDate"]
            )
        ]

        print("database update completed")
        try:
            os.remove(LOCAL_FILE)
        except:
            print(f"ERROR: couldn't remove {LOCAL_FILE}")
        return True, ""
    except Exception as err:
        print(err)
        message = f"Error processing source: {str(err)}"
        return False, message
