import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import HTMLFlipBook from 'react-pageflip';
import './MyTasks.css';
import './NotepadSlide.css';

// Enhanced spiral and punch holes
const SpiralBinding = () => (
  <div className="notepad-spiral">
    {/* Spiral SVG */}
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
    {/* Punch Holes */}
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

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get token from localStorage (assumes login stores it as 'token')
  const token = localStorage.getItem('token');

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/tasks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  // Mark task as done (update)
  const markDone = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: true })
      });
      if (!res.ok) throw new Error('Failed to mark as done');
      const updated = await res.json();
      setTasks(tasks => tasks.map(t => t._id === id ? updated : t));
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks => tasks.filter(t => t._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Share task
  const shareTask = async (id, email) => {
    try {
      const res = await fetch(`/api/tasks/share/${id}`, {
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
      alert('Task shared successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  // Prompt for email and share
  const handleShare = (id) => {
    const email = window.prompt('Enter the email of the user to share with:');
    if (email) {
      shareTask(id, email);
    }
  };

  return (
    <div className="notepad-bg">
      <div className="notepad-container">
        <div className="notepad-project-title">TaskShare</div>
        <DashboardNav />
        <h2 className="notepad-header">My Tasks</h2>
        <SpiralBinding />
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#bfa77a', fontSize: 18 }}>Loading tasks...</div>
          ) : error ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'red', fontSize: 16 }}>{error}</div>
          ) : (
            <HTMLFlipBook
              width={400}
              height={420}
              size="fixed"
              minWidth={320}
              minHeight={320}
              maxWidth={520}
              maxHeight={600}
              showCover={false}
              mobileScrollSupport={true}
              style={{ boxShadow: '0 8px 32px 0 rgba(180,180,200,0.14)' }}
              className="notepad-paper"
            >
              {/* First page with welcome text */}
              <div className="notepad-task" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 340, background: 'none', boxShadow: 'none' }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#7b5e3b', marginBottom: 12, textAlign: 'center' }}>
                  All your tasks are here!
                </div>
                <div style={{ fontSize: 15, color: '#bfa77a', textAlign: 'center', maxWidth: 260 }}>
                  Flip through the pages to view, complete, delete, or share your tasks.
                </div>
              </div>
              {tasks.length === 0 ? (
                <div className="notepad-task" style={{ textAlign: 'center', padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 340 }}>
                  <p className="text-center text-gray-500" style={{ margin: 0 }}>No tasks yet.</p>
                </div>
              ) : (
                tasks.map((task, idx) => (
                  <div key={task._id} className="notepad-task" style={{ alignItems: 'center', textAlign: 'center', minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 32 }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="notepad-task-title">{task.title}</div>
                      <div className="notepad-task-desc">{task.description}</div>
                      <div className="notepad-task-meta" style={{ justifyContent: 'center' }}>
                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                        <span className={`notepad-status ${task.completed ? 'done' : 'pending'}`}>{task.completed ? 'done' : 'pending'}</span>
                      </div>
                    </div>
                    <div className="notepad-task-actions" style={{ justifyContent: 'center', marginTop: 16 }}>
                      {!task.completed && (
                        <button onClick={() => markDone(task._id)} className="notepad-btn done">Mark Done</button>
                      )}
                      <button onClick={() => deleteTask(task._id)} className="notepad-btn delete">Delete</button>
                      <button onClick={() => handleShare(task._id)} className="notepad-btn share">Share</button>
                    </div>
                    <div style={{ color: '#aaa', fontSize: 14, marginTop: 18 }}>{idx + 1} / {tasks.length}</div>
                  </div>
                ))
              )}
              {/* Last page with completion text */}
              <div className="notepad-task" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 340, background: 'none', boxShadow: 'none' }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#7b5e3b', marginBottom: 12, textAlign: 'center' }}>
                  All tasks are done!
                </div>
                <div style={{ fontSize: 15, color: '#bfa77a', textAlign: 'center', maxWidth: 260 }}>
                  Great job! You have completed all your tasks.
                </div>
              </div>
            </HTMLFlipBook>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
