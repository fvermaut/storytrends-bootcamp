from datetime import datetime, timedelta
import time
import sys
import uuid

from source_python.kaggle_bbc import import_kaggle_bbc


if __name__ == "__main__":
    source_id = uuid.UUID(str(sys.argv[1]))
    from_date = None
    try:
        from_date = datetime.strptime(sys.argv[2], "%Y-%m-%d")
    except Exception:
        from_date = datetime.now() - timedelta(days=90)
        print(f"Setting import start date at: {from_date.strftime('%Y-%m-%d')}")

    try:
        result = import_kaggle_bbc(source_id=source_id, from_date=from_date)
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
