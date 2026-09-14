# Custody Guard

*By Singuru Sudheer*

---

## Project Structure

```
demccs/
├── backend/               # FastAPI backend
│   ├── main.py            # App entry point
│   ├── database.py        # SQLAlchemy DB config
│   ├── models.py          # DB models (User, Case, Evidence, AuditLog)
│   ├── auth_utils.py      # JWT auth + bcrypt hashing
│   ├── requirements.txt
│   └── routers/
│       ├── auth.py        # Login, register, user management
│       ├── cases.py       # Case CRUD + stats
│       ├── evidence.py    # Evidence upload, hashing, download, verify
│       └── audit.py       # Audit log retrieval
│
└── frontend/              # React frontend
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js / index.css
        ├── context/AuthContext.js
        ├── utils/api.js
        ├── components/Layout.js
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js
            ├── Cases.js
            ├── CaseDetail.js
            ├── Evidence.js
            ├── EvidenceDetail.js
            ├── AuditLogs.js
            └── Users.js
```

---

## Running the Project

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend runs at: **http://localhost:8000**
Interactive API docs: **http://localhost:8000/docs**

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## Features

### Authentication
- JWT-based stateless authentication
- bcrypt password hashing
- Role-based access control (Admin / Investigator)

### Case Management
- Create, view, edit cases with unique case numbers
- Priority levels (High / Medium / Low)
- Status tracking (Open / Closed / On Hold)
- Filter and search

### Evidence Handling
- Secure file upload with metadata capture
- Automatic MD5 + SHA-256 hash generation on upload
- Evidence status workflow (Acquired → Under Analysis → Awaiting Review → Ready for Presentation → Archived)
- Real-time integrity verification (hash comparison)
- Authenticated file download with audit logging

### Chain of Custody
- Every action logged: upload, view, download, status change
- Timestamped, IP-tracked, append-only audit records
- Per-case and per-evidence audit trail views

### Security
- JWT token authentication on all endpoints
- Role-based permission enforcement
- CORS configured for frontend domain
- Encrypted passwords (bcrypt)
- HTTPS-ready (configure with reverse proxy in production)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/auth/users | List users (admin) |
| GET | /api/cases/ | List cases |
| POST | /api/cases/ | Create case |
| GET | /api/cases/stats | Dashboard stats |
| GET | /api/cases/{id} | Case detail |
| PATCH | /api/cases/{id} | Update case |
| DELETE | /api/cases/{id} | Delete case (admin) |
| POST | /api/evidence/upload | Upload evidence file |
| GET | /api/evidence/ | List evidence |
| GET | /api/evidence/{id} | Evidence detail |
| GET | /api/evidence/{id}/verify | Verify file integrity |
| GET | /api/evidence/{id}/download | Download file |
| PATCH | /api/evidence/{id}/status | Update status |
| GET | /api/audit/ | Audit logs |

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend | FastAPI (Python) |
| Frontend | React.js |
| Auth | JWT (python-jose) |
| Passwords | bcrypt (passlib) |
| Hashing | hashlib (MD5 + SHA-256) |
| ORM | SQLAlchemy |

---

## Production Notes

1. Change `SECRET_KEY` in `auth_utils.py` to a long random string
2. Set `DATABASE_URL` env variable to a PostgreSQL URI
3. Run behind NGINX with HTTPS (SSL/TLS)
4. Set `REACT_APP_API_URL` env variable in frontend build
5. Use AWS S3 / Azure Blob for evidence file storage at scale
