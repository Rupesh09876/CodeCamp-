import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Star, Shield, Flame, CheckCircle, Zap, Code, Lock } from 'lucide-react';
import Card from '../components/UI/Card';

const Achievements = () => {
  const { user } = useAuth();

  // Hardcoded badge catalog for display purposes
  // In a real app, this would be fetched from the database /api/badges
  const allBadges = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-100', req: '1 Lesson' },
    { id: 2, name: 'Code Curious', description: 'Complete 5 lessons', icon: Code, color: 'text-blue-500', bg: 'bg-blue-100', req: '5 Lessons' },
    { id: 3, name: 'HTML Hero', description: 'Complete the HTML module', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-100', req: 'HTML Basics' },
    { id: 4, name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100', req: '7 Day Streak' },
    { id: 5, name: 'JS Ninja', description: 'Complete the JavaScript module', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-50', req: 'JS Basics' },
    { id: 6, name: 'Problem Solver', description: 'Solve 10 challenges', icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-100', req: '10 Challenges' },
    { id: 7, name: 'Full Stack', description: 'Complete all modules', icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-100', req: 'All Courses' },
    { id: 8, name: 'Month Master', description: 'Maintain a 30-day streak', icon: Flame, color: 'text-red-500', bg: 'bg-red-100', req: '30 Day Streak' },
  ];

  // For this implementation, we will simulate unlocked badges based on the user's xp/streak
  const unlockedIds = user?.badges?.map(b => b._id) || [];

  // If user has no badges from DB, mock some based on stats just to show the UI
  // Note: in full production, we strictly use user.badges
  const mockUnlocked = user?.xp > 0 ? [1] : [];
  if (user?.xp >= 250) mockUnlocked.push(2);
  if (user?.streak >= 7) mockUnlocked.push(4);

  const activeIds = unlockedIds.length > 0 ? unlockedIds : mockUnlocked;

  return (
    <div className="bg-[var(--color-base)] h-full text-[var(--color-text-primary)] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-slate-900">Your Achievements</h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            Collect badges by completing courses, maintaining streaks, and conquering challenges. Show off your expertise to the community!
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white text-center py-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="ext-slate-400 font-bold mb-2 uppercase tracking-widest text-sm">Badges Earned</h3>
            <div className="text-6xl font-black">{activeIds.length}</div>
            <p className="ext-5xl font-black text-slate-900">Out of {allBadges.length} total badges</p>
          </Card>
          <Card className="bg-white text-center py-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-sm">Total XP</h3>
            <div className="text-5xl font-black text-slate-900">{user?.xp || 0}</div>
          </Card>
          <Card className="bg-white text-center py-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-sm">Current Streak</h3>
            <div className="text-5xl font-black text-slate-900">{user?.streak || 0} <span className="text-2xl text-orange-500">🔥</span></div>
          </Card>
        </div>

        {/* Badge Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Badge Collection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {allBadges.map((badge) => {
              const isUnlocked = activeIds.includes(badge.id);
              const Icon = badge.icon;

              return (
                <div
                  key={badge.id}
                  className={`relative p-6 rounded-3xl border flex flex-col items-center text-center transition-all duration-300 ${isUnlocked
                    ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1'
                    : 'bg-slate-50 border-slate-100 opacity-70 grayscale hover:grayscale-0'
                    }`}
                >
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-4 h-4 text-slate-300" />
                    </div>
                  )}

                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? badge.bg : 'bg-slate-200'}`}>
                    <Icon className={`w-10 h-10 ${isUnlocked ? badge.color : 'text-slate-400'}`} />
                  </div>

                  <h3 className={`font-extrabold text-lg mb-1 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                    {badge.name}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium mb-4 flex-grow">
                    {badge.description}
                  </p>

                  <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isUnlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                    {isUnlocked ? 'Unlocked' : badge.req}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Achievements;
