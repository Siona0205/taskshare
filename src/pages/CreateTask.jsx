import React, { useState } from 'react';
import DashboardNav from '../components/DashboardNav';
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

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [success, setSuccess] = useState('');

  // Actual create task function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    const token = localStorage.getItem('token');
    if (!title || !description || !dueDate) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, dueDate })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create task');
      }
      setSuccess('Task created!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setTimeout(() => setSuccess(''), 1500);
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
        <h2 className="notepad-header">Create New Task</h2>
        <SpiralBinding />
        <div className="notepad-paper">
          <div className="notepad-lines">
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ top: `${2.5 + i * 2.1}rem`, height: 0 }} />
            ))}
          </div>
          <div className="notepad-margin" />
          <form className="notepad-form" onSubmit={handleSubmit}>
            <label className="notepad-label">Title</label>
            <input type="text" className="notepad-input" value={title} onChange={e => setTitle(e.target.value)} required />
            <label className="notepad-label">Description</label>
            <textarea className="notepad-textarea" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
            <label className="notepad-label">Due Date</label>
            <input type="date" className="notepad-input" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            {success && <div className="notepad-success">{success}</div>}
            <button type="submit" className="notepad-form-btn">Create Task</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
