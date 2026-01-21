
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../../backend/types';
import { LogOut, Home, LayoutDashboard, Trophy, Shield } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-xl"><LayoutDashboard className="h-5 w-5 text-white" /></div>
            <span className="text-xl font-black text-slate-900">BragBoard</span>
          </Link>
          <div className="hidden md:flex space-x-1">
            <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-bold ${isActive('/') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}>Wall</Link>
            <Link to="/leaderboard" className={`px-4 py-2 rounded-xl text-sm font-bold ${isActive('/leaderboard') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}>Fame</Link>
            {user.role === UserRole.ADMIN && <Link to="/admin" className={`px-4 py-2 rounded-xl text-sm font-bold ${isActive('/admin') ? 'bg-rose-50 text-rose-700' : 'text-slate-500'}`}>Admin</Link>}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs font-black text-slate-900">{user.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{user.department}</p>
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-rose-600"><LogOut className="h-5 w-5" /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
