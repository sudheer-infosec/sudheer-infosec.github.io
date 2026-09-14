import os
import shutil
from custody.custody_log import log_event

VAULT_PATH = "storage/evidence_vault"

def store_evidence(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError("Evidence file not found")

    if not os.path.exists(VAULT_PATH):
        os.makedirs(VAULT_PATH)

    file_name = os.path.basename(file_path)
    destination = os.path.join(VAULT_PATH, file_name)

    if os.path.exists(destination):
        raise FileExistsError("Evidence already exists in vault")

    shutil.copy2(file_path, destination)

    # Chain of custody entry
    log_event(file_name, "EVIDENCE STORED")

    return destination
