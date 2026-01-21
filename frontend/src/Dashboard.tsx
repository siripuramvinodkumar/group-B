
import React, { useState } from 'react';
import { User } from '../../backend/types';
import CreateShoutout from './CreateShoutout';
import ShoutoutFeed from './ShoutoutFeed';
import { Sparkles } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="text-indigo-600 h-8 w-8" />
            Recognition Wall
          </h1>
          <p className="text-slate-500 font-medium italic mt-1">Spreading positivity, one win at a time.</p>
        </div>
      </div>
      
      <CreateShoutout currentUser={currentUser} onPostSuccess={handlePostSuccess} />
      
      <div className="mt-12">
        <ShoutoutFeed currentUser={currentUser} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default Dashboard;
