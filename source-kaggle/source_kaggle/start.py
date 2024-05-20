from datetime import datetime
import sys
import uuid

from source_kaggle.kaggle_bbc import import_kaggle_bbc


if __name__ == "__main__":
    try:
        source_id = uuid.UUID(str(sys.argv[1]))
        from_date = datetime.strptime(sys.argv[2], "%Y-%m-%d")

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
        exit(0)
