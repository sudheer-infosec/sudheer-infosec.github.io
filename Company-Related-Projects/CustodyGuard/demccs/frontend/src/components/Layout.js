import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: '◈',
  cases: '▤',
  evidence: '◎',
  audit: '≡',
  users: '⊙',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-text">Custody Guard</div>
          <div className="logo-sub">Chain of Custody System</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="icon">{icons.dashboard}</span> Dashboard
          </NavLink>
          <NavLink to="/cases" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="icon">{icons.cases}</span> Cases
          </NavLink>
          <NavLink to="/evidence" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="icon">{icons.evidence}</span> Evidence
          </NavLink>

          <div className="nav-section-label">Monitoring</div>
          <NavLink to="/audit" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="icon">{icons.audit}</span> Audit Logs
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/users" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="icon">{icons.users}</span> Users
            </NavLink>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>⎋ Sign Out</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
