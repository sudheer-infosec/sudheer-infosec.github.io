import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

export default function CaseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [uploadForm, setUploadForm] = useState({ description: '', device_info: '', location_acquired: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [tab, setTab] = useState('evidence');

  const load = () => {
    Promise.all([
      api.get(`/cases/${id}`),
      api.get(`/evidence/?case_id=${id}`),
      api.get(`/audit/?case_id=${id}&limit=30`)
    ]).then(([c, e, l]) => {
      setCaseData(c.data);
      setEditForm({ title: c.data.title, description: c.data.description, status: c.data.status, priority: c.data.priority });
      setEvidence(e.data);
      setLogs(l.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('case_id', id);
    if (uploadForm.description) fd.append('description', uploadForm.description);
    if (uploadForm.device_info) fd.append('device_info', uploadForm.device_info);
    if (uploadForm.location_acquired) fd.append('location_acquired', uploadForm.location_acquired);
    try {
      await api.post('/evidence/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowUpload(false);
      setFile(null);
      setUploadForm({ description: '', device_info: '', location_acquired: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/cases/${id}`, editForm);
      setShowEdit(false);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this case? This cannot be undone.')) return;
    await api.delete(`/cases/${id}`);
    navigate('/cases');
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading case...</div>;
  if (!caseData) return <div className="alert alert-error">Case not found</div>;

  const actionColors = {
    EVIDENCE_UPLOADED: 'var(--accent)',
    EVIDENCE_VIEWED: 'var(--purple)',
    EVIDENCE_DOWNLOADED: 'var(--yellow)',
    EVIDENCE_STATUS_CHANGED: 'var(--yellow)',
    CASE_UPDATED: 'var(--green)',
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link to="/cases" style={{ color: 'var(--text3)', fontSize: 13 }}>← Cases</Link>
      </div>

      <div className="page-header">
        <div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
            {caseData.case_number}
          </div>
          <div className="page-title">{caseData.title}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
            <span className={`badge badge-${caseData.status}`}>{caseData.status}</span>
            <span className={`badge badge-${caseData.priority}`}>{caseData.priority} priority</span>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>
              Investigator: {caseData.investigator_name || '—'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setShowEdit(true)}>Edit Case</button>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>+ Upload Evidence</button>
          {user?.role === 'admin' && (
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>

      {caseData.description && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>{caseData.description}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 2 }}>Created</div>
              <div style={{ fontSize: 13 }}>{fmt(caseData.created_at)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 2 }}>Last Updated</div>
              <div style={{ fontSize: 13 }}>{fmt(caseData.updated_at)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {['evidence', 'audit'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none', border: 'none', padding: '10px 16px',
              color: tab === t ? 'var(--accent)' : 'var(--text3)',
              fontFamily: 'var(--font-mono)', fontSize: 13, cursor: 'pointer',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1, textTransform: 'capitalize', fontWeight: tab === t ? 700 : 400
            }}
          >
            {t === 'evidence' ? `Evidence (${evidence.length})` : `Audit Log (${logs.length})`}
          </button>
        ))}
      </div>

      {tab === 'evidence' && (
        <div className="card" style={{ padding: 0 }}>
          {evidence.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">◎</div>
              <div className="empty-state-text">No evidence uploaded yet</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Evidence ID</th>
                    <th>File</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Collected By</th>
                    <th>Collected At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {evidence.map(ev => (
                    <tr key={ev.id}>
                      <td style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {ev.evidence_id}
                      </td>
                      <td style={{ color: 'var(--text)' }}>{ev.original_filename}</td>
                      <td>{fmtSize(ev.file_size)}</td>
                      <td><span className={`badge badge-${ev.status}`}>{ev.status?.replace(/_/g, ' ')}</span></td>
                      <td>{ev.collected_by}</td>
                      <td style={{ fontSize: 12, color: 'var(--text3)' }}>{fmt(ev.collected_at)}</td>
                      <td>
                        <Link to={`/evidence/${ev.id}`} className="btn btn-secondary btn-sm">View →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'audit' && (
        <div className="card">
          {logs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">≡</div>
              <div className="empty-state-text">No audit logs for this case</div>
            </div>
          ) : logs.map(log => (
            <div className="audit-log-item" key={log.id}>
              <div className="audit-dot" style={{ background: actionColors[log.action] || 'var(--text3)' }} />
              <div>
                <div className="audit-action" style={{ color: actionColors[log.action] || 'var(--text3)' }}>
                  {log.action.replace(/_/g, ' ')}
                </div>
                <div className="audit-desc">{log.description}</div>
                <div className="audit-meta">{log.user} · {fmt(log.timestamp)} · {log.ip_address}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">◎ Upload Evidence</div>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Select File *</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} required
                  style={{ padding: '8px', cursor: 'pointer' }} />
                {file && (
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text3)' }}>
                    {file.name} — {(file.size / 1024).toFixed(1)} KB
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Describe this evidence item..."
                  rows={2} style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Device Info</label>
                  <input
                    value={uploadForm.device_info}
                    onChange={e => setUploadForm({ ...uploadForm, device_info: e.target.value })}
                    placeholder="e.g., iPhone 14, Samsung HDD"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location Acquired</label>
                  <input
                    value={uploadForm.location_acquired}
                    onChange={e => setUploadForm({ ...uploadForm, location_acquired: e.target.value })}
                    placeholder="e.g., Crime scene, Office"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading || !file}>
                  {uploading ? 'Uploading & Hashing...' : '⬆ Upload Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Edit Case</div>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select value={editForm.priority} onChange={e => setEditForm({ ...editForm, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
