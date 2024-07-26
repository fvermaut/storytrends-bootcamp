from datetime import datetime
import json
import os
from typing import Optional
import uuid
from dotenv import load_dotenv
from pydantic import BaseModel
from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

# The path where the session info is persisted (using a docker volume - see compose.yaml)
SESSION_FILE_PATH = "/app/.settings/session.json"


class Story(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    text: Optional[str] = None
    pub_date: Optional[datetime] = None
    foreign_id: Optional[str] = None
    source_id: Optional[str] = None


class Source(BaseModel):
    id: Optional[uuid.UUID] = None
    name: Optional[str] = None
    custom_settings: Optional[dict] = None


class Database:
    def __init__(self, auth: bool = False):
        load_dotenv()
        # Connect to Supabase
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        clientOptions = ClientOptions(
            postgrest_client_timeout=999999,
            auto_refresh_token=False,  # needed to avoid hang of application at exit: https://github.com/supabase-community/supabase-py/issues/451#issuecomment-1736329894
        )
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
                print("ERROR: Could not authenticate.  Please login again.")
                raise e

    def get_source(self, id: uuid.UUID) -> Source:
        response = (
            self.database.table("user_sources")
            .select("*")
            .eq("id", id)
            .single()
            .execute()
        )
        return Source(**response.data) if response.data else None

    def update_source_custom_settings(self, source: Source):
        response = (
            self.database.table("user_sources")
            .update({"custom_settings": source.custom_settings})
            .eq("id", source.id)
            .execute()
        )
        return Source(**response.data[0]) if response.data else None

    def upsert_stories(
        self, stories: list[Story], overwrite: bool = False, batch_size: int = 1000
    ):
        _stories = [json.loads(s.model_dump_json()) for s in stories]

        def chunks(lst, n):
            """Yield successive n-sized chunks from lst."""
            for i in range(0, len(lst), n):
                yield lst[i : i + n]

        for batch in chunks(_stories, batch_size):
            self.database.table("stories").upsert(
                batch,
                on_conflict="source_id, foreign_id",
                ignore_duplicates=False if overwrite else True,
            ).execute()

    def upsert_story(
        self,
        guid: str,
        title: str,
        description: str,
        pubdate: str,
        overwrite: bool,
        source_id: uuid.UUID,
        text: Optional[str] = "",
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
                    "text": text,
                    "pub_date": pubdate.isoformat(),
                    "source_id": str(source_id),
                },
                on_conflict="source_id, foreign_id",
                ignore_duplicates=False if overwrite else True,
            )
            .execute()
        )
