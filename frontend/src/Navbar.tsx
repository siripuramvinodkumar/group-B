
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../../backend/types';
import { LogOut, LayoutDashboard, Trophy, Shield, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between h-20 items-center">
        <div className="flex items-center space-x-12">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100 transition-transform group-hover:scale-110 group-hover:rotate-6">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">BragBoard</span>
          </Link>
          <div className="hidden md:flex space-x-2">
            <NavLink to="/" label="Wall" active={isActive('/')} />
            <NavLink to="/leaderboard" label="Fame" active={isActive('/leaderboard')} />
            {user.role === UserRole.ADMIN && <NavLink to="/admin" label="Admin" active={isActive('/admin')} color="rose" />}
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/profile" className="flex items-center gap-4 group">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">{user.department}</p>
              <p className="text-sm font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{user.name}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-indigo-600 text-base shadow-sm group-hover:shadow-md transition-all">
              {user.name.charAt(0)}
            </div>
          </Link>
          <div className="w-px h-8 bg-slate-100" />
          <button onClick={onLogout} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all" title="Logout">
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; label: string; active: boolean; color?: string }> = ({ to, label, active, color = 'indigo' }) => (
  <Link 
    to={to} 
    className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all ${
      active 
        ? `bg-${color}-600 text-white shadow-xl shadow-${color}-100 scale-105` 
        : `text-slate-500 hover:text-${color}-600 hover:bg-${color}-50`
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
