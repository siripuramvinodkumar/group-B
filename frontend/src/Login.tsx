
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../backend/types';
import { getUsers } from '../../backend/api';
import { LayoutDashboard, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('bragboard_remember_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const users = await getUsers();
      const found = users.find(u => u.email === email);
      
      if (found) {
        if (email === 'siripuramvinodkumar333@gmail.com' && password !== '333') {
           setError('Invalid password for Admin account.');
           setLoading(false);
           return;
        }

        if (rememberMe) {
          localStorage.setItem('bragboard_remember_email', email);
        } else {
          localStorage.removeItem('bragboard_remember_email');
        }

        onLogin(found);
      } else {
        setError('Invalid credentials. (Hint: siripuramvinodkumar333@gmail.com / 333)');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 animate-in fade-in duration-1000">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-200 transform hover:rotate-6 transition-transform">
            <LayoutDashboard className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-slate-900 tracking-tight">BragBoard</h2>
        <p className="mt-3 text-center text-base font-bold text-slate-400">Join your team and start celebrating.</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-xs font-black border border-rose-100 flex items-center gap-3 animate-in shake duration-500">
                <AlertTriangleIcon className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-bold text-slate-900" 
                  placeholder="name@company.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-bold text-slate-900" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${rememberMe ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${rememberMe ? 'translate-x-4' : ''} shadow-sm`} />
                </div>
                <span className="ml-3 text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Remember Me</span>
              </label>
              <a href="#" className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Forgot?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center space-x-3 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign Into Board'}</span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <Link to="/register" className="text-sm font-black text-indigo-600 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
              Create New Account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200 opacity-60">
            <ShieldCheck className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Access Configured</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default Login;
