import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Zap, Trophy, BookOpen, Flame, Code, Calendar, Shield, Lock, Star, Rocket, CheckCircle, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/UI/Badge';
import BadgeCard from '../components/Dashboard/BadgeCard';

const Profile = () => {
  const { username } = useParams();
  const { user: authUser } = useAuth();

  // Mock profile data
  const profile = {
    name: authUser?.name || 'Rupesh Katuwal',
    username: username || authUser?.username || 'rupesh_dev',
    bio: 'Learning web development one lesson at a time. HTML/CSS enthusiast. Building cool things in Nepal.',
    joinDate: 'January 2026',
    plan: authUser?.plan || 'free',
    avatar: null,
    stats: {
      xp: 1350,
      level: 3,
      lessonsCompleted: 18,
      streak: 8,
      challengesSolved: 8,
    },
  };

  const isPro = profile.plan === 'pro';

  // Badges
  const badges = [
    { name: 'First Steps', desc: 'Complete first lesson', icon: Rocket, earned: true },
    { name: 'Code Curious', desc: 'Complete 5 lessons', icon: Code, earned: true },
    { name: 'HTML Hero', desc: 'Complete HTML module', icon: CheckCircle, earned: true },
    { name: 'Week Warrior', desc: '7 day streak', icon: Award, earned: true },
    { name: 'JS Ninja', desc: 'Complete JS module', icon: Trophy, earned: false },
    { name: 'Full Stack', desc: 'Complete all modules', icon: Star, earned: false },
    { name: '30-Day Streak', desc: 'Maintain 30 day streak', icon: Flame, earned: false },
    { name: 'Challenge Master', desc: 'Solve 20 challenges', icon: Shield, earned: false },
  ];

  // Completed lessons by module
  const completedModules = [
    {
      name: 'HTML Basics',
      emoji: '🟧',
      lessons: [
        'What is HTML?', 'Your First HTML Page', 'Text & Headings', 'Links & Images',
        'Lists & Tables', 'HTML Forms', 'Semantic HTML', 'HTML5 Media',
        'Accessibility Basics', 'HTML Best Practices', 'Project: Personal Page', 'Module Review & Quiz',
      ],
    },
    {
      name: 'CSS Styling',
      emoji: '🟦',
      lessons: ['What is CSS?', 'Selectors & Properties', 'Colors & Backgrounds', 'Box Model', 'Typography', 'Flexbox Basics'],
    },
    {
      name: 'JavaScript',
      emoji: '🟨',
      lessons: ['What is JavaScript?', 'Variables & Types', 'Functions'],
    },
  ];

  const [expandedModule, setExpandedModule] = useState(null);

  return (
    <div className="min-h-screen bg-[var(--color-base)]">
      {/* Cover Strip */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-12">
        {/* Avatar + Name */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          <div className="w-28 h-28 rounded-2xl bg-[var(--color-card)] border-4 border-[var(--color-base)] flex items-center justify-center text-4xl font-bold text-indigo-400 shrink-0 shadow-xl">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="pt-4">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {isPro && <Badge variant="PRO">PRO</Badge>}
            </div>
            <p className="text-slate-400 text-sm mb-2">@{profile.username}</p>
            <p className="text-slate-300 text-sm max-w-lg mb-2">{profile.bio}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined {profile.joinDate}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          <div className="bg-[var(--color-card)] border border-slate-700 rounded-xl p-4 text-center">
            <Zap className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{profile.stats.xp.toLocaleString()}</p>
            <p className="text-xs text-slate-500">XP</p>
          </div>
          <div className="bg-[var(--color-card)] border border-slate-700 rounded-xl p-4 text-center">
            <Trophy className="h-5 w-5 text-purple-400 mx-auto mb-1" />
            <p className="text-xl font-bold">Level {profile.stats.level}</p>
            <p className="text-xs text-slate-500">Level</p>
          </div>
          <div className="bg-[var(--color-card)] border border-slate-700 rounded-xl p-4 text-center">
            <BookOpen className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{profile.stats.lessonsCompleted}</p>
            <p className="text-xs text-slate-500">Lessons</p>
          </div>
          <div className="bg-[var(--color-card)] border border-slate-700 rounded-xl p-4 text-center">
            <Flame className="h-5 w-5 text-orange-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{profile.stats.streak}</p>
            <p className="text-xs text-slate-500">Streak</p>
          </div>
          <div className="bg-[var(--color-card)] border border-slate-700 rounded-xl p-4 text-center">
            <Code className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{profile.stats.challengesSolved}</p>
            <p className="text-xs text-slate-500">Challenges</p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="h-5 w-5 text-yellow-400" /> Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((badge, idx) => (
              <BadgeCard key={idx} name={badge.name} description={badge.desc} earned={badge.earned} icon={badge.icon} />
            ))}
          </div>
        </div>

        {/* Completed Lessons Accordion */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-cyan-400" /> Completed Lessons</h2>
          <div className="space-y-2">
            {completedModules.map((mod, idx) => (
              <div key={idx} className="bg-[var(--color-card)] border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{mod.emoji}</span>
                    <span className="font-semibold">{mod.name}</span>
                    <span className="text-xs text-slate-500">{mod.lessons.length} lessons</span>
                  </div>
                  {expandedModule === idx ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {expandedModule === idx && (
                  <div className="border-t border-slate-800 px-5 py-3 space-y-2">
                    {mod.lessons.map((lesson, li) => (
                      <div key={li} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                        {lesson}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
