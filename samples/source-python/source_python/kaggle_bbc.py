import os
from datetime import datetime
import traceback
import uuid
import pandas as pd
from source_python.db import Database, Story

LOCAL_FILE = ".data/bbc_news.csv"
LOCAL_BACKUP_FILE = "source_kaggle/test_sources_bkp/bbc_news.csv"


def import_kaggle_bbc(source_id: uuid.UUID, from_date: datetime) -> tuple[bool, str]:
    try:
        database = Database(auth=True)

        os.environ["KAGGLE_USERNAME"] = os.getenv("KAGGLE_USERNAME")
        os.environ["KAGGLE_KEY"] = os.getenv("KAGGLE_KEY")

        data = None

        try:
            import kaggle

            kaggle.api.dataset_download_files(
                "gpreda/bbc-news", path=".data/", unzip=True
            )
            # Load the dataset∏

            data = pd.read_csv(LOCAL_FILE)
            print(f"fetched data from Kaggle - {data.shape[0]} rows")
        except Exception:
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

        print("Preparing data...")
        bulk_data = []
        [
            bulk_data.append(
                Story(
                    title=title,
                    summary=description,
                    pub_date=pubdate,
                    foreign_id=guid[: guid.find("#")],
                    source_id=str(source_id),
                )
            )
            for guid, title, description, pubdate in zip(
                data["guid"], data["title"], data["description"], data["pubDate"]
            )
        ]

        print("Uploading data on Storytrends database - please wait....")
        database.upsert_stories(bulk_data)

        print("Database update completed")
        os.remove(LOCAL_FILE)
        return True, ""
    except Exception as err:
        print(traceback.format_exc())
        message = f"Error processing source: {str(err)}"
        return False, message
