from datetime import datetime
import time
import sys
import uuid

from source_python.kaggle_bbc import import_kaggle_bbc


if __name__ == "__main__":
    try:
        source_id = uuid.UUID(str(sys.argv[1]))
        from_date = datetime.strptime(sys.argv[2], "%Y-%m-%d")
        # time.sleep(1000)

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