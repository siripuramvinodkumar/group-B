
import React, { useState, useEffect } from 'react';
import { User } from '../../backend/types';
import { getLeaderboard } from '../../backend/api';
import { Trophy, Star, TrendingUp, Award, Zap } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(data => { setUsers(data); setLoading(false); });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-3xl shadow-xl shadow-yellow-100 mb-6 transform hover:rotate-12 transition-transform">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Wall of Fame</h1>
        <p className="text-slate-500 mt-3 font-bold text-lg max-w-lg mx-auto italic">"Recognizing excellence is the fuel for a thriving community."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatSummary icon={<Zap className="text-yellow-500" />} label="Engagement" value="High" />
        <StatSummary icon={<Star className="text-indigo-500" />} label="Top Post" value="Vinod K." />
        <StatSummary icon={<Award className="text-rose-500" />} label="Total Points" value={users.reduce((acc, u) => acc + (u.points || 0), 0)} />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            Rankings
          </h3>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Standings</span>
        </div>
        <div className="divide-y divide-slate-50">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : users.map((u, i) => (
            <div key={u.id} className={`p-8 flex items-center justify-between transition-all hover:bg-slate-50/80 group ${i < 3 ? 'bg-indigo-50/10' : ''}`}>
              <div className="flex items-center space-x-8">
                <span className={`w-8 text-center text-lg font-black ${i === 0 ? 'text-yellow-500 scale-125' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-slate-200'}`}>
                  {i + 1}
                </span>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg uppercase transition-transform group-hover:scale-110 ${i === 0 ? 'bg-yellow-400' : 'bg-indigo-500'}`}>
                      {u.name.charAt(0)}
                    </div>
                    {i === 0 && <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-yellow-100 animate-bounce"><Star className="h-4 w-4 text-yellow-500 fill-current" /></div>}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg leading-none mb-1 group-hover:text-indigo-600 transition-colors">{u.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.department}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-indigo-600">{u.points}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatSummary: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex items-center gap-6 transform hover:-translate-y-2 transition-transform">
    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

const SkeletonRow = () => (
  <div className="p-8 flex justify-between animate-pulse">
    <div className="flex items-center space-x-8">
      <div className="w-8 h-8 bg-slate-100 rounded" />
      <div className="flex items-center space-x-6">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
        <div><div className="w-32 h-6 bg-slate-100 rounded mb-2" /><div className="w-20 h-3 bg-slate-50 rounded" /></div>
      </div>
    </div>
    <div className="w-16 h-8 bg-slate-100 rounded" />
  </div>
);

export default Leaderboard;
