import React, { useState } from 'react';
import DashboardNav from '../components/DashboardNav';
import { useLocation } from 'react-router-dom';
import './NotepadCommon.css';

const SpiralBinding = () => (
  <div className="notepad-spiral">
    <svg width="320" height="38" viewBox="0 0 320 38" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, zIndex: 10 }}>
      <g>
        {[...Array(10)].map((_, i) => (
          <ellipse
            key={i}
            cx={20 + i * 30}
            cy={19}
            rx={10}
            ry={15}
            fill="none"
            stroke="#b6b6b6"
            strokeWidth="2.5"
          />
        ))}
      </g>
    </svg>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: 300, margin: '0 auto', position: 'relative', zIndex: 20 }}>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          style={{ width: 16, height: 16, background: 'linear-gradient(to bottom, #e5e7eb, #fff)', borderRadius: '50%', border: '2px solid #d1d5db', boxShadow: '0 2px 8px 0 #b6b6b6', marginTop: -4 }}
        />
      ))}
    </div>
  </div>
);

const ShareTask = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();

  // Get taskId from query params
  const params = new URLSearchParams(location.search);
  const taskId = params.get('taskId');

  // Actual share function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    const token = localStorage.getItem('token');
    setSuccess('');
    try {
      const res = await fetch(`/api/tasks/share/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to share task');
      }
      setSuccess(`Task ${taskId} shared with ${email}!`);
      setEmail('');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setSuccess(err.message);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className="notepad-bg">
      <div className="notepad-container">
        <div className="notepad-project-title">TaskShare</div>
        <DashboardNav />
        <h2 className="notepad-header">Share Task</h2>
        <SpiralBinding />
        <div className="notepad-paper">
          <div className="notepad-lines">
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ top: `${2.5 + i * 2.1}rem`, height: 0 }} />
            ))}
          </div>
          <div className="notepad-margin" />
          <form className="notepad-form" onSubmit={handleSubmit}>
            <label className="notepad-label">Friend's Email</label>
            <input type="email" className="notepad-input" value={email} onChange={e => setEmail(e.target.value)} required />
            {success && <div className="notepad-success">{success}</div>}
            <button type="submit" className="notepad-form-btn">Share Task</button>
          </form>
          {taskId && <p className="text-center text-gray-500 text-sm mt-4">Sharing Task ID: {taskId}</p>}
        </div>
      </div>
    </div>
  );
};

export default ShareTask;
