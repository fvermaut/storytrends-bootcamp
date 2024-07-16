from datetime import datetime, timedelta
import sys
import uuid

from urllib.parse import urlparse

from st_module.sitemap import process_sitemap_import
from st_module.rss import process_rss_import


if __name__ == "__main__":
    source_id = uuid.UUID(str(sys.argv[1]))
    url = str(sys.argv[2])
    from_date = None
    try:
        from_date = datetime.strptime(sys.argv[3], "%Y-%m-%d")
    except Exception:
        from_date = datetime.now() - timedelta(days=90)
        print(f"Setting import start date at: {from_date.strftime('%Y-%m-%d')}")

    try:
        parsed_url = urlparse(url)
        if parsed_url.path in ("", "/"):
            result = process_sitemap_import(
                source_id=source_id, site_base_url=url, from_date=from_date
            )
        else:
            result = process_rss_import(
                source_id=source_id, rss_url=url, from_date=from_date
            )
        if result[0]:
            print("Import done.")
        else:
            print(f"ERROR during import: {result[1]}")

    except KeyboardInterrupt:
        print("Terminating on user input...")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("Process completed.")
        sys.exit(0)
