
# Custody Guard

**A Digital Evidence Chain of Custody Management System**


## 1. Overview

Custody Guard is a full-stack digital forensic evidence management system designed to ensure the integrity, traceability, and authenticity of digital evidence throughout its lifecycle.

In digital forensics, the validity of evidence is highly sensitive to even minor inconsistencies. Undetected modifications or incomplete records can compromise investigations and render evidence inadmissible in legal proceedings. Custody Guard addresses this challenge by implementing a structured, tamper-aware, and audit-driven system where every interaction with evidence is securely recorded and verifiable.

The system enforces accountability, transparency, and consistency in handling digital evidence, thereby supporting reliable forensic analysis and legal compliance.



## 2. Core Objectives

* Preserve the integrity of the chain of custody
* Detect and prevent unauthorized evidence tampering
* Enable transparent and structured forensic workflows
* Provide secure, role-based access control
* Maintain comprehensive and legally defensible audit trails



## 3. System Architecture

```
                ┌──────────────────────┐
                │     React Frontend   │
                │  (User Interface)    │
                └─────────┬────────────┘
                          │ API Calls (JWT)
                          ▼
                ┌──────────────────────┐
                │     FastAPI Backend  │
                │  (Business Logic)    │
                └─────────┬────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌────────────────┐
│ Database     │  │ Hash Engine  │  │ Audit Logger   │
│ (SQLAlchemy) │  │ (SHA-256)    │  │ (Immutable)    │
└──────────────┘  └──────────────┘  └────────────────┘
```



## 4. Project Structure

```
demccs/
├── backend/               # FastAPI backend
│   ├── main.py            # Application entry point
│   ├── database.py        # Database configuration
│   ├── models.py          # Data models: User, Case, Evidence, AuditLog
│   ├── auth_utils.py      # JWT authentication and password hashing
│   ├── requirements.txt
│   └── routers/           # API route modules
│       ├── auth.py
│       ├── cases.py
│       ├── evidence.py
│       └── audit.py
│
└── frontend/              # React frontend
    ├── public/
    └── src/
        ├── context/       # Authentication state management
        ├── utils/         # API integration utilities
        ├── components/    # Reusable UI components
        └── pages/         # Application pages
```

---

## 5. Features

### 5.1 Authentication and Authorization

* Stateless authentication using JSON Web Tokens (JWT)
* Secure password storage using bcrypt hashing
* Role-based access control:

  * **Administrator**: full system access
  * **Investigator**: operational access to cases and evidence



### 5.2 Case Management

* Creation and management of investigation cases
* Unique case identifiers for traceability
* Priority classification (High, Medium, Low)
* Case status lifecycle (Open, Closed, On Hold)
* Search and filtering capabilities for efficient navigation



### 5.3 Evidence Management

* Secure file upload with associated metadata
* Automatic generation of MD5 and SHA-256 hashes
* Defined evidence lifecycle:

  ```
  Acquired → Under Analysis → Awaiting Review → Ready → Archived
  ```
* Controlled and authenticated file downloads with logging



### 5.4 Chain of Custody Tracking

* Comprehensive logging of all actions, including:

  * Upload
  * View
  * Download
  * Status modification
* Timestamped and IP-address-tracked records
* Append-only audit mechanism ensuring no unauthorized modification of logs



### 5.5 Audit Logging

* Immutable logs for forensic and legal review
* Tracking at both case and evidence levels
* Designed to support evidentiary requirements in legal contexts



### 5.6 Security Design

* JWT-secured API endpoints
* Role-based permission enforcement
* Password encryption using bcrypt
* Cross-Origin Resource Sharing (CORS) configuration
* Deployment-ready with HTTPS support



## 6. Technology Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Backend        | FastAPI (Python)       |
| Frontend       | React.js               |
| Database       | SQLAlchemy ORM         |
| Authentication | JWT (python-jose)      |
| Security       | bcrypt                 |
| Hashing        | hashlib (MD5, SHA-256) |



## 7. Integrity Verification Process

1. A file is uploaded into the system
2. The system generates MD5 and SHA-256 hash values
3. These hash values are securely stored with the evidence metadata
4. During verification:

   * The file is reprocessed to generate new hash values
   * The new hashes are compared with the original stored hashes
5. Any mismatch indicates potential tampering and is flagged immediately



## 8. Real-World Applications

* Digital forensic investigations
* Cybercrime analysis
* Law enforcement evidence management
* Corporate incident response
* Legal compliance and auditing


