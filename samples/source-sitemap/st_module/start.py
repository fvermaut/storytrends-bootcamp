from datetime import datetime, timedelta
import sys
import uuid

from st_module.process import process_import


if __name__ == "__main__":
    source_id = uuid.UUID(str(sys.argv[1]))
    site_base_url = str(sys.argv[2])
    from_date = None
    try:
        from_date = datetime.strptime(sys.argv[3], "%Y-%m-%d")
    except Exception:
        from_date = datetime.now() - timedelta(days=90)
        print(f"Setting import start date at: {from_date.strftime('%Y-%m-%d')}")

    try:
        result = process_import(
            source_id=source_id, site_base_url=site_base_url, from_date=from_date
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
