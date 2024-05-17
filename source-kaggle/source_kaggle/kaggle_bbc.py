import os
from datetime import datetime
import time
import kaggle
import pandas as pd
from stpl_common.db import Database
from stpl_common.log import get_logger
from stpl_common.types.messages import SourceTaskMessage

LOCAL_FILE = ".data/bbc_news.csv"
LOCAL_BACKUP_FILE = "stpl_source/test_sources_bkp/bbc_news.csv"

logger = get_logger(__name__)


class KaggleBBC:
    def __init__(self):
        self.database = Database()

    def process(self, task: SourceTaskMessage) -> tuple[bool, str]:
        if task.jobData.dryRun:
            time.sleep(1)
            message = "DRY RUN - executed on KaggleBBC"
            logger.info(message)
            return (
                True,
                message,
            )
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
                logger.info(f"fetched data from Kaggle - {data.shape[0]} rows")
            except:
                # Fallback on local copy
                logger.warn(
                    "Kaggle BBC dataset could not be fetched, falling back on local test copy"
                )
                data = pd.read_csv(LOCAL_BACKUP_FILE)
                logger.info(f"fetched data from local backup - {data.shape[0]} rows")

            # Filter the data

            data["pubDate"] = pd.to_datetime(data["pubDate"], utc=True)
            if task.sourceDetails.fromDate is not None:
                date_filter = pd.Timestamp(
                    task.sourceDetails.fromDate, tz="UTC"
                )  # TODO review the need of forcing TZ
                data = data[data["pubDate"] > date_filter]

            logger.info(f"filtered data - {data.shape[0]} rows")

            # Loop through all items of the DataFrame, and update the db (use list comprehension for performance)
            [
                self.database.upsert_story(
                    guid[
                        : guid.find("#")
                    ],  # need to do this because those would be duplicates
                    title,
                    description,
                    pubdate,
                    task.sourceDetails.overwrite,
                    task.jobData.jobId,
                )
                for guid, title, description, pubdate in zip(
                    data["guid"], data["title"], data["description"], data["pubDate"]
                )
            ]

            logger.info("database update completed")
            try:
                os.remove(LOCAL_FILE)
            except:
                logger.warn(f"couldn't remove {LOCAL_FILE}")
            return True, ""
        except Exception as err:
            logger.exception(err)
            message = f"Error processing task {task.jobData.taskId}: {str(err)}"
            return False, message
