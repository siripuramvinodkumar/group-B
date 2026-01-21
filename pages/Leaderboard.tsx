
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getLeaderboard } from '../services/api';
import { Trophy, Medal, Star, Target, TrendingUp, Users } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getLeaderboard();
      setUsers(data);
      setLoading(false);
    };
    load();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-slate-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-slate-400 font-bold">{index + 1}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
          <Trophy className="h-10 w-10 text-yellow-500" />
          Wall of Fame
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Celebrating our most collaborative team members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Active Players</p>
            <p className="text-3xl font-black mt-1">{users.length}</p>
          </div>
          <Users className="h-10 w-10 text-indigo-400" />
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Points</p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {users.reduce((acc, u) => acc + (u.points || 0), 0)}
            </p>
          </div>
          <Target className="h-10 w-10 text-rose-500" />
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg Engagement</p>
            <p className="text-3xl font-black text-slate-900 mt-1">84%</p>
          </div>
          <TrendingUp className="h-10 w-10 text-emerald-500" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center font-bold text-slate-400 text-xs uppercase tracking-widest">
          <div className="flex items-center gap-8">
            <span className="w-8 text-center">#</span>
            <span>Teammate</span>
          </div>
          <span>Brag Points</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 animate-pulse flex justify-between">
                <div className="h-6 w-32 bg-slate-100 rounded" />
                <div className="h-6 w-12 bg-slate-100 rounded" />
              </div>
            ))
          ) : (
            users.map((user, index) => (
              <div 
                key={user.id} 
                className={`p-6 flex items-center justify-between transition-all hover:bg-slate-50 ${index < 3 ? 'bg-white' : ''}`}
              >
                <div className="flex items-center gap-8">
                  <div className="w-8 flex justify-center">{getRankIcon(index)}</div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-indigo-600 text-sm border border-slate-200">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{user.department}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-indigo-600">{user.points}</span>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
