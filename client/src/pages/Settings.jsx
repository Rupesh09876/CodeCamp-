import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, CreditCard, Crown, Upload, Trash2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import api from '../api';

const Settings = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const isPro = authUser?.plan === 'pro';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: authUser?.name || 'Rupesh Katuwal',
    username: authUser?.username || 'rupesh_dev',
    bio: 'Learning web development one lesson at a time.',
    github: '',
    twitter: '',
    website: '',
  });

  const [notifications, setNotifications] = useState({
    emailLessons: true,
    emailCommunity: true,
    emailMarketing: false,
    pushStreak: true,
    pushBadge: true,
  });

  useEffect(() => {
    if (activeTab === 'subscription' && isPro) {
      const fetchPayments = async () => {
        setLoadingPayments(true);
        try {
          const res = await api.get('/payment/history');
          setPayments(res.data);
        } catch (err) {
          console.error('Failed to fetch payments:', err);
        } finally {
          setLoadingPayments(false);
        }
      };
      fetchPayments();
    }
  }, [activeTab, isPro]);

  return (
    <div className="h-full bg-[var(--color-base)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold mb-8">Settings</h1>

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="flex sm:flex-col gap-2 sm:w-48 shrink-0 overflow-x-auto sm:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-grow">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-[var(--color-card)] border border-[var(--color-ui-border)] rounded-2xl p-6 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Profile Settings</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center text-3xl font-bold text-indigo-600 border border-[var(--color-ui-border)]">
                    {profileForm.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Button variant="ghost" className="text-xs text-indigo-600 hover:bg-indigo-50">
                      <Upload className="h-3.5 w-3.5 mr-1" /> Upload Photo
                    </Button>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">JPG, PNG. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">Username</label>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">Bio</label>
                  <textarea
                    rows="3"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 resize-none transition-colors"
                  />
                </div>

                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Social Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="GitHub username" 
                    value={profileForm.github} 
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })} 
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-400" 
                  />
                  <input 
                    type="text" 
                    placeholder="Twitter handle" 
                    value={profileForm.twitter} 
                    onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })} 
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-400" 
                  />
                </div>

                <Button variant="primary" className="text-white">Save Changes</Button>
              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-[var(--color-card)] border border-[var(--color-ui-border)] rounded-2xl p-6 space-y-4 shadow-sm">
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Change Password</h2>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-400" />
                  </div>
                  <Button variant="primary" className="text-white">Update Password</Button>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-900/10 border border-red-900/50 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-2"><AlertTriangle className="h-5 w-5" /> Danger Zone</h2>
                  <p className="text-sm text-slate-400 mb-4">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
                  <Button variant="danger">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Account
                  </Button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="bg-[var(--color-card)] border border-[var(--color-ui-border)] rounded-2xl p-6 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Notification Preferences</h2>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email Notifications</h3>
                  {[
                    { key: 'emailLessons', label: 'New lesson reminders' },
                    { key: 'emailCommunity', label: 'Community replies and mentions' },
                    { key: 'emailMarketing', label: 'Product updates and tips' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-[var(--color-surface)]/50 rounded-lg cursor-pointer border border-[var(--color-ui-border)]/50">
                      <span className="text-sm text-[var(--color-text-secondary)] font-medium">{item.label}</span>
                      <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${notifications[item.key] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications[item.key] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  ))}

                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider pt-2">Push Notifications</h3>
                  {[
                    { key: 'pushStreak', label: 'Streak reminders' },
                    { key: 'pushBadge', label: 'New badge earned' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-[var(--color-surface)]/50 rounded-lg cursor-pointer border border-[var(--color-ui-border)]/50">
                      <span className="text-sm text-[var(--color-text-secondary)] font-medium">{item.label}</span>
                      <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${notifications[item.key] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications[item.key] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* SUBSCRIPTION TAB */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                {isPro ? (
                  <>
                    <div className="bg-[var(--color-card)] border border-purple-700/50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="PRO">PRO</Badge>
                        <h2 className="text-xl font-bold">Pro Plan</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                          <p className="text-slate-400">Status</p>
                          <p className="font-semibold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Active</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Next billing</p>
                          <p className="font-semibold">May 25, 2026</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Plan</p>
                          <p className="font-semibold">Rs. 999/month</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Member since</p>
                          <p className="font-semibold">January 2026</p>
                        </div>
                      </div>
                      <Button variant="ghost">Cancel Subscription</Button>
                    </div>

                    {/* Payment History */}
                    <div className="bg-[var(--color-card)] border border-slate-700 rounded-2xl p-6">
                      <h3 className="font-bold mb-4">Payment History</h3>
                      {loadingPayments ? (
                        <div className="flex justify-center py-4"><Loader2 className="animate-spin w-6 h-6 text-indigo-500" /></div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead>
                              <tr className="border-b border-slate-800">
                                <th className="py-2 text-slate-400 font-medium">Date</th>
                                <th className="py-2 text-slate-400 font-medium">Amount</th>
                                <th className="py-2 text-slate-400 font-medium">Status</th>
                                <th className="py-2 text-slate-400 font-medium">Method</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {payments.length > 0 ? payments.map((payment) => (
                                <tr key={payment._id}>
                                  <td className="py-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                  <td className="py-3 font-semibold text-white">Rs. {payment.amount}</td>
                                  <td className={`py-3 capitalize ${payment.status === 'success' ? 'text-emerald-400' : payment.status === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>{payment.status}</td>
                                  <td className="py-3">Khalti</td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan="4" className="py-4 text-center text-slate-500">No payment history found.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-700/50 rounded-2xl p-8 text-center">
                    <Crown className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">Get unlimited AI tutor access, verified certificates, offline downloads, priority support, and exclusive Pro challenges.</p>
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      {['Unlimited AI', 'Certificates', 'Offline Access', 'Priority Support', 'Pro Challenges', 'Early Access'].map((f) => (
                        <span key={f} className="flex items-center gap-1 text-sm text-purple-300">
                          <CheckCircle2 className="h-4 w-4 text-purple-400" /> {f}
                        </span>
                      ))}
                    </div>
                    <Button variant="pro" className="px-8 py-3 text-lg" onClick={() => navigate('/pricing')}>
                      Upgrade Now — Rs. 999/mo
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;