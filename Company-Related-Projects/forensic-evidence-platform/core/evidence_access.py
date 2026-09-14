import os
from custody.custody_log import log_event

def access_evidence(file_path, user="investigator"):
    """
    Access evidence and log custody.
    """
    if not os.path.exists(file_path):
        log_event(os.path.basename(file_path), "EVIDENCE ACCESS FAILED - FILE MISSING", user)
        raise FileNotFoundError("Evidence not found")

    log_event(os.path.basename(file_path), "EVIDENCE ACCESSED", user)
    return file_path
