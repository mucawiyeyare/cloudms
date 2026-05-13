import { useState } from 'react';
import api from '../../services/api';

export default function MakeUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMsg({ text: 'Waa inaad gelisaa magaca iyo erayga sirta.', type: 'error' });
      return;
    }

    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.post('/auth/register', { username, password });
      setMsg({ text: res.data.message, type: 'success' });
      setUsername('');
      setPassword('');
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || 'Cilad ayaa dhacday markii la abuurayay isticmaalaha.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px' }}>
      <h2 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>Abuur Isticmaale Cusub</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Halkan waxaad ka abuuri kartaa Account Admin cusub oo Dashboard-ka geli kara.
      </p>

      {msg.text && (
        <div className={`alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Magaca Isticmaalaha (Username)</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tusaale: admin2"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Erayga Sirta (Password)</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ugu yaraan 6 xaraf"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-full mt-2" 
          disabled={loading}
        >
          {loading ? 'Waxaa la abuurayaa...' : 'Abuur Isticmaale'}
        </button>
      </form>
    </div>
  );
}
