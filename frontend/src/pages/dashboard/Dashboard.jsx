// =====================================================
// DASHBOARD - Main Layout with Sidebar
// =====================================================
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnalyticsView from './AnalyticsView';
import ResponsesTable from './ResponsesTable';
import MakeUser from './MakeUser';
import QuestionnaireView from './QuestionnaireView';
import './Dashboard.css';

const NAV_ITEMS = [
  { id: 'analytics', label: 'Analytics & Charts', icon: '📊', path: '/dashboard' },
  { id: 'responses', label: 'Jawaabaha (Responses)', icon: '📋', path: '/dashboard/responses' },
  { id: 'questionnaire', label: 'Eeg Sahanka (Preview)', icon: '📝', path: '/dashboard/questionnaire' },
  { id: 'make-user', label: 'Abuur Isticmaale', icon: '👤', path: '/dashboard/users' },
  { id: 'survey', label: 'Sahanka Dadweynaha', icon: '🌐', path: '/survey', external: true },
];

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Update clock every minute
  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleString('so-SO', { dateStyle: 'medium', timeStyle: 'short' }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const handleNav = (item) => {
    if (item.external) { window.open(item.path, '_blank'); return; }
    navigate(item.path);
    setSidebarOpen(false);
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  // Page title based on current route
  const pageTitle = location.pathname.includes('responses') ? 'Jawaabaha Sahan (Responses)' : 'Analytics & Charts';

  return (
    <div className="dashboard-layout">
      {/* Overlay for mobile */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">H</div>
          <h2>Hormuud University</h2>
          <p>Cloud Survey Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Menu</p>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item${isActive(item.path) && !item.external ? ' active' : ''}`}
              onClick={() => handleNav(item)}
            >
              <span className="item-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={logout}>
            <div className="avatar">{admin?.username?.[0]?.toUpperCase() || 'A'}</div>
            <div className="user-info">
              <div className="user-name">{admin?.username || 'Admin'}</div>
              <div className="user-role">Super Admin</div>
            </div>
            <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>↩</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen((o) => !o)}>☰</button>
            <span className="page-title">{pageTitle}</span>
          </div>
          <div className="header-right">
            <span className="header-time">🕐 {currentTime}</span>
            <button className="btn btn-secondary btn-sm" onClick={logout}>↩ Ka bax</button>
          </div>
        </header>

        <div className="dashboard-body">
          <Routes>
            <Route path="/" element={<AnalyticsView />} />
            <Route path="/responses" element={<ResponsesTable />} />
            <Route path="/users" element={<MakeUser />} />
            <Route path="/questionnaire" element={<QuestionnaireView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
