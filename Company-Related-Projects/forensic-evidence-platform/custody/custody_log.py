import datetime
import os

CUSTODY_DIR = "custody"
CUSTODY_LOG_FILE = os.path.join(CUSTODY_DIR, "custody_log.txt")

def log_event(evidence_name, action, user="investigator"):
    """
    Append-only chain of custody logger.
    """
    # Ensure custody directory exists
    if not os.path.exists(CUSTODY_DIR):
        os.makedirs(CUSTODY_DIR)

    timestamp = datetime.datetime.utcnow().isoformat()
    entry = f"{timestamp} | {user} | {evidence_name} | {action}\n"

    with open(CUSTODY_LOG_FILE, "a") as log:
        log.write(entry)
