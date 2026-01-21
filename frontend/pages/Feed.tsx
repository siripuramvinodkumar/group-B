
import React, { useState, useEffect } from 'react';
import { User, ShoutOut, ReactionType } from '../../backend/types';
import { getShoutouts, getUsers, createShoutout, toggleReaction } from '../../backend/api';
import ShoutoutCard from '../components/ShoutoutCard';
import { Send, Users, Search, Image as ImageIcon, TrendingUp, Clock } from 'lucide-react';

interface FeedProps {
  currentUser: User;
}

const Feed: React.FC<FeedProps> = ({ currentUser }) => {
  const [shoutouts, setShoutouts] = useState<ShoutOut[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [soData, uData] = await Promise.all([
        getShoutouts({ query: searchQuery || undefined }),
        getUsers()
      ]);
      setShoutouts(soData);
      setAvailableUsers(uData.filter(u => u.id !== currentUser.id));
      setLoading(false);
    };
    loadData();
  }, [searchQuery, currentUser.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || selectedRecipients.length === 0) return;
    const newSo = await createShoutout(currentUser.id, message, selectedRecipients);
    setShoutouts(prev => [newSo, ...prev]);
    setMessage('');
    setSelectedRecipients([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Recognize a teammate..."
            className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex flex-wrap gap-2">
            {availableUsers.map(u => (
              <button key={u.id} type="button" onClick={() => setSelectedRecipients(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${selectedRecipients.includes(u.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'}`}>{u.name}</button>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">Share Appreciation</button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {shoutouts.map(s => (
          <ShoutoutCard key={s.id} shoutout={s} currentUser={currentUser} onReact={(type) => toggleReaction(s.id, currentUser.id, type).then(rs => setShoutouts(prev => prev.map(p => p.id === s.id ? {...p, reactions: rs} : p)))} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
