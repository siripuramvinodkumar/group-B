
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
import { LogOut, Home, LayoutDashboard, Bell, Trophy, Shield } from 'lucide-react';
import { getPendingReports } from '../services/api';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [reportCount, setReportCount] = useState(0);
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (user.role === UserRole.ADMIN) {
      const checkReports = async () => {
        const reports = await getPendingReports();
        setReportCount(reports.length);
      };
      checkReports();
      const interval = setInterval(checkReports, 30000);
      return () => clearInterval(interval);
    }
  }, [user.role, location.pathname]);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-indigo-100">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                BragBoard
              </span>
            </Link>

            <div className="hidden md:flex space-x-1">
              <Link
                to="/"
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive('/') ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Wall</span>
              </Link>
              <Link
                to="/leaderboard"
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive('/leaderboard') ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Fame</span>
              </Link>
              {user.role === UserRole.ADMIN && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
                    isActive('/admin') ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                  {reportCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white animate-pulse">
                      {reportCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="flex items-center space-x-3 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black border-2 border-white shadow-lg shadow-indigo-100 transition-transform group-hover:scale-105">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{user.name}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{user.department}</p>
                </div>
              </Link>
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-all hover:rotate-12" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
