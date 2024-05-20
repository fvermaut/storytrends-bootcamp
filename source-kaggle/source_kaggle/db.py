from datetime import datetime
import json
import os
import uuid
from dotenv import load_dotenv
from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

# The path where the session info is persisted (using a docker volume - see compose.yaml)
SESSION_FILE_PATH = "/app/.settings/session.json"


class Database:
    def __init__(self, auth: bool = False):
        load_dotenv()
        # Connect to Supabase
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        clientOptions = ClientOptions(postgrest_client_timeout=999999)
        self.database: Client = create_client(url, key, clientOptions)
        if auth:
            try:
                session_json = None
                with open(SESSION_FILE_PATH, "r") as file:
                    session_json = json.load(file)
                self.database.auth.set_session(
                    session_json.get("access_token"),
                    session_json.get("refresh_token"),
                )
            except Exception as e:
                print(f"ERROR: Could not authenticate:\n{str(e)}")
                raise e

    def upsert_story(
        self,
        guid: str,
        title: str,
        description: str,
        pubdate: str,
        overwrite: bool,
        source_id: uuid.UUID,
    ):
        # TODO manage the update of job_ids array
        data, count = (
            self.database.table("stories")
            .upsert(
                {
                    "updated_at": datetime.now().isoformat(),
                    "title": title,
                    "foreign_id": guid,
                    "summary": description,
                    "pub_date": pubdate.isoformat(),
                    "source_id": str(source_id),
                },
                on_conflict="source_id, foreign_id",
                ignore_duplicates=False if overwrite else True,
            )
            .execute()
        )
