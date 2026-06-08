import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trophy, Medal, Star, Flame, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/users/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
  }

  const getRankStyle = (index) => {
    switch(index) {
      case 0: return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 1: return 'bg-slate-100 text-slate-500 border-slate-200';
      case 2: return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-white text-slate-600 border-slate-100';
    }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-slate-400" />;
      case 2: return <Medal className="w-5 h-5 text-orange-500" />;
      default: return <span className="font-bold w-5 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="bg-[var(--color-base)] min-h-screen text-[var(--color-text-primary)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-xl shadow-orange-500/20 mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Global Leaderboard</h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
            See how you stack up against the CodeCamp community. Earn XP by completing lessons and challenges to climb the ranks!
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[var(--color-ui-border)] shadow-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">Coder</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-right pr-4">Total XP</div>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100">
            {leaders.map((leader, index) => {
              const isCurrentUser = user?._id === leader._id;
              
              return (
                <div 
                  key={leader._id} 
                  className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-slate-50 ${isCurrentUser ? 'bg-indigo-50/50 relative' : ''}`}
                >
                  {isCurrentUser && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-md"></div>
                  )}
                  
                  {/* Rank */}
                  <div className="col-span-2 flex justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm ${getRankStyle(index)}`}>
                      {getRankIcon(index)}
                    </div>
                  </div>

                  {/* Coder Info */}
                  <div className="col-span-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${isCurrentUser ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {leader.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={`font-bold ${isCurrentUser ? 'text-indigo-900' : 'text-slate-900'} flex items-center gap-2`}>
                        {leader.name} {isCurrentUser && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">You</span>}
                      </h3>
                      {leader.badges && leader.badges.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-slate-500">{leader.badges.length} Badges</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Level */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-xs font-bold text-slate-700">Lvl {leader.level || 1}</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="col-span-2 text-right pr-4">
                    <span className="text-lg font-black text-indigo-600">{leader.xp.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}

            {leaders.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                No users found on the leaderboard yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
