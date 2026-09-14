import json
import os

def generate_report(evidence_metadata_list, custody_log_path="custody/custody_log.txt"):
    """
    Generate a forensic report in JSON format.
    """
    report = {
        "evidence_items": evidence_metadata_list,
        "chain_of_custody": []
    }

    if os.path.exists(custody_log_path):
        with open(custody_log_path, "r") as log:
            report["chain_of_custody"] = log.readlines()

    report_path = "reports/forensic_report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=4)

    return report_path
