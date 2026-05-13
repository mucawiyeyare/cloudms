// =====================================================
// APP.JSX - Main Router
// =====================================================
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SurveyForm from './pages/SurveyForm';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import Dashboard from './pages/dashboard/Dashboard';
import './index.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

// NOTE: AuthProvider must be inside Router so it can use useNavigate
function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Survey Form */}
        <Route path="/survey" element={<SurveyForm />} />

        {/* Admin Signup (First Page) */}
        <Route path="/" element={<AdminSignup />} />

        {/* Admin Login */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
