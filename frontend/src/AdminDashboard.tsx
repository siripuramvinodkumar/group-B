
import React, { useState, useEffect } from 'react';
import { AdminStats, Report, AdminLog, User, ShoutOut } from '../../backend/types';
import { 
  getAdminStats, 
  getPendingReports, 
  getAdminLogs, 
  getCurrentUser, 
  deleteShoutout, 
  resolveReport,
  exportStatsToCSV 
} from '../../backend/api';
import { 
  ShieldCheck, AlertTriangle, History, Trash2, CheckCircle, 
  Download, Users, Award, TrendingUp, Clock 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<(Report & { shoutout?: ShoutOut })[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [s, r, l, u] = await Promise.all([
        getAdminStats(),
        getPendingReports(),
        getAdminLogs(),
        getCurrentUser()
      ]);
      setStats(s);
      setReports(r);
      setLogs(l);
      setUser(u);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAction = async (action: 'delete' | 'resolve', id: number) => {
    if (!user) return;
    if (action === 'delete') {
      if (!window.confirm("Permanently delete this shoutout?")) return;
      await deleteShoutout(id, user.id);
    } else {
      await resolveReport(id, user.id);
    }
    
    // Refresh local state
    const [r, l] = await Promise.all([getPendingReports(), getAdminLogs()]);
    setReports(r);
    setLogs(l);
    if (action === 'delete') {
      const s = await getAdminStats();
      setStats(s);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Control</h1>
          <p className="text-slate-500 font-medium italic mt-1">Monitoring organizational health and community standards</p>
        </div>
        <button 
          onClick={exportStatsToCSV}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 transform active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>Generate Report (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard title="System Posts" value={stats.totalShoutouts} icon={<Award className="text-indigo-600" />} status="Live" />
        <MetricCard title="Workforce" value={stats.totalActiveUsers} icon={<Users className="text-blue-600" />} status="Active" />
        <MetricCard title="Dept Velocity" value={stats.departmentEngagement.length} icon={<TrendingUp className="text-emerald-600" />} status="Optimized" />
        <MetricCard title="Active Alerts" value={reports.length} icon={<AlertTriangle className={reports.length > 0 ? "text-rose-600" : "text-slate-300"} />} status={reports.length > 0 ? "Needs Review" : "Healthy"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Engagement Velocity</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Departmental Distribution</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departmentEngagement}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Culture Leaders</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Most Recognized Talent</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.mostTaggedUsers} dataKey="count" nameKey="name" cx="50%" cy="45%" outerRadius={100} innerRadius={60} paddingAngle={8} stroke="none">
                  {stats.mostTaggedUsers.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 800 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-indigo-600">
              <ShieldCheck className="h-6 w-6" />
              <h3 className="font-black text-slate-900">Safety Queue</h3>
            </div>
            <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
              reports.length > 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              {reports.length} Active Tickets
            </span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-50">
            {reports.length === 0 ? (
              <div className="p-20 text-center">
                <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-slate-400 font-bold italic">No pending alerts</p>
              </div>
            ) : reports.map(r => (
              <div key={r.id} className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-inner">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-slate-900 text-sm">Post #{r.shoutout_id}</p>
                      <span className="text-[8px] font-black text-rose-500 uppercase px-1.5 py-0.5 bg-rose-50 rounded">Reason: {r.reason}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium italic truncate max-w-[200px]">"{r.shoutout?.message}"</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleAction('resolve', r.id)} 
                    className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                    title="Dismiss Report"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleAction('delete', r.shoutout_id)} 
                    className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                    title="Delete Post"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center space-x-3 text-indigo-600">
            <History className="h-6 w-6" />
            <h3 className="font-black text-slate-900">Governance Log</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-6">
            {logs.length === 0 ? (
              <div className="p-12 text-center text-slate-300">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No recent entries</p>
              </div>
            ) : logs.map(l => (
              <div key={l.id} className="relative pl-6 border-l-2 border-indigo-100 py-1">
                <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                      {l.admin_name} • <span className="text-indigo-600">{l.action.replace('_', ' ')}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">ID: {l.target_type} #{l.target_id}</p>
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase whitespace-nowrap">{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; status: string }> = ({ title, value, icon, status }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 transition-all hover:scale-[1.03] hover:shadow-indigo-100/40 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
    <div className="relative z-10 flex justify-between items-start mb-6">
      <div className="p-4 bg-white rounded-2xl shadow-lg shadow-slate-100 border border-slate-50">{icon}</div>
      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 uppercase tracking-tighter border border-indigo-100">{status}</span>
    </div>
    <div className="relative z-10">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</h4>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
