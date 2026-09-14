import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function fmt(dateStr) {
  return new Date(dateStr).toLocaleString();
}

const ACTION_COLORS = {
  CASE_CREATED: 'var(--green)',
  CASE_UPDATED: 'var(--yellow)',
  CASE_DELETED: 'var(--red)',
  EVIDENCE_UPLOADED: 'var(--accent)',
  EVIDENCE_VIEWED: 'var(--purple)',
  EVIDENCE_DOWNLOADED: 'var(--yellow)',
  EVIDENCE_STATUS_CHANGED: 'var(--green)',
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    api.get('/audit/?limit=200').then(r => setLogs(r.data)).finally(() => setLoading(false));
  }, []);

  const actions = [...new Set(logs.map(l => l.action))];

  const filtered = logs.filter(l => {
    const matchSearch =
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase());
    const matchAction = !filterAction || l.action === filterAction;
    return matchSearch && matchAction;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Audit Logs</div>
          <div className="page-subtitle">Immutable record of all system activity</div>
        </div>
      </div>

      <div className="search-bar" style={{ flexWrap: 'wrap' }}>
        <input
          placeholder="Search by description or user..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
          style={{ width: 'auto', minWidth: 200 }}
        >
          <option value="">All Actions</option>
          {actions.map(a => (
            <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading audit logs...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">≡</div>
            <div className="empty-state-text">No audit logs found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>User</th>
                  <th>IP Address</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text3)', fontSize: 12 }}>{log.id}</td>
                    <td>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: ACTION_COLORS[log.action] || 'var(--text3)',
                        background: `${ACTION_COLORS[log.action] || 'var(--text3)'}18`,
                        padding: '2px 7px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap'
                      }}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text2)', maxWidth: 320 }}>{log.description}</td>
                    <td style={{ color: 'var(--text)', fontWeight: 600 }}>{log.user}</td>
                    <td style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {log.ip_address || '—'}
                    </td>
                    <td style={{ color: 'var(--text3)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {fmt(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text3)', textAlign: 'right' }}>
        Showing {filtered.length} of {logs.length} log entries — append-only, tamper-proof record
      </div>
    </div>
  );
}
