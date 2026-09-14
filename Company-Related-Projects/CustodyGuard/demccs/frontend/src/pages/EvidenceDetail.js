import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

function fmtSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUSES = ['acquired', 'under_analysis', 'awaiting_review', 'ready_for_presentation', 'archived'];

export default function EvidenceDetail() {
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [integrity, setIntegrity] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = () => {
    Promise.all([
      api.get(`/evidence/${id}`),
      api.get(`/audit/?evidence_id=${id}&limit=30`)
    ]).then(([e, l]) => {
      setEv(e.data);
      setLogs(l.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const verify = async () => {
    setVerifying(true);
    setIntegrity(null);
    try {
      const r = await api.get(`/evidence/${id}/verify`);
      setIntegrity(r.data);
    } catch (err) {
      alert('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.patch(`/evidence/${id}/status?status=${newStatus}`);
      load();
    } catch (err) {
      alert('Status update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownload = async () => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    const a = document.createElement('a');
    a.href = `${baseUrl}/evidence/${id}/download`;
    a.download = ev.original_filename;
    // Use fetch for auth
    fetch(`${baseUrl}/evidence/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.blob()).then(blob => {
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading evidence...</div>;
  if (!ev) return <div className="alert alert-error">Evidence not found</div>;

  const actionColors = {
    EVIDENCE_UPLOADED: 'var(--accent)',
    EVIDENCE_VIEWED: 'var(--purple)',
    EVIDENCE_DOWNLOADED: 'var(--yellow)',
    EVIDENCE_STATUS_CHANGED: 'var(--green)',
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link to={`/cases/${ev.case_id}`} style={{ color: 'var(--text3)', fontSize: 13 }}>← Back to Case</Link>
      </div>

      <div className="page-header">
        <div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
            {ev.evidence_id}
          </div>
          <div className="page-title">{ev.original_filename}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <span className={`badge badge-${ev.status}`}>{ev.status?.replace(/_/g, ' ')}</span>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>
              Case: <Link to={`/cases/${ev.case_id}`}>{ev.case_number}</Link>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={verify} disabled={verifying}>
            {verifying ? 'Verifying...' : '⬡ Verify Integrity'}
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>⬇ Download</button>
        </div>
      </div>

      {/* Integrity Result */}
      {integrity && (
        <div className={`alert ${integrity.intact ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
          {integrity.intact ? (
            <span className="integrity-ok">✓ File integrity verified — no tampering detected</span>
          ) : (
            <span className="integrity-fail">✗ INTEGRITY VIOLATION — file has been modified!</span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.7 }}>Verified at {fmt(integrity.verified_at)}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Metadata */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Evidence Metadata</div>
          <div className="detail-grid" style={{ gap: 14 }}>
            {[
              ['Evidence ID', ev.evidence_id],
              ['Original Filename', ev.original_filename],
              ['File Size', fmtSize(ev.file_size)],
              ['File Type', ev.file_type || '—'],
              ['Collected By', ev.collected_by || '—'],
              ['Collected At', fmt(ev.collected_at)],
              ['Device Info', ev.device_info || '—'],
              ['Location Acquired', ev.location_acquired || '—'],
            ].map(([label, value]) => (
              <div className="detail-item" key={label}>
                <div className="label">{label}</div>
                <div className="value" style={{ fontSize: 13 }}>{value}</div>
              </div>
            ))}
          </div>
          {ev.description && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 6 }}>Description</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>{ev.description}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Cryptographic Hashes */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Cryptographic Hashes</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 6 }}>MD5</div>
              <div className="hash-value">{ev.md5_hash || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 6 }}>SHA-256</div>
              <div className="hash-value">{ev.sha256_hash || '—'}</div>
            </div>

            {integrity && !integrity.intact && (
              <div style={{ marginTop: 14, padding: 12, background: 'rgba(248,81,73,0.05)', borderRadius: 6, border: '1px solid rgba(248,81,73,0.2)' }}>
                <div style={{ fontSize: 11, color: 'var(--red)', fontWeight: 700, marginBottom: 6 }}>HASH MISMATCH DETECTED</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>Current MD5: <span style={{ color: 'var(--red)' }}>{integrity.current_md5}</span></div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Current SHA-256: <span style={{ color: 'var(--red)' }}>{integrity.current_sha256}</span></div>
              </div>
            )}
          </div>

          {/* Status Update */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Update Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updatingStatus || ev.status === s}
                  style={{
                    background: ev.status === s ? 'var(--accent-glow)' : 'transparent',
                    border: `1px solid ${ev.status === s ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                    color: ev.status === s ? 'var(--accent)' : 'var(--text2)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    cursor: ev.status === s ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  {ev.status === s ? '✓ ' : ''}{s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>Chain of Custody</div>
        {logs.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px' }}>
            <div className="empty-state-text">No audit records yet</div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 3, top: 8, bottom: 8,
              width: 1, background: 'var(--border)'
            }} />
            {logs.map(log => (
              <div className="audit-log-item" key={log.id}>
                <div className="audit-dot" style={{ background: actionColors[log.action] || 'var(--text3)', zIndex: 1 }} />
                <div>
                  <div className="audit-action" style={{ color: actionColors[log.action] || 'var(--text3)' }}>
                    {log.action.replace(/_/g, ' ')}
                  </div>
                  <div className="audit-desc">{log.description}</div>
                  <div className="audit-meta">
                    {log.user} · {fmt(log.timestamp)}
                    {log.ip_address && ` · IP: ${log.ip_address}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
