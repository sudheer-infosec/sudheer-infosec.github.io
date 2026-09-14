from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    investigator = "investigator"
    viewer = "viewer"

class EvidenceStatus(str, enum.Enum):
    acquired = "acquired"
    under_analysis = "under_analysis"
    awaiting_review = "awaiting_review"
    ready_for_presentation = "ready_for_presentation"
    archived = "archived"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.investigator)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    cases = relationship("Case", back_populates="investigator")
    audit_logs = relationship("AuditLog", back_populates="user")

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="open")
    priority = Column(String, default="medium")
    investigator_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    investigator = relationship("User", back_populates="cases")
    evidence = relationship("Evidence", back_populates="case")

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, unique=True, index=True, nullable=False)
    case_id = Column(Integer, ForeignKey("cases.id"))
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)
    file_type = Column(String)
    md5_hash = Column(String)
    sha256_hash = Column(String)
    description = Column(Text)
    device_info = Column(String)
    location_acquired = Column(String)
    status = Column(Enum(EvidenceStatus), default=EvidenceStatus.acquired)
    collected_by_id = Column(Integer, ForeignKey("users.id"))
    collected_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    case = relationship("Case", back_populates="evidence")
    collected_by = relationship("User")
    audit_logs = relationship("AuditLog", back_populates="evidence")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    description = Column(Text)
    ip_address = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="audit_logs")
    evidence = relationship("Evidence", back_populates="audit_logs")
