from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from auth_utils import get_current_user
import models
import uuid
import hashlib
import os
import shutil
from datetime import datetime

router = APIRouter()
UPLOAD_DIR = "./evidence_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def compute_hashes(filepath: str):
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            md5.update(chunk)
            sha256.update(chunk)
    return md5.hexdigest(), sha256.hexdigest()

def log_action(db, user_id, action, description, case_id=None, evidence_id=None, ip=None):
    log = models.AuditLog(
        user_id=user_id,
        action=action,
        description=description,
        case_id=case_id,
        evidence_id=evidence_id,
        ip_address=ip
    )
    db.add(log)
    db.commit()

def evidence_to_dict(e):
    return {
        "id": e.id,
        "evidence_id": e.evidence_id,
        "case_id": e.case_id,
        "case_number": e.case.case_number if e.case else None,
        "filename": e.filename,
        "original_filename": e.original_filename,
        "file_size": e.file_size,
        "file_type": e.file_type,
        "md5_hash": e.md5_hash,
        "sha256_hash": e.sha256_hash,
        "description": e.description,
        "device_info": e.device_info,
        "location_acquired": e.location_acquired,
        "status": e.status,
        "collected_by": e.collected_by.name if e.collected_by else None,
        "collected_at": e.collected_at.isoformat() if e.collected_at else None,
        "created_at": e.created_at.isoformat(),
    }

@router.post("/upload", status_code=201)
async def upload_evidence(
    request: Request,
    file: UploadFile = File(...),
    case_id: int = Form(...),
    description: Optional[str] = Form(None),
    device_info: Optional[str] = Form(None),
    location_acquired: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    evidence_id = f"EVD-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    ext = os.path.splitext(file.filename)[1] if file.filename else ""
    stored_name = f"{evidence_id}{ext}"
    filepath = os.path.join(UPLOAD_DIR, stored_name)

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    file_size = os.path.getsize(filepath)
    md5, sha256 = compute_hashes(filepath)

    ev = models.Evidence(
        evidence_id=evidence_id,
        case_id=case_id,
        filename=stored_name,
        original_filename=file.filename,
        file_path=filepath,
        file_size=file_size,
        file_type=file.content_type,
        md5_hash=md5,
        sha256_hash=sha256,
        description=description,
        device_info=device_info,
        location_acquired=location_acquired,
        collected_by_id=current_user.id,
        collected_at=datetime.utcnow()
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    log_action(db, current_user.id, "EVIDENCE_UPLOADED", f"Uploaded evidence {evidence_id} for case {case.case_number}", case_id=case_id, evidence_id=ev.id, ip=request.client.host)
    return evidence_to_dict(ev)

@router.get("/")
def list_evidence(case_id: Optional[int] = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Evidence)
    if case_id:
        query = query.filter(models.Evidence.case_id == case_id)
    evidence = query.all()
    return [evidence_to_dict(e) for e in evidence]

@router.get("/{evidence_id}")
def get_evidence(evidence_id: int, request: Request, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ev = db.query(models.Evidence).filter(models.Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")
    log_action(db, current_user.id, "EVIDENCE_VIEWED", f"Viewed evidence {ev.evidence_id}", case_id=ev.case_id, evidence_id=ev.id, ip=request.client.host)
    return evidence_to_dict(ev)

@router.get("/{evidence_id}/verify")
def verify_integrity(evidence_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ev = db.query(models.Evidence).filter(models.Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")
    if not os.path.exists(ev.file_path):
        return {"intact": False, "reason": "File not found on disk"}
    current_md5, current_sha256 = compute_hashes(ev.file_path)
    intact = (current_md5 == ev.md5_hash and current_sha256 == ev.sha256_hash)
    return {
        "intact": intact,
        "stored_md5": ev.md5_hash,
        "current_md5": current_md5,
        "stored_sha256": ev.sha256_hash,
        "current_sha256": current_sha256,
        "verified_at": datetime.utcnow().isoformat()
    }

@router.patch("/{evidence_id}/status")
def update_status(evidence_id: int, status: str, request: Request, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ev = db.query(models.Evidence).filter(models.Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")
    old_status = ev.status
    ev.status = status
    db.commit()
    log_action(db, current_user.id, "EVIDENCE_STATUS_CHANGED", f"Status changed from {old_status} to {status} for {ev.evidence_id}", case_id=ev.case_id, evidence_id=ev.id, ip=request.client.host)
    return evidence_to_dict(ev)

@router.get("/{evidence_id}/download")
def download_evidence(evidence_id: int, request: Request, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ev = db.query(models.Evidence).filter(models.Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")
    if not os.path.exists(ev.file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    log_action(db, current_user.id, "EVIDENCE_DOWNLOADED", f"Downloaded evidence {ev.evidence_id}", case_id=ev.case_id, evidence_id=ev.id, ip=request.client.host)
    return FileResponse(ev.file_path, filename=ev.original_filename)
