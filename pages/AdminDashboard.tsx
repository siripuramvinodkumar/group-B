
import React, { useState, useEffect } from 'react';
import { AdminStats, ShoutOut, Report, AdminLog, User } from '../types';
import { 
  getAdminStats, 
  getShoutouts, 
  deleteShoutout, 
  exportStatsToCSV, 
  getPendingReports, 
  resolveReport, 
  getAdminLogs,
  getCurrentUser
} from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, Users, MessageSquare, Award, 
  Trash2, AlertTriangle, FileText, Download, CheckCircle, ShieldCheck, History, Clock
} from 'lucide-react';

const COLORS = ['#4f46e5', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingReports, setPendingReports] = useState<(Report & { shoutout?: ShoutOut })[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [sData, rData, lData, uData] = await Promise.all([
        getAdminStats(),
        getPendingReports(),
        getAdminLogs(),
        getCurrentUser()
      ]);
      setStats(sData);
      setPendingReports(rData);
      setAdminLogs(lData);
      setCurrentUser(uData);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDelete = async (shoutoutId: number) => {
    if (!window.confirm("Remove this post permanently? Reports associated with it will be cleared.")) return;
    if (!currentUser) return;
    await deleteShoutout(shoutoutId, currentUser.id);
    setPendingReports(prev => prev.filter(r => r.shoutout_id !== shoutoutId));
    setAdminLogs(await getAdminLogs());
    if (stats) setStats({ ...stats, totalShoutouts: stats.totalShoutouts - 1 });
  };

  const handleResolve = async (reportId: number) => {
    if (!currentUser) return;
    await resolveReport(reportId, currentUser.id);
    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    setAdminLogs(await getAdminLogs());
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Control</h1>
          <p className="text-slate-500 font-medium">Monitoring system health & community safety</p>
        </div>
        <button 
          onClick={exportStatsToCSV}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Download className="h-4 w-4" />
          <span>Generate Report (CSV)</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="System Posts" value={stats.totalShoutouts} icon={<Award className="text-indigo-600" />} change="+12% trend" />
        <MetricCard title="Workforce" value={stats.totalActiveUsers} icon={<Users className="text-blue-600" />} change="Active" />
        <MetricCard title="Eng. Velocity" value="84.2" icon={<TrendingUp className="text-emerald-600" />} change="+5.4" />
        <MetricCard title="Alerts" value={pendingReports.length} icon={<AlertTriangle className={pendingReports.length > 0 ? "text-rose-600" : "text-slate-400"} />} change={pendingReports.length > 0 ? "Action Required" : "Stable"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-slate-900">Engagement by Dept</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Post Volume</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departmentEngagement}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-slate-900">Celebration Leaders</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Most Recognized</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.mostTaggedUsers} dataKey="count" nameKey="name" cx="50%" cy="45%" outerRadius={90} innerRadius={60} paddingAngle={8} stroke="none">
                  {stats.mostTaggedUsers.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Moderation Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              Moderation Queue
            </h3>
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${
              pendingReports.length > 0 ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
            }`}>
              {pendingReports.length} Active Tickets
            </span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-auto">
            {pendingReports.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="font-bold text-slate-900 text-lg">System Secure</p>
                <p className="text-sm">All reports have been successfully resolved.</p>
              </div>
            ) : (
              pendingReports.map(report => (
                <div key={report.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-all gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0 border border-rose-100 shadow-sm">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-bold text-slate-900">{report.shoutout?.sender?.name}</p>
                        <span className="text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{report.reason}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2 bg-slate-100 p-2 rounded-lg italic">"{report.shoutout?.message}"</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Filed {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-row gap-3">
                    <button 
                      onClick={() => handleResolve(report.id)}
                      className="px-4 py-2 text-xs font-bold text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all shadow-sm"
                    >
                      Dismiss
                    </button>
                    <button 
                      onClick={() => handleDelete(report.shoutout_id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Redact
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <History className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900">Audit Trail</h3>
          </div>
          <div className="flex-1 overflow-auto max-h-[500px]">
            {adminLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">No recent logs</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {adminLogs.map(log => (
                  <div key={log.id} className="text-xs border-l-2 border-indigo-200 pl-3 py-1">
                    <p className="font-bold text-slate-900">
                      {log.admin_name} <span className="text-indigo-600">{log.action.replace('_', ' ')}</span>
                    </p>
                    <p className="text-slate-500 font-medium">Target: {log.target_type} #{log.target_id}</p>
                    <p className="text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; change: string }> = ({ title, value, icon, change }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">{icon}</div>
      <span className="text-[10px] font-black px-2 py-1 rounded-full bg-slate-100 text-slate-500 uppercase tracking-tighter">{change}</span>
    </div>
    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
    <p className="text-3xl font-black text-slate-900">{value}</p>
  </div>
);

export default AdminDashboard;
