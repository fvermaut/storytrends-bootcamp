from datetime import datetime, timedelta
import sys
import traceback
import uuid
import argparse

from st_module.rss import process_feeds, add_feeds


if __name__ == "__main__":
    try:
        cli = argparse.ArgumentParser()
        cli.add_argument("source_id", type=str)
        cli.add_argument(
            "-f",
            "--feeds",
            type=str,
            nargs="*",
            help="The list of feeds to add to the source.  These will be merged with existing ones.",
        )
        cli.add_argument(
            "-d",
            "--from_date",
            type=str,
            nargs="?",
            help="The date from which content should be imported",
        )
        cli.add_argument(
            "-r",
            "--run",
            action=argparse.BooleanOptionalAction,
            help="Run the import (omit if you only want to add feeds)",
        )
        args = cli.parse_args()
        source_id = uuid.UUID(str(args.source_id))
        from_date = None
        if args.from_date is not None:
            try:
                from_date = datetime.strptime(args.from_date, "%Y-%m-%d")
            except Exception:
                print("Could not parse input --from_date")

        if from_date is None:
            from_date = datetime.now() - timedelta(days=90)
            print(f"Setting import start date at: {from_date.strftime('%Y-%m-%d')}")

        if args.feeds is not None:
            result = add_feeds(source_id=source_id, rss_urls=args.feeds)
            if result[0]:
                print("Feeds added to source.")
            else:
                print(f"ERROR adding feeds: {result[1]}")

        if args.run:
            result = process_feeds(source_id=source_id, from_date=from_date)
            if result[0]:
                print("Import done.")
            else:
                print(f"ERROR during import: {result[1]}")

    except KeyboardInterrupt:
        print("Terminating on user input...")
    except Exception as e:
        print(f"An error occurred: {e}")
        print(traceback.format_exc())
    finally:
        print("Process completed.")
        sys.exit(0)
