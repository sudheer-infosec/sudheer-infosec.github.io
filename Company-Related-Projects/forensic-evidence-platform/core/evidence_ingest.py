import os
import datetime
from crypto.hash_utils import calculate_sha256

def ingest_evidence(file_path):
    """
    Ingest digital evidence and extract forensic metadata.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError("Evidence file not found")

    metadata = {
        "file_name": os.path.basename(file_path),
        "file_size_bytes": os.path.getsize(file_path),
        "created_time": datetime.datetime.fromtimestamp(
            os.path.getctime(file_path)
        ).isoformat(),
        "modified_time": datetime.datetime.fromtimestamp(
            os.path.getmtime(file_path)
        ).isoformat(),
        "sha256_hash": calculate_sha256(file_path)
    }

    return metadata
