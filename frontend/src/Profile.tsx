
import React, { useState, useEffect } from 'react';
import { User, ShoutOut } from '../../backend/types';
import { getShoutouts } from '../../backend/api';
import ShoutoutCard from './ShoutoutCard';
import { Mail, Building, Calendar, Award } from 'lucide-react';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [shoutouts, setShoutouts] = useState<ShoutOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShoutouts({ recipient_id: user.id }).then(data => {
      setShoutouts(data);
      setLoading(false);
    });
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
        <div className="h-32 bg-indigo-600 flex items-end px-10 pb-4">
          <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl -mb-12 border border-slate-100 flex items-center justify-center text-3xl font-black text-indigo-600 uppercase">{user.name.charAt(0)}</div>
        </div>
        <div className="pt-16 pb-10 px-10">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
              <p className="text-lg font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.department} Department</p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-slate-500 font-medium text-sm"><Mail className="h-4 w-4 mr-2 text-indigo-400" />{user.email}</div>
                <div className="flex items-center text-slate-500 font-medium text-sm"><Calendar className="h-4 w-4 mr-2 text-indigo-400" />Joined {new Date(user.joined_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex-shrink-0 flex flex-col justify-center items-center md:items-start">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Impact Points</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-indigo-600">{shoutouts.length * 15}</span>
                <Award className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 border-b border-slate-200 pb-2">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Appreciation Wall</h3>
      </div>
      
      <div className="space-y-6">
        {loading ? <div className="h-32 bg-white rounded-2xl animate-pulse" /> : shoutouts.length === 0 ? <p className="text-slate-400 font-medium italic">No recognitions received yet. Keep being awesome!</p> : shoutouts.map(s => <ShoutoutCard key={s.id} shoutout={s} currentUser={user} onReact={() => {}} />)}
      </div>
    </div>
  );
};

export default Profile;
