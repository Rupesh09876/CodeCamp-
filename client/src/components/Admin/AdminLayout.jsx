import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Zap, Award, Users, Crown, Shield, CreditCard,
  BarChart2, Settings, FileText, ArrowLeft, LogOut, GraduationCap, Bell, Search, Menu, X, Trash2, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [{ name: 'Dashboard', path: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'CONTENT',
    items: [
      { name: 'Courses', path: '/admin/courses', icon: BookOpen },
      { name: 'Challenges', path: '/admin/challenges', icon: Zap },
      { name: 'Badges', path: '/admin/badges', icon: Award },
    ],
  },
  {
    label: 'USERS',
    items: [
      { name: 'All Users', path: '/admin/users', icon: Users },
      { name: 'Premium', path: '/admin/users/premium', icon: Crown },
    ],
  },
  {
    label: 'REVENUE',
    items: [
      { name: 'Transactions', path: '/admin/revenue', icon: CreditCard },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const currentTitle = navGroups.flatMap(g => g.items).find(i => i.path === location.pathname)?.name || 'Admin';

  const handleLogout = () => { logout(); navigate('/'); };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center shadow-md">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            CodeCamp
          </span>
        </Link>
      </div>

      {/* Admin Profile */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600 shadow-sm">
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-extrabold text-slate-900 leading-tight">{user?.name || 'Admin'}</p>
            <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest mt-1 inline-block">
              Super Admin
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto px-4 py-6 space-y-8">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 w-full text-left transition-colors border border-transparent hover:border-red-100">
          <LogOut className="h-5 w-5 text-red-500" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white shadow-sm z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        {/* Decorative Background Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-[100px] opacity-40 translate-x-1/2 translate-y-1/2 pointer-events-none" />

        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-100">
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{currentTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 w-64 transition-all" />
            </div>
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
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
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto p-4 md:p-8 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
