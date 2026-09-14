import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/cases/stats'),
      api.get('/audit/?limit=8')
    ]).then(([s, l]) => {
      setStats(s.data);
      setLogs(l.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading"><div className="spinner" /> Loading dashboard...</div>
  );

  const statusColor = {
    CASE_CREATED: 'var(--green)',
    CASE_UPDATED: 'var(--yellow)',
    CASE_DELETED: 'var(--red)',
    EVIDENCE_UPLOADED: 'var(--accent)',
    EVIDENCE_VIEWED: 'var(--purple)',
    EVIDENCE_DOWNLOADED: 'var(--yellow)',
    EVIDENCE_STATUS_CHANGED: 'var(--yellow)',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Welcome back, {user?.name} — {new Date().toDateString()}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Cases</div>
          <div className="stat-value">{stats?.total_cases ?? 0}</div>
          <div className="stat-sub">All investigations</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Open Cases</div>
          <div className="stat-value">{stats?.open_cases ?? 0}</div>
          <div className="stat-sub">Active investigations</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Evidence Items</div>
          <div className="stat-value">{stats?.total_evidence ?? 0}</div>
          <div className="stat-sub">Secured artifacts</div>
        </div>
        {user?.role === 'admin' && (
          <div className="stat-card yellow">
            <div className="stat-label">System Users</div>
            <div className="stat-value">{stats?.total_users ?? 0}</div>
            <div className="stat-sub">Registered officers</div>
          </div>
        )}
        <div className="stat-card red">
          <div className="stat-label">Closed Cases</div>
          <div className="stat-value">{stats?.closed_cases ?? 0}</div>
          <div className="stat-sub">Completed investigations</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Cases</div>
            <Link to="/cases" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {stats?.recent_cases?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">▤</div>
              <div className="empty-state-text">No cases yet</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Case #</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_cases?.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer' }}>
                      <td>
                        <Link to={`/cases/${c.id}`} style={{ color: 'var(--accent)', fontWeight: 700 }}>
                          {c.case_number}
                        </Link>
                      </td>
                      <td>{c.title}</td>
                      <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                      <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                      <td style={{ color: 'var(--text3)', fontSize: 12 }}>{timeAgo(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Audit Trail</div>
            <Link to="/audit" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {logs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">≡</div>
              <div className="empty-state-text">No activity yet</div>
            </div>
          ) : (
            <div>
              {logs.map(log => (
                <div className="audit-log-item" key={log.id}>
                  <div className="audit-dot" style={{ background: statusColor[log.action] || 'var(--text3)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="audit-action" style={{ color: statusColor[log.action] || 'var(--text3)' }}>
                      {log.action.replace(/_/g, ' ')}
                    </div>
                    <div className="audit-desc" style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.description}
                    </div>
                    <div className="audit-meta">{log.user} · {timeAgo(log.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
