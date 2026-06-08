import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  Bot, 
  Trophy, 
  Settings, 
  Crown, 
  Users, 
  Target, 
  Star, 
  Award 
} from 'lucide-react';
import Button from '../UI/Button';

const UserLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isPro = user?.plan === 'pro';

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Practice', icon: Code2, path: '/practice' },
    { name: 'My Courses', icon: BookOpen, path: '/my-courses' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Challenges', icon: Target, path: '/challenges' },
    { name: 'AI Tutor', icon: Bot, path: '/ai-tutor' },
    { name: 'Achievements', icon: Star, path: '/achievements' },
    { name: 'Certificates', icon: Award, path: '/certificates' },
    { name: 'Subscription', icon: Crown, path: '/pricing' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex flex-1 bg-[var(--color-base)] text-[var(--color-text-primary)] overflow-hidden">
      {/* Sidebar Navigation (fixed left) */}
      <aside className="w-64 bg-[var(--color-card)] border-r border-[var(--color-ui-border)] flex flex-col hidden md:flex flex-shrink-0 z-20">

        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            // Basic active state matching
            const isActive = location.pathname.startsWith(link.path === '/practice/html/1' ? '/practice' : link.path);
            
            return (
              <Link
                to={link.path}
                key={link.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-primary text-white shadow-md' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Main Content Area (scrollable) */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
