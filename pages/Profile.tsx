
import React, { useState, useEffect } from 'react';
import { User, ShoutOut } from '../types';
import { getShoutouts, updateUser } from '../services/api';
import ShoutoutCard from '../components/ShoutoutCard';
import { Calendar, Mail, Building, Briefcase, Award, Send, Users, Edit3, Save } from 'lucide-react';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [shoutouts, setShoutouts] = useState<ShoutOut[]>([]);
  const [view, setView] = useState<'sent' | 'received'>('received');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editDept, setEditDept] = useState(user.department);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const data = await getShoutouts(view === 'sent' ? { sender_id: user.id } : { recipient_id: user.id });
      setShoutouts(data);
      setLoading(false);
    };
    loadContent();
  }, [user.id, view]);

  const handleUpdate = async () => {
    const updated = await updateUser({ ...user, name: editName, department: editDept });
    setIsEditing(false);
    // User will be refreshed on page reload/navigation if needed, but we keep local state sync simple
    window.location.reload(); 
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
        <div className="h-40 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 relative">
          <div className="absolute top-4 right-4 text-white/30"><Users className="h-32 w-32 -rotate-12" /></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-2xl">
              <div className="w-full h-full rounded-2xl bg-slate-50 flex items-center justify-center text-5xl font-black text-indigo-600 border border-slate-100 uppercase">
                {user.name.charAt(0)}
              </div>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              {isEditing ? (
                <div className="space-y-4">
                  <input 
                    className="text-3xl font-black text-slate-900 border-b-2 border-indigo-600 outline-none w-full bg-transparent pb-1"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <select 
                    className="text-lg text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none w-full"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                  >
                    <option>Engineering</option>
                    <option>Sales</option>
                    <option>Product</option>
                    <option>HR</option>
                    <option>Marketing</option>
                  </select>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                  <p className="text-xl font-medium text-slate-400 mt-1">{user.role} • {user.department}</p>
                </>
              )}
              
              <div className="space-y-4 mt-8">
                <div className="flex items-center text-slate-500 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3"><Mail className="h-4 w-4 text-indigo-400" /></div>
                  {user.email}
                </div>
                <div className="flex items-center text-slate-500 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3"><Building className="h-4 w-4 text-indigo-400" /></div>
                  {user.department} Department
                </div>
                <div className="flex items-center text-slate-500 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3"><Calendar className="h-4 w-4 text-indigo-400" /></div>
                  Since {new Date(user.joined_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 flex flex-col justify-center">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Achievement Metrics</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-black text-indigo-600">{(shoutouts.length * 2.5).toFixed(0)}</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Impact Score</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-indigo-600">12</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Active Streaks</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-indigo-100 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-bold text-slate-700">Top 5% contributors this quarter</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center space-x-8 border-b border-slate-200 mb-8">
          <button 
            onClick={() => setView('received')}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              view === 'received' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Received Recognition
            {view === 'received' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}
          </button>
          <button 
            onClick={() => setView('sent')}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              view === 'sent' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Shout-outs Shared
            {view === 'sent' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}
          </button>
        </div>

        <div className="space-y-8">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse shadow-sm" />
            ))
          ) : shoutouts.length === 0 ? (
            <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-200 text-center">
              {view === 'received' ? (
                <>
                  <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No one has tagged you yet. Keep up the great work!</p>
                </>
              ) : (
                <>
                  <Send className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">You haven't shared any appreciation yet. Spread some joy!</p>
                </>
              )}
            </div>
          ) : (
            shoutouts.map(so => (
              <ShoutoutCard 
                key={so.id} 
                shoutout={so} 
                currentUser={user} 
                onReact={() => {}} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
