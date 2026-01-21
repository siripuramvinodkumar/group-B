
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole } from '../../backend/types';
import { registerUser } from '../../backend/api';
import { LayoutDashboard, Mail, User as UserIcon, Building, Lock } from 'lucide-react';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', department: 'Engineering', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser: User = { id: Math.floor(Math.random() * 100000), name: formData.name, email: formData.email, department: formData.department, role: UserRole.EMPLOYEE, joined_at: new Date().toISOString() };
      await registerUser(newUser);
      onLogin(newUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4"><div className="bg-indigo-600 p-3 rounded-2xl shadow-xl"><LayoutDashboard className="h-8 w-8 text-white" /></div></div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Join the Board</h2>
        <p className="mt-2 text-sm font-medium text-slate-500">Recognize and be recognized</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" placeholder="name@company.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Department</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full pl-10 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm appearance-none">
                  <option>Engineering</option><option>Sales</option><option>Product</option><option>HR</option><option>Marketing</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full pl-10 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
