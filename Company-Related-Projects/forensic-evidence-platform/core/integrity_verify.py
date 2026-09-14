from crypto.hash_utils import calculate_sha256
from custody.custody_log import log_event
import os

def verify_integrity(file_path, original_hash, user="investigator"):
    """
    Verify integrity of evidence and log custody events.
    """
    if not os.path.exists(file_path):
        log_event(os.path.basename(file_path), "INTEGRITY CHECK FAILED - FILE MISSING", user)
        return False

    current_hash = calculate_sha256(file_path)

    if current_hash == original_hash:
        log_event(os.path.basename(file_path), "EVIDENCE VERIFIED", user)
        return True
    else:
        log_event(os.path.basename(file_path), "INTEGRITY CHECK FAILED - HASH MISMATCH", user)
        return False
