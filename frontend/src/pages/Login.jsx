import React, { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const SpiralBinding = () => (
  <div className="auth-spiral">
    {/* Spiral SVG */}
    <svg width="160" height="28" viewBox="0 0 160 28" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, zIndex: 10 }}>
      <g>
        {[...Array(5)].map((_, i) => (
          <ellipse
            key={i}
            cx={20 + i * 30}
            cy={14}
            rx={8}
            ry={12}
            fill="none"
            stroke="#b6b6b6"
            strokeWidth="2.2"
          />
        ))}
      </g>
    </svg>
    {/* Punch Holes */}
    <div style={{ display: 'flex', justifyContent: 'space-between', width: 140, margin: '0 auto', position: 'relative', zIndex: 20 }}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{ width: 12, height: 12, background: 'linear-gradient(to bottom, #e5e7eb, #fff)', borderRadius: '50%', border: '2px solid #d1d5db', boxShadow: '0 2px 6px 0 #b6b6b6', marginTop: -4 }}
        />
      ))}
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Actual login function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Invalid credentials');
      }
      const data = await res.json();
      login(data.token);
      navigate('/my-tasks');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="notepad-project-title">TaskShare</div>
        <h2 className="auth-header">Login</h2>
        <SpiralBinding />
        <div className="auth-card">
          <div className="auth-margin" />
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">Email</label>
            <input type="email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" />
            <label className="auth-label">Password</label>
            <input type="password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className="auth-btn">Login</button>
          </form>
          <p className="mt-6 text-center text-sm">Don't have an account? <a href="/register" className="auth-link">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
