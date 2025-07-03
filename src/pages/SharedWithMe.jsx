import React, { useState, useEffect } from 'react';
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

const SharedWithMe = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedTasks = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/tasks/shared', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch shared tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSharedTasks();
  }, []);

  return (
    <div className="notepad-bg">
      <div className="notepad-container">
        <div className="notepad-project-title">TaskShare</div>
        <DashboardNav />
        <h2 className="notepad-header">Shared With Me</h2>
        <SpiralBinding />
        <div className="notepad-paper">
          <div className="notepad-lines">
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ top: `${2.5 + i * 2.1}rem`, height: 0 }} />
            ))}
          </div>
          <div className="notepad-margin" />
          {loading ? (
            <p className="text-center text-gray-500">Loading shared tasks...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-500">No shared tasks yet.</p>
          ) : (
            <ul className="notepad-list">
              {tasks.map(task => (
                <li key={task._id} className="notepad-shared-task">
                  <div className="notepad-shared-title">{task.title}</div>
                  <div className="notepad-shared-desc">{task.description}</div>
                  <div className="notepad-shared-meta">
                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                    <span>Shared by: {task.owner && task.owner.name ? task.owner.name : 'Unknown'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedWithMe;
