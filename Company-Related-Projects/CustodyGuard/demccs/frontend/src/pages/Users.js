import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/auth/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Users</div>
          <div className="page-subtitle">{users.length} registered system user{users.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading users...</div>
        ) : filtered.map(u => (
          <div key={u.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44,
                background: u.role === 'admin' ? 'rgba(248,81,73,0.1)' : 'var(--accent-glow)',
                border: `1px solid ${u.role === 'admin' ? 'rgba(248,81,73,0.3)' : 'rgba(0,212,255,0.3)'}`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                color: u.role === 'admin' ? 'var(--red)' : 'var(--accent)',
                fontFamily: 'var(--font-display)'
              }}>
                {initials(u.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email}
                </div>
              </div>
              <span className={`badge badge-${u.role}`}>{u.role}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 2 }}>Status</div>
                <div style={{ fontSize: 13, color: u.is_active ? 'var(--green)' : 'var(--red)' }}>
                  {u.is_active ? '● Active' : '● Inactive'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 2 }}>Joined</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{fmt(u.created_at)}</div>
              </div>
            </div>

            {u.id === user.id && (
              <div style={{ marginTop: 12, padding: '6px 10px', background: 'var(--accent-glow)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, fontSize: 11, color: 'var(--accent)' }}>
                ⊙ This is your account
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">⊙</div>
          <div className="empty-state-text">No users match your search</div>
        </div>
      )}
    </div>
  );
}
