import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import './DashboardNav.css';

const navItems = [
  { to: '/my-tasks', label: 'My Tasks' },
  { to: '/create', label: 'Create Task' },
  { to: '/shared', label: 'Shared With Me' },
  // Add more nav items as needed
];

const DashboardNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-links">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`dashboard-nav-link${location.pathname === item.to ? ' active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <button onClick={handleLogout} className="dashboard-nav-logout">Logout</button>
    </nav>
  );
};

export default DashboardNav;
