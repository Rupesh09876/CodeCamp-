import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, User, LogOut, LayoutDashboard, Menu, X, Flame, Zap, Bell, Settings, Crown, ChevronDown, CheckCircle2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';
import api from '../../api';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ALL hooks must be declared before any conditional returns
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isUpgradeBannerDismissed, setIsUpgradeBannerDismissed] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdown on outside click — hook must be before early returns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsAvatarDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await api.delete('/notifications/all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // ← Early return AFTER all hooks are declared (fixes the crash)
  const hideNav = location.pathname === '/login' || location.pathname === '/register';
  if (hideNav) return null;

  const isPro = user?.plan === 'pro';

  const handleLogout = () => {
    logout();
    setIsAvatarDropdownOpen(false);
    navigate('/');
  };

  // Show nav links only when not logged in or in mobile menu? Actually we can just keep it empty for authenticated users since they have the sidebar
  const navLinks = isAuthenticated ? [] : [];

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-sm">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                CodeCamp
              </span>
            </Link>

            {/* Desktop nav links (center) — only when logged in */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-slate-600 hover:text-[var(--color-primary)] font-medium transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-1 text-xs font-semibold text-orange-600">
                    <Flame className="h-3.5 w-3.5" /> {user?.streak || 0}
                  </div>
                  <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1 text-xs font-semibold text-indigo-600">
                    <Zap className="h-3.5 w-3.5" /> {user?.xp || 0}
                  </div>
                  {/* Notifications dropdown */}
                  <div className="relative" ref={notifRef}>
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative text-slate-400 hover:text-slate-600 transition-colors p-1.5"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>}
                    </button>
                    
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                          <h3 className="font-extrabold text-slate-900 text-sm">Notifications</h3>
                          <div className="flex gap-2">
                            <button onClick={markAllRead} className="text-xs text-indigo-600 hover:text-indigo-800 font-bold" title="Mark all read"><CheckCircle2 className="h-4 w-4" /></button>
                            <button onClick={clearAllNotifications} className="text-xs text-red-500 hover:text-red-700 font-bold" title="Clear all"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">No new notifications</div>
                          ) : (
                            <div className="divide-y divide-slate-50">
                              {notifications.map(n => (
                                <div key={n._id} className={`p-4 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}>
                                  <p className="text-sm font-bold text-slate-900 mb-1">{n.title}</p>
                                  <p className="text-xs text-slate-500">{n.message}</p>
                                  <p className="text-[10px] text-slate-400 mt-2 font-medium">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                      className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-white shadow-sm">
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    {isAvatarDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="font-semibold text-sm text-slate-900">{user?.name || 'User'}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                        <Link to="/dashboard" onClick={() => setIsAvatarDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setIsAvatarDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                          <User className="h-4 w-4" /> Profile
                        </Link>
                        <Link to="/settings" onClick={() => setIsAvatarDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                          <Settings className="h-4 w-4" /> Settings
                        </Link>
                        {!isPro && (
                          <Link to="/pricing" onClick={() => setIsAvatarDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-primary)] hover:bg-purple-50 transition-colors">
                            <Crown className="h-4 w-4" /> Upgrade to Pro
                          </Link>
                        )}
                        <div className="border-t border-slate-100 mt-1">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors">
                            <LogOut className="h-4 w-4" /> Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 text-sm transition-colors">
                    Log in
                  </Link>
                  <Link to="/register">
                    <button className="bg-gradient-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
                      Sign up
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 hover:text-slate-900 p-2">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 right-0 w-64 bg-white border-l border-slate-100 p-6 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg text-slate-900">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="text-slate-600 hover:text-[var(--color-primary)] font-medium text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto border-t border-slate-100 pt-6 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 hover:text-slate-900"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 hover:text-slate-900"><User className="h-5 w-5" /> Profile</Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-red-500 hover:text-red-600"><LogOut className="h-5 w-5" /> Log out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="w-full border border-slate-200 text-slate-700 py-2 rounded-lg font-medium text-sm">Log in</button>
                    <button onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }} className="w-full bg-gradient-primary text-white py-2 rounded-lg font-semibold text-sm">Sign up</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Upgrade Banner */}
      {isAuthenticated && !isPro && !isUpgradeBannerDismissed && (
        <div className="bg-indigo-600 px-4 py-2 flex items-center justify-center gap-4 text-sm sticky top-16 z-40 text-white">
          <Crown className="h-4 w-4 text-yellow-300 shrink-0" />
          <span><strong>Upgrade to Pro</strong> — unlimited AI, certificates & more</span>
          <Link to="/pricing" className="bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full hover:bg-slate-100 transition-colors">
            Upgrade
          </Link>
          <button onClick={() => setIsUpgradeBannerDismissed(true)} className="text-white/60 hover:text-white ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
