import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/cases/').then(r => setCases(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/cases/', form);
      setShowModal(false);
      setForm({ title: '', description: '', priority: 'medium' });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = cases.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.case_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cases</div>
          <div className="page-subtitle">{cases.length} investigation{cases.length !== 1 ? 's' : ''} on record</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Case</button>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search by title or case number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading cases...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">▤</div>
            <div className="empty-state-text">{search ? 'No cases match your search' : 'No cases yet — create one to get started'}</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Case Number</th>
                  <th>Title</th>
                  <th>Investigator</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Evidence</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {c.case_number}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text)', fontWeight: 600 }}>{c.title}</td>
                    <td>{c.investigator_name || '—'}</td>
                    <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                    <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                    <td style={{ color: 'var(--accent)' }}>{c.evidence_count}</td>
                    <td style={{ color: 'var(--text3)', fontSize: 12 }}>{timeAgo(c.created_at)}</td>
                    <td>
                      <Link to={`/cases/${c.id}`} className="btn btn-secondary btn-sm">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">▤ New Investigation Case</div>
            {error && <div className="alert alert-error">⚠ {error}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Case Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Corporate Data Breach Investigation"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief overview of the case..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
