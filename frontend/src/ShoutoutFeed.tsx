
import React, { useState, useEffect } from 'react';
import { ShoutOut, User, ReactionType } from '../../backend/types';
import { getShoutouts, toggleReaction } from '../../backend/api';
import ShoutoutCard from './ShoutoutCard';
import { Search, Clock, TrendingUp, Users } from 'lucide-react';

interface ShoutoutFeedProps {
  currentUser: User;
  refreshTrigger: number;
}

const ShoutoutFeed: React.FC<ShoutoutFeedProps> = ({ currentUser, refreshTrigger }) => {
  const [shoutouts, setShoutouts] = useState<ShoutOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getShoutouts({ query: searchQuery || undefined });
      
      let sorted = [...data];
      if (sortBy === 'popular') {
        sorted.sort((a, b) => (b.reactions.length + b.comments_count) - (a.reactions.length + a.comments_count));
      }
      
      setShoutouts(sorted);
      setLoading(false);
    };
    loadData();
  }, [searchQuery, sortBy, refreshTrigger]);

  const handleReaction = async (soId: number, type: ReactionType) => {
    const rs = await toggleReaction(soId, currentUser.id, type);
    setShoutouts(prev => prev.map(s => s.id === soId ? { ...s, reactions: rs } : s));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search recognition posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button onClick={() => setSortBy('newest')} className={`p-1.5 rounded-md transition-all ${sortBy === 'newest' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><Clock className="h-4 w-4" /></button>
          <button onClick={() => setSortBy('popular')} className={`p-1.5 rounded-md transition-all ${sortBy === 'popular' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><TrendingUp className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-xl h-48 animate-pulse border border-slate-100" />)
        ) : shoutouts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No recognitions yet. Be the first!</p>
          </div>
        ) : (
          shoutouts.map(s => (
            <ShoutoutCard key={s.id} shoutout={s} currentUser={currentUser} onReact={(type) => handleReaction(s.id, type)} />
          ))
        )}
      </div>
    </div>
  );
};

export default ShoutoutFeed;
