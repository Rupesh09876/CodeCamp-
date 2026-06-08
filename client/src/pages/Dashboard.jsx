import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Code2, Bot, Trophy, Settings, Crown, Flame, Zap, CheckCircle, ArrowRight, Star, Award, Shield, Rocket, Target, Heart } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import api from '../api';

const BadgeIcon = ({ name, className }) => {
  const icons = {
    zap: Zap,
    flame: Flame,
    star: Star,
    award: Award,
    shield: Shield,
    rocket: Rocket,
    code: Code2,
    target: Target,
    heart: Heart
  };
  const IconComponent = icons[name.toLowerCase()] || Star;
  return <IconComponent className={className} />;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isPro = user?.plan === 'pro';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, leaderboardRes, coursesRes] = await Promise.all([
          api.get('/users/dashboard'),
          api.get('/users/leaderboard'),
          api.get('/progress/my-courses')
        ]);

        setDashboardData(userRes.data);
        setLeaderboard(leaderboardRes.data);
        setMyCourses(coursesRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    // Check for Khalti payment return
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get('pidx');
    
    if (pidx) {
      const verifyPayment = async () => {
        try {
          const res = await api.post('/payment/khalti/verify', { pidx });
          alert(res.data.msg || 'Payment Successful! You are now a Pro member.');
          window.location.href = '/dashboard'; // Clear the URL params
        } catch (err) {
          console.error('Payment verification failed', err);
        }
      };
      verifyPayment();
    } else {
      fetchData();
    }
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-[var(--color-primary)] font-bold">Loading dashboard...</div>;
  }

  const currentUserData = dashboardData || user;
  const completedCoursesCount = myCourses.filter(c => c.completionPercentage === 100).length;
  const inProgressCoursesCount = myCourses.filter(c => (c.completionPercentage || 0) > 0 && (c.completionPercentage || 0) < 100).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">

        {/* Welcome Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUserData?.name?.split(' ')[0] || 'Coder'}! 👋</h1>
            <p className="text-[var(--color-text-secondary)]">You're making great progress. Keep it up!</p>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex flex-col border border-[var(--color-ui-border)] shadow-sm hover:border-[var(--color-primary)] transition-colors bg-[var(--color-card)]">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full">
                Level {currentUserData?.level || 1}
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-1">XP Points</p>
            <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">{currentUserData?.xp || 0}</h3>
          </Card>

          <Card className="flex flex-col border border-[var(--color-ui-border)] shadow-sm hover:border-orange-400 transition-colors bg-[var(--color-card)]">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full border border-[var(--color-ui-border)]">
                Active
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-1">Current Streak</p>
            <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">{currentUserData?.streak || 0} Days</h3>
          </Card>

          <Card className="flex flex-col border border-[var(--color-ui-border)] shadow-sm hover:border-green-400 transition-colors bg-[var(--color-card)]">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full border border-[var(--color-ui-border)]">
                Keep it up! 🏅
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-1">Courses Completed</p>
            <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">{completedCoursesCount}</h3>
          </Card>

          <Card className="flex flex-col border border-[var(--color-ui-border)] shadow-sm hover:border-purple-400 transition-colors bg-[var(--color-card)]">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-ui-border)] text-[var(--color-text-secondary)] rounded-full">
                {isPro ? 'Pro Plan' : 'Free Plan'}
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-1">AI Tutor Usage</p>
            <h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{isPro ? 'Unlimited' : `${currentUserData?.aiQueriesUsedToday || 0} / 5`}</h3>
            {!isPro && (
              <div className="w-full bg-[var(--color-surface)] rounded-full h-1.5 mt-auto">
                <div className="bg-gradient-to-r from-purple-500 to-[var(--color-primary)] h-1.5 rounded-full" style={{ width: `${((currentUserData?.aiQueriesUsedToday || 0) / 5) * 100}%` }}></div>
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Progress Overview & Continue Learning (Left Col - 2/3) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Progress Overview */}
            <Card className="p-0 overflow-hidden border border-[var(--color-ui-border)] bg-[var(--color-card)]">
              <div className="p-6 border-b border-[var(--color-ui-border)]">
                <h3 className="text-lg font-bold">Progress Overview</h3>
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-center gap-8">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface)" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="url(#gradient)" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (completedCoursesCount / Math.max(1, completedCoursesCount + inProgressCoursesCount)))} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-primary)" />
                        <stop offset="100%" stopColor="var(--color-accent)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {Math.max(completedCoursesCount + inProgressCoursesCount) > 0 
                        ? Math.round((completedCoursesCount / (completedCoursesCount + inProgressCoursesCount)) * 100) 
                        : 0}%
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-success)]"></div>
                      <span className="text-sm font-medium">Completed Courses</span>
                    </div>
                    <span className="font-bold">{completedCoursesCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></div>
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                    <span className="font-bold">{inProgressCoursesCount}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Continue Learning */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Continue Learning</h3>
                <Link to="/my-courses" className="text-sm text-[var(--color-primary)] hover:underline font-medium">View All</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {myCourses.length > 0 ? myCourses.slice(0, 3).map((courseProgress, i) => (
                  <Card key={i} className="min-w-[300px] snap-start border border-[var(--color-ui-border)] flex flex-col bg-[var(--color-card)]">
                    <div className="h-32 rounded-lg bg-indigo-50 mb-4 flex items-center justify-center border border-indigo-100 overflow-hidden relative">
                      {courseProgress.course.thumbnail ? (
                        <img src={courseProgress.course.thumbnail} alt={courseProgress.course.title} className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="text-indigo-500 font-bold text-4xl">{courseProgress.course.category}</div>
                      )}
                    </div>
                    <h4 className="font-bold mb-1 truncate">{courseProgress.course.title}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">{courseProgress.completedLessonsCount} lessons completed</p>

                    <div className="w-full bg-[var(--color-surface)] rounded-full h-1.5 mb-4 mt-auto">
                      <div className="bg-[var(--color-primary)] h-1.5 rounded-full" style={{ width: `${courseProgress.completionPercentage}%` }}></div>
                    </div>

                    <Link to={`/practice/${courseProgress.course.category.toLowerCase()}/${courseProgress.completedLessonsCount + 1}`}>
                      <Button className="w-full text-white bg-slate-900 hover:bg-slate-800">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                    </Link>
                  </Card>
                )) : (
                  <div className="w-full text-center p-8 bg-[var(--color-card)] rounded-xl border border-dashed border-[var(--color-ui-border)]">
                    <p className="text-[var(--color-text-secondary)] mb-4">You haven't started any courses yet.</p>
                    <Link to="/practice/html/1">
                      <Button>Start Your First Course</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* AI Suggestion Card */}
            <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-purple-500">
              <Card className="bg-[var(--color-card)] rounded-2xl h-full border-0 relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                      AI Suggestion <span className="text-[10px] uppercase tracking-wider bg-purple-100 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-bold">Smart</span>
                    </h3>
                    <p className="font-semibold text-[var(--color-text-primary)] mb-2">Ready for a Challenge?</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                      Based on your progress, you might be ready to tackle some interactive challenges!
                    </p>
                    <Link to="/practice/html/1">
                      <Button variant="pro" className="py-2 text-xs text-white">Start Practice <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

          </div>

          {/* Badges & Leaderboard (Right Col - 1/3) */}
          <div className="space-y-8">

            {/* Upgrade Banner */}
            {!isPro && (
              <div className="bg-gradient-primary rounded-xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-yellow-300" />
                    <h3 className="font-bold text-lg">Upgrade to Pro</h3>
                  </div>
                  <p className="text-sm text-indigo-50 mb-4">
                    Unlock unlimited AI help, all premium courses, and official certificates.
                  </p>
                  <Link to="/pricing">
                    <Button className="w-full bg-white text-[var(--color-primary)] hover:bg-slate-50 transition-colors border-0 font-bold">Upgrade Now</Button>
                  </Link>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            )}

            {/* Your Badges */}
            <Card className="p-0 overflow-hidden border border-[var(--color-ui-border)] bg-[var(--color-card)]">
              <div className="p-4 border-b border-[var(--color-ui-border)] flex justify-between items-center bg-[var(--color-surface)]/50">
                <h3 className="font-bold">Your Badges</h3>
                <Link to="/achievements" className="text-xs text-[var(--color-primary)] font-medium hover:underline">View All</Link>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {currentUserData?.badges?.length > 0 ? (
                  currentUserData.badges.slice(0, 4).map((badge, idx) => (
                    <div key={idx} className="flex flex-col items-center p-3 bg-white rounded-lg border border-[var(--color-ui-border)] shadow-sm text-center">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                        <BadgeIcon name={badge.icon || 'star'} className="w-5 h-5 text-yellow-500" />
                      </div>
                      <span className="text-xs font-semibold">{badge.name}</span>
                      <span className="text-[10px] text-[var(--color-success)] font-medium">Earned</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-sm text-[var(--color-text-secondary)] py-4">
                    No badges earned yet. Keep coding!
                  </div>
                )}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="p-0 overflow-hidden border border-[var(--color-ui-border)] bg-[var(--color-card)]">
              <div className="p-4 border-b border-[var(--color-ui-border)] flex justify-between items-center bg-[var(--color-surface)]/50">
                <h3 className="font-bold">Leaderboard</h3>
                <Link to="/leaderboard" className="text-xs text-[var(--color-primary)] font-medium hover:underline">Full List</Link>
              </div>
              <div className="p-0">
                {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((lUser, idx) => (
                  <div key={lUser._id} className={`flex items-center justify-between p-3 border-b border-[var(--color-ui-border)] hover:bg-[var(--color-surface)] transition-colors ${lUser._id === currentUserData?._id ? 'bg-indigo-50 border-l-4 border-[var(--color-primary)]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-4 text-center ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-orange-500' : 'text-[var(--color-text-secondary)]'}`}>{idx + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                        {lUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`text-sm font-semibold ${lUser._id === currentUserData?._id ? 'text-[var(--color-text-primary)]' : ''}`}>
                        {lUser.name} {lUser._id === currentUserData?._id && '(You)'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-primary)]">{lUser.xp} XP</span>
                  </div>
                )) : (
                  <div className="text-center text-sm text-[var(--color-text-secondary)] py-4">No data available</div>
                )}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
