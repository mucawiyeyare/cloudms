import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminLogin.css';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Fadlan geli magacaaga iyo eraygaaga sirta ah.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { username, password });
      // Redirect to login upon successful registration
      navigate('/login', { state: { msg: '✅ Akoonkaaga si guul leh ayaa loo abuuray. Fadlan hadda soo gal (Login).' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Is-diiwaangelinta ma guulaysanin. Fadlan isku day.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-blur" />
      <div className="login-bg-blur-2" />
      <div className="login-card">
        <div className="login-logo">S</div>
        <h1>Is-Diiwaangeli</h1>
        <p className="subtitle">Abuur Account Cusub (Signup) · Hormuud Cloud Survey</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Magaca Isticmaalaha (Username)</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Tusaale: admin1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Erayga Sirta (Password)</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Ugu yaraan 6 xaraf"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> 
                Waxaa la abuurayaa...
              </span>
            ) : '📝 Abuur Account (Register)'}
          </button>
        </form>

        <div className="login-footer">
          <p>Horey ma u lahayd account?{' '}
            <Link to="/login">Soo Gal (Login)</Link>
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            <Link to="/survey">Ka qaybgal sahankan dadweynaha (Public Survey)</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
