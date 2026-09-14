from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from auth_utils import get_current_user
import models

router = APIRouter()

@router.get("/")
def get_audit_logs(
    case_id: Optional[int] = None,
    evidence_id: Optional[int] = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.AuditLog)
    if case_id:
        query = query.filter(models.AuditLog.case_id == case_id)
    if evidence_id:
        query = query.filter(models.AuditLog.evidence_id == evidence_id)
    if current_user.role != models.UserRole.admin:
        # Investigators see logs for their own actions
        query = query.filter(models.AuditLog.user_id == current_user.id)
    
    logs = query.order_by(models.AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": log.id,
            "action": log.action,
            "description": log.description,
            "user": log.user.name if log.user else "Unknown",
            "user_id": log.user_id,
            "case_id": log.case_id,
            "evidence_id": log.evidence_id,
            "ip_address": log.ip_address,
            "timestamp": log.timestamp.isoformat()
        }
        for log in logs
    ]
