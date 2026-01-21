
import React, { useState, useEffect } from 'react';
import { ShoutOut, User, ReactionType, Comment, UserRole } from '../types';
import { ThumbsUp, Heart, Star, MessageSquare, MoreHorizontal, Flag, Trash2, X, AlertTriangle } from 'lucide-react';
import { getComments, addComment, reportShoutout, deleteComment } from '../services/api';

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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    if (showComments && comments.length === 0) loadComments();
  }, [showComments]);

  const loadComments = async () => {
    setLoadingComments(true);
    const data = await getComments(shoutout.id);
    setComments(data);
    setLoadingComments(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = await addComment(shoutout.id, currentUser.id, newComment);
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Delete this comment?")) return;
    await deleteComment(commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setIsReporting(true);
    await reportShoutout(shoutout.id, currentUser.id, reportReason);
    setIsReporting(false);
    setShowReportModal(false);
    setIsReported(true);
    setTimeout(() => setIsReported(false), 3000);
  };

  const hasReacted = (type: ReactionType) => shoutout.reactions?.some(r => r.user_id === currentUser.id && r.type === type);
  const getReactionCount = (type: ReactionType) => shoutout.reactions?.filter(r => r.type === type).length || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md relative">
      {isReported && (
        <div className="absolute inset-0 z-10 bg-slate-900/80 flex items-center justify-center p-6 text-center text-white backdrop-blur-sm animate-in fade-in duration-300">
          <div>
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <p className="font-bold">Post reported to moderators</p>
            <p className="text-sm text-slate-300">Thank you for helping keep our community safe.</p>
          </div>
        </div>
      )}

      <div className="p-4 flex justify-between items-start">
        <div className="flex space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shadow-inner">
            {shoutout.sender?.name?.charAt(0) || '?'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{shoutout.sender?.name || 'Unknown User'}</h3>
            <p className="text-xs text-slate-500">{shoutout.sender?.department || 'Staff'} • {new Date(shoutout.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="relative group">
          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal className="h-5 w-5" /></button>
          <div className="hidden group-hover:block absolute right-0 top-full bg-white border border-slate-200 rounded-lg shadow-xl z-20 min-w-[140px] overflow-hidden">
            <button 
              onClick={() => setShowReportModal(true)}
              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
            >
              <Flag className="h-3.5 w-3.5" />
              Report Post
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-2 flex flex-wrap gap-1">
        <span className="text-xs font-medium text-slate-400 pt-1 mr-1 uppercase tracking-tighter">Recognizing:</span>
        {shoutout.recipients?.map(r => (
          <span key={r?.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">@{r?.name || 'teammate'}</span>
        ))}
      </div>

      <div className="px-4 py-3">
        <p className="text-slate-800 whitespace-pre-wrap leading-relaxed mb-3">{shoutout.message}</p>
        {shoutout.image_url && (
          <div className="rounded-xl overflow-hidden border border-slate-100 max-h-80 bg-slate-50 group cursor-zoom-in">
            <img src={shoutout.image_url} alt="Shoutout" className="w-full h-full object-contain transition-transform group-hover:scale-[1.02]" />
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-1 sm:space-x-4">
          <button onClick={() => onReact(ReactionType.LIKE)} className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg transition-colors ${hasReacted(ReactionType.LIKE) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}>
            <ThumbsUp className={`h-4 w-4 ${hasReacted(ReactionType.LIKE) ? 'fill-current' : ''}`} />
            <span className="text-xs font-semibold">{getReactionCount(ReactionType.LIKE)}</span>
          </button>
          <button onClick={() => onReact(ReactionType.CLAP)} className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg transition-colors ${hasReacted(ReactionType.CLAP) ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50 hover:text-rose-600'}`}>
            <Heart className={`h-4 w-4 ${hasReacted(ReactionType.CLAP) ? 'fill-current' : ''}`} />
            <span className="text-xs font-semibold">{getReactionCount(ReactionType.CLAP)}</span>
          </button>
          <button onClick={() => onReact(ReactionType.STAR)} className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg transition-colors ${hasReacted(ReactionType.STAR) ? 'bg-yellow-50 text-yellow-600' : 'text-slate-500 hover:bg-slate-50 hover:text-yellow-600'}`}>
            <Star className={`h-4 w-4 ${hasReacted(ReactionType.STAR) ? 'fill-current' : ''}`} />
            <span className="text-xs font-semibold">{getReactionCount(ReactionType.STAR)}</span>
          </button>
        </div>
        <button onClick={() => setShowComments(!showComments)} className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${showComments ? 'bg-slate-100 text-slate-700' : 'text-slate-500 hover:bg-slate-50'}`}>
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-semibold">{shoutout.comments_count}</span>
        </button>
      </div>

      {showComments && (
        <div className="bg-slate-50 border-t border-slate-100 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4 mb-4">
            {loadingComments ? (
              <div className="flex justify-center py-2"><div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
            ) : comments.map(comment => (
              <div key={comment.id} className="flex space-x-3 group/comment">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{comment.user?.name?.charAt(0) || '?'}</div>
                <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-900">{comment.user?.name || 'Anonymous'}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {(currentUser.id === comment.user_id || currentUser.role === UserRole.ADMIN) && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover/comment:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex space-x-2">
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
            <button type="submit" disabled={!newComment.trim()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md shadow-indigo-100">Post</button>
          </form>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Report Content</h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
              </div>
              <p className="text-sm text-slate-500 mb-6">Help us understand why you are flagging this shout-out. Moderation will review it soon.</p>
              
              <div className="space-y-3">
                {['Inappropriate Language', 'Spam or Offensive', 'Harassment', 'False Information'].map(option => (
                  <button 
                    key={option}
                    onClick={() => setReportReason(option)}
                    className={`w-full p-3 rounded-xl text-sm font-semibold text-left transition-all border ${
                      reportReason === option ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-rose-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
                <textarea 
                  placeholder="Other reason..."
                  className="w-full p-3 rounded-xl text-sm border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-rose-500 outline-none h-24 resize-none"
                  value={['Inappropriate Language', 'Spam or Offensive', 'Harassment', 'False Information'].includes(reportReason) ? '' : reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!reportReason || isReporting}
                  onClick={handleReport}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100 disabled:opacity-50"
                >
                  {isReporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoutoutCard;
