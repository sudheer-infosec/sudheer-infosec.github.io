import sys
import os

# Add project root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, render_template, request
import os

from core.evidence_ingest import ingest_evidence
from storage.evidence_store import store_evidence
from core.integrity_verify import verify_integrity

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["GET", "POST"])
def upload():
    if request.method == "POST":
        file = request.files["file"]
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        data = ingest_evidence(filepath)

        try:
            store_evidence(filepath)
        except FileExistsError:
            pass

        integrity = verify_integrity(
            f"storage/evidence_vault/{file.filename}",
            data["sha256_hash"]
        )

        return render_template(
            "report.html",
            filename=file.filename,
            hash=data["sha256_hash"],
            integrity=integrity
        )

    return render_template("upload.html")

if __name__ == "__main__":
    app.run(debug=True)
