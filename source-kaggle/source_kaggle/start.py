from datetime import datetime
import sys
import uuid


if __name__ == "__main__":
    try:
        source_id = uuid.UUID(str(sys.argv[1]))
        from_date = datetime.strptime(sys.argv[2], "%Y-%m-%d")
        print(source_id)
        print(from_date)

    except KeyboardInterrupt:
        print("Terminating on user input...")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("Process exited.")
