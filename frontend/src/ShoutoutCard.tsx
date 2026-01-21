
import React, { useState, useEffect } from 'react';
import { ShoutOut, User, ReactionType, Comment, UserRole } from '../../backend/types';
import { ThumbsUp, Heart, Star, MessageSquare, MoreHorizontal, Flag, Trash2, AlertTriangle, Send } from 'lucide-react';
import { getComments, addComment, reportShoutout, deleteComment } from '../../backend/api';

interface ShoutoutCardProps {
  shoutout: ShoutOut;
  currentUser: User;
  onReact: (type: ReactionType) => void;
}

const ShoutoutCard: React.FC<ShoutoutCardProps> = ({ shoutout, currentUser, onReact }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    if (showComments) {
      setLoadingComments(true);
      getComments(shoutout.id).then(data => {
        setComments(data);
        setLoadingComments(false);
      });
    }
  }, [showComments, shoutout.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = await addComment(shoutout.id, currentUser.id, newComment);
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleReport = async () => {
    if (!window.confirm("Flag this content for moderation?")) return;
    await reportShoutout(shoutout.id, currentUser.id, 'User flagged this content');
    setIsReported(true);
    setTimeout(() => setIsReported(false), 3000);
  };

  const hasReacted = (type: ReactionType) => shoutout.reactions?.some(r => r.user_id === currentUser.id && r.type === type);
  const getCount = (type: ReactionType) => shoutout.reactions.filter(r => r.type === type).length;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-xl relative group">
      {isReported && (
        <div className="absolute inset-0 z-20 bg-slate-900/90 flex items-center justify-center p-8 text-center text-white backdrop-blur-md animate-in fade-in duration-300">
          <div>
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <p className="text-xl font-black">Flagged for Review</p>
            <p className="text-slate-400 mt-2 font-medium">Thank you. Our mods will check this out.</p>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 border border-indigo-100 shadow-sm uppercase text-lg">
              {shoutout.sender?.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 leading-tight">{shoutout.sender?.name}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                {shoutout.sender?.department} • {new Date(shoutout.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button onClick={handleReport} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
            <Flag className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {shoutout.recipients.map(r => (
              <span key={r.id} className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-[10px] font-black border border-indigo-600 shadow-sm">
                @{r.name}
              </span>
            ))}
          </div>
          <p className="text-slate-700 leading-relaxed text-lg font-medium bg-slate-50/50 p-4 rounded-2xl italic border-l-4 border-indigo-600">
            "{shoutout.message}"
          </p>
          {shoutout.image_url && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-slate-100 shadow-inner group/img">
              <img src={shoutout.image_url} className="w-full object-cover max-h-80 transition-transform duration-700 group-hover/img:scale-110" alt="Recognized Achievement" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center space-x-2">
            <ReactionButton 
              active={hasReacted(ReactionType.LIKE)} 
              count={getCount(ReactionType.LIKE)} 
              onClick={() => onReact(ReactionType.LIKE)} 
              icon={<ThumbsUp className="h-4 w-4" />} 
              color="indigo" 
            />
            <ReactionButton 
              active={hasReacted(ReactionType.CLAP)} 
              count={getCount(ReactionType.CLAP)} 
              onClick={() => onReact(ReactionType.CLAP)} 
              icon={<Heart className="h-4 w-4" />} 
              color="rose" 
            />
            <ReactionButton 
              active={hasReacted(ReactionType.STAR)} 
              count={getCount(ReactionType.STAR)} 
              onClick={() => onReact(ReactionType.STAR)} 
              icon={<Star className="h-4 w-4" />} 
              color="yellow" 
            />
          </div>
          <button 
            onClick={() => setShowComments(!showComments)} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${showComments ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{shoutout.comments_count} Comments</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="bg-slate-50/80 p-6 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-3 custom-scrollbar">
            {loadingComments ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map(i => <div key={i} className="flex gap-3"><div className="w-8 h-8 rounded-lg bg-slate-200" /><div className="flex-1 h-12 bg-slate-200 rounded-xl" /></div>)}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-slate-400 text-xs font-bold py-4">Be the first to comment!</p>
            ) : comments.map(c => (
              <div key={c.id} className="flex space-x-3 group/cmt animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-indigo-600 border border-slate-100 uppercase">{c.user.name.charAt(0)}</div>
                <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative transition-all hover:border-indigo-100">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{c.user.name}</p>
                    <p className="text-[8px] font-bold text-slate-300">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex gap-3">
            <input 
              type="text" 
              value={newComment} 
              onChange={e => setNewComment(e.target.value)} 
              placeholder="Add your recognition..." 
              className="flex-1 bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium" 
            />
            <button 
              type="submit" 
              disabled={!newComment.trim()} 
              className="bg-indigo-600 text-white px-5 rounded-xl text-sm font-black shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-30 transform active:scale-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const ReactionButton: React.FC<{ active: boolean; count: number; onClick: () => void; icon: React.ReactNode; color: string }> = ({ active, count, onClick, icon, color }) => {
  const colorClasses: Record<string, string> = {
    indigo: active ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50',
    rose: active ? 'bg-rose-50 text-rose-600 border-rose-200' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50',
    yellow: active ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'text-slate-400 hover:text-yellow-600 hover:bg-yellow-50',
  };

  return (
    <button onClick={onClick} className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-transparent transition-all font-bold text-xs ${colorClasses[color]}`}>
      <span className={active ? 'scale-110' : ''}>{icon}</span>
      <span>{count}</span>
    </button>
  );
};

export default ShoutoutCard;
