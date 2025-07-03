import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/AuthProvider';
import Register from './pages/Register';
import Login from './pages/Login';
import MyTasks from './pages/MyTasks';
import SharedWithMe from './pages/SharedWithMe';
import CreateTask from './pages/CreateTask';
import ShareTask from './pages/ShareTask';
import './App.css';
import { useContext } from 'react';

function AppRoutes() {
  const { token } = useContext(AuthContext);
  const isAuthenticated = !!token;

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-tasks" element={isAuthenticated ? <MyTasks /> : <Navigate to="/login" />} />
      <Route path="/shared" element={isAuthenticated ? <SharedWithMe /> : <Navigate to="/login" />} />
      <Route path="/create" element={isAuthenticated ? <CreateTask /> : <Navigate to="/login" />} />
      <Route path="/share" element={isAuthenticated ? <ShareTask /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
