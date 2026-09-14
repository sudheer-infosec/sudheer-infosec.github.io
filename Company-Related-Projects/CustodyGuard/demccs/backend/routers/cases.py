from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth_utils import get_current_user
import models
import uuid
from datetime import datetime

router = APIRouter()

class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

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

def case_to_dict(c):
    return {
        "id": c.id,
        "case_number": c.case_number,
        "title": c.title,
        "description": c.description,
        "status": c.status,
        "priority": c.priority,
        "investigator_id": c.investigator_id,
        "investigator_name": c.investigator.name if c.investigator else None,
        "evidence_count": len(c.evidence),
        "created_at": c.created_at.isoformat(),
        "updated_at": c.updated_at.isoformat() if c.updated_at else None,
    }

@router.post("/", status_code=201)
def create_case(req: CaseCreate, request: Request, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    case_number = f"CASE-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    case = models.Case(
        case_number=case_number,
        title=req.title,
        description=req.description,
        priority=req.priority,
        investigator_id=current_user.id
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    log_action(db, current_user.id, "CASE_CREATED", f"Created case: {case.case_number}", case_id=case.id, ip=request.client.host)
    return case_to_dict(case)

@router.get("/")
def list_cases(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role == models.UserRole.admin:
        cases = db.query(models.Case).all()
    else:
        cases = db.query(models.Case).filter(models.Case.investigator_id == current_user.id).all()
    return [case_to_dict(c) for c in cases]

@router.get("/stats")
def case_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role == models.UserRole.admin:
        cases = db.query(models.Case).all()
        total_evidence = db.query(models.Evidence).count()
        total_users = db.query(models.User).count()
    else:
        cases = db.query(models.Case).filter(models.Case.investigator_id == current_user.id).all()
        case_ids = [c.id for c in cases]
        total_evidence = db.query(models.Evidence).filter(models.Evidence.case_id.in_(case_ids)).count() if case_ids else 0
        total_users = 1

    total = len(cases)
    open_cases = sum(1 for c in cases if c.status == "open")
    closed = sum(1 for c in cases if c.status == "closed")
    return {
        "total_cases": total,
        "open_cases": open_cases,
        "closed_cases": closed,
        "total_evidence": total_evidence,
        "total_users": total_users,
        "recent_cases": [case_to_dict(c) for c in sorted(cases, key=lambda x: x.created_at, reverse=True)[:5]]
    }

@router.get("/{case_id}")
def get_case(case_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case_to_dict(case)

@router.patch("/{case_id}")
def update_case(case_id: int, req: CaseUpdate, request: Request, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if req.title: case.title = req.title
    if req.description: case.description = req.description
    if req.status: case.status = req.status
    if req.priority: case.priority = req.priority
    case.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(case)
    log_action(db, current_user.id, "CASE_UPDATED", f"Updated case: {case.case_number}", case_id=case.id, ip=request.client.host)
    return case_to_dict(case)

@router.delete("/{case_id}")
def delete_case(case_id: int, request: Request, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin only")
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    log_action(db, current_user.id, "CASE_DELETED", f"Deleted case: {case.case_number}", ip=request.client.host)
    db.delete(case)
    db.commit()
    return {"message": "Case deleted"}
