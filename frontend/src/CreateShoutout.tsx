
import React, { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, X, AtSign } from 'lucide-react';
import { User } from '../../backend/types';
import { getUsers, createShoutout } from '../../backend/api';

interface CreateShoutoutProps {
  currentUser: User;
  onPostSuccess: () => void;
}

const CreateShoutout: React.FC<CreateShoutoutProps> = ({ currentUser, onPostSuccess }) => {
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  useEffect(() => {
    getUsers().then(users => setAvailableUsers(users.filter(u => u.id !== currentUser.id)));
  }, [currentUser.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || selectedRecipients.length === 0) return;

    setIsPosting(true);
    try {
      await createShoutout(currentUser.id, message, selectedRecipients, attachedImage || undefined);
      setMessage('');
      setSelectedRecipients([]);
      setAttachedImage(null);
      onPostSuccess();
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

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 transition-all hover:shadow-2xl hover:shadow-indigo-100/30">
      <div className="flex gap-6">
        <div className="flex-shrink-0 hidden sm:block">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
            {currentUser.name.charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What did they do that was awesome?"
                className="w-full min-h-[140px] p-5 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none resize-none bg-slate-50 transition-all text-slate-800 text-lg font-medium placeholder:text-slate-300"
              />
              <div className="absolute top-4 right-4 text-slate-200"><AtSign className="h-6 w-6" /></div>
            </div>
            
            {attachedImage && (
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl animate-in zoom-in duration-300">
                <img src={attachedImage} alt="Attachment" className="w-full h-full object-cover" />
                <button onClick={() => setAttachedImage(null)} className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1.5 hover:bg-rose-700 shadow-md transition-all"><X className="h-4 w-4" /></button>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                <AtSign className="h-3 w-3" /> Tag Teammates
              </div>
              <div className="flex flex-wrap gap-2">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedRecipients(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedRecipients.includes(user.id)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-105'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {user.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-50">
              <button type="button" onClick={simulateImageUpload} className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-sm">
                <ImageIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Add Image</span>
              </button>
              <button
                type="submit"
                disabled={isPosting || !message.trim() || selectedRecipients.length === 0}
                className="flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-indigo-100 transform active:scale-95"
              >
                <span>{isPosting ? 'Celebrating...' : 'Share Shout-out'}</span>
                {!isPosting && <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShoutout;
