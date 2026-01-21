
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import { User, UserRole } from '../../backend/types';
import { getCurrentUser } from '../../backend/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('bragboard_user');
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    initAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('bragboard_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bragboard_user');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} />
            <Route path="/" element={user ? <Dashboard currentUser={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
