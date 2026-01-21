
import React, { useState, useEffect } from 'react';
import { User, ShoutOut, ReactionType } from '../types';
import { getShoutouts, getUsers, createShoutout, toggleReaction } from '../services/api';
import ShoutoutCard from '../components/ShoutoutCard';
import { Send, Users, Filter, Search, Sparkles, X, Image as ImageIcon, TrendingUp, Clock } from 'lucide-react';

interface FeedProps {
  currentUser: User;
}

const Feed: React.FC<FeedProps> = ({ currentUser }) => {
  const [shoutouts, setShoutouts] = useState<ShoutOut[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [filterDept, setFilterDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [soData, uData] = await Promise.all([
        getShoutouts({ 
          department: filterDept || undefined, 
          query: searchQuery || undefined 
        }),
        getUsers()
      ]);
      
      let sorted = [...soData];
      if (sortBy === 'popular') {
        sorted.sort((a, b) => (b.reactions.length + b.comments_count) - (a.reactions.length + a.comments_count));
      }
      
      setShoutouts(sorted);
      setAvailableUsers(uData.filter(u => u.id !== currentUser.id));
      setLoading(false);
    };
    const debounceTimer = setTimeout(loadData, 300);
    return () => clearTimeout(debounceTimer);
  }, [filterDept, searchQuery, currentUser.id, sortBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || selectedRecipients.length === 0) return;

    setIsPosting(true);
    try {
      const newSo = await createShoutout(currentUser.id, message, selectedRecipients, attachedImage || undefined);
      setShoutouts(prev => [newSo, ...prev]);
      setMessage('');
      setSelectedRecipients([]);
      setAttachedImage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const simulateImageUpload = () => {
    const urls = [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    ];
    setAttachedImage(urls[Math.floor(Math.random() * urls.length)]);
  };

  const toggleRecipient = (user: User) => {
    if (selectedRecipients.includes(user.id)) {
      setSelectedRecipients(prev => prev.filter(id => id !== user.id));
      setMessage(prev => prev.replace(`@${user.name} `, '').replace(`@${user.name}`, ''));
    } else {
      setSelectedRecipients(prev => [...prev, user.id]);
      setMessage(prev => prev.trim() ? `${prev} @${user.name} ` : `@${user.name} `);
    }
  };

  const handleReaction = async (soId: number, type: ReactionType) => {
    const updatedReactions = await toggleReaction(soId, currentUser.id, type);
    setShoutouts(prev => prev.map(s => s.id === soId ? { ...s, reactions: updatedReactions } : s));
  };

  const departments = Array.from(new Set(availableUsers.map(u => u.department)));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Creation Box */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 transition-all hover:shadow-md">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-100">
              {currentUser.name.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-700 mb-2">Recognize a teammate</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What did they do that was awesome?"
                className="w-full min-h-[120px] p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50 transition-all text-slate-800"
              />
              
              {attachedImage && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                  <img src={attachedImage} alt="Attachment" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setAttachedImage(null)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tag Teammates</span>
                <div className="flex flex-wrap gap-2">
                  {availableUsers.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleRecipient(user)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                        selectedRecipients.includes(user.id)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    onClick={simulateImageUpload}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Attach Image"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                  <p className="text-xs text-slate-500 italic">
                    {selectedRecipients.length === 0 ? "Tag someone!" : `${selectedRecipients.length} tagged`}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isPosting || !message.trim() || selectedRecipients.length === 0}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                  <Send className="h-4 w-4" />
                  <span>{isPosting ? 'Posting...' : 'Share Appreciation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
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
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => setSortBy('newest')}
              className={`p-1.5 rounded-md transition-all ${sortBy === 'newest' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              title="Newest First"
            >
              <Clock className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setSortBy('popular')}
              className={`p-1.5 rounded-md transition-all ${sortBy === 'popular' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              title="Most Popular"
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-slate-50 border-none rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Depts</option>
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
      </div>

      {/* Shout-out List */}
      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-xl h-56 animate-pulse border border-slate-100 shadow-sm" />)
        ) : shoutouts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Silence is rare here!</h3>
            <p className="text-slate-500">Be the first to celebrate a teammate in this filter.</p>
          </div>
        ) : (
          shoutouts.map(shoutout => (
            <ShoutoutCard
              key={shoutout.id}
              shoutout={shoutout}
              currentUser={currentUser}
              onReact={(type) => handleReaction(shoutout.id, type)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
