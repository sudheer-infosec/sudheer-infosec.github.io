import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function fmtSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString();
}

export default function Evidence() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    api.get('/evidence/').then(r => setEvidence(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = evidence.filter(ev => {
    const matchSearch =
      ev.evidence_id.toLowerCase().includes(search.toLowerCase()) ||
      ev.original_filename.toLowerCase().includes(search.toLowerCase()) ||
      (ev.case_number || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || ev.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statuses = ['acquired', 'under_analysis', 'awaiting_review', 'ready_for_presentation', 'archived'];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Evidence</div>
          <div className="page-subtitle">{evidence.length} evidence item{evidence.length !== 1 ? 's' : ''} in custody</div>
        </div>
      </div>

      <div className="search-bar" style={{ flexWrap: 'wrap' }}>
        <input
          placeholder="Search by ID, filename, or case number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ width: 'auto', minWidth: 180 }}
        >
          <option value="">All Statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading evidence...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <div className="empty-state-text">{search || filterStatus ? 'No evidence matches filters' : 'No evidence uploaded yet'}</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Evidence ID</th>
                  <th>Filename</th>
                  <th>Case</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Collected By</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ev => (
                  <tr key={ev.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>
                      {ev.evidence_id}
                    </td>
                    <td style={{ color: 'var(--text)' }}>{ev.original_filename}</td>
                    <td>
                      {ev.case_number ? (
                        <Link to={`/cases/${ev.case_id}`} style={{ color: 'var(--text2)', fontSize: 12 }}>
                          {ev.case_number}
                        </Link>
                      ) : '—'}
                    </td>
                    <td style={{ color: 'var(--text3)' }}>{fmtSize(ev.file_size)}</td>
                    <td><span className={`badge badge-${ev.status}`}>{ev.status?.replace(/_/g, ' ')}</span></td>
                    <td style={{ color: 'var(--text2)' }}>{ev.collected_by}</td>
                    <td style={{ color: 'var(--text3)', fontSize: 12 }}>{fmt(ev.collected_at)}</td>
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
    </div>
  );
}
