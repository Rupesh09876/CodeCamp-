import { useState, useEffect } from 'react';
import { Search, Download, Eye, Crown, Trash2, Shield, X, Zap, Flame, BookOpen, CreditCard, Loader2 } from 'lucide-react';
import Badge from '../../components/UI/Badge';
import api from '../../api';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const planStyles = { 
    admin: 'bg-amber-50 text-amber-700 border-amber-200', 
    pro: 'bg-purple-50 text-purple-700 border-purple-200', 
    free: 'bg-slate-50 text-slate-600 border-slate-200' 
  };

  const filtered = users.filter(u => {
    const plan = u.plan || 'free';
    const matchesFilter = filter === 'All' || plan.toLowerCase() === filter.toLowerCase() || (filter === 'All Plans');
    const matchesSearch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Name,Email,Plan,XP,Joined,Streak'];
    const csvData = filtered.map(u => {
      const date = new Date(u.createdAt).toLocaleDateString();
      const plan = u.plan || 'free';
      return `"${u.name}","${u.email}","${plan}","${u.xp || 0}","${date}","${u.streak || 0}"`;
    });
    
    const blob = new Blob([headers.concat(csvData).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toLocaleDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openDrawer = (user) => { setSelectedUser(user); setShowDrawer(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">User Management</h2>
          <p className="text-slate-500 text-sm">Monitor and manage user accounts ({users.length})</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm transition-all" 
          />
        </div>
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)} 
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer"
        >
          <option>All Plans</option>
          <option value="free">Free Users</option>
          <option value="pro">Pro Users</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="text-left p-4">User</th>
                <th className="text-left p-4 hidden md:table-cell">Email</th>
                <th className="text-left p-4">Plan</th>
                <th className="text-left p-4 hidden sm:table-cell">XP</th>
                <th className="text-left p-4 hidden lg:table-cell">Joined</th>
                <th className="text-left p-4 hidden lg:table-cell">Activity</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => {
                const plan = u.plan || 'free';
                return (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shadow-sm border ${plan === 'admin' ? 'bg-amber-100 text-amber-700 border-amber-200' : plan === 'pro' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium md:hidden">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium hidden md:table-cell">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest ${planStyles[plan] || planStyles.free}`}>
                        {plan}
                      </span>
                    </td>
                    <td className="p-4 text-slate-900 font-bold hidden sm:table-cell">{u.xp?.toLocaleString() || 0}</td>
                    <td className="p-4 text-slate-500 text-xs font-medium hidden lg:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-500 text-xs font-medium hidden lg:table-cell">{u.streak || 0} day streak</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openDrawer(u)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Profile"><Eye className="h-4 w-4" /></button>
                        {plan === 'free' && <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Upgrade to Pro"><Crown className="h-4 w-4" /></button>}
                        {plan !== 'admin' && <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User"><Trash2 className="h-4 w-4" /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Drawer */}
      {showDrawer && selectedUser && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex justify-end" onClick={() => setShowDrawer(false)}>
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-8 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">User Profile</h2>
              <button onClick={() => setShowDrawer(false)} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full transition-colors"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {/* Profile Header */}
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-extrabold shadow-md border ${selectedUser.plan === 'admin' ? 'bg-amber-100 text-amber-700 border-amber-200' : selectedUser.plan === 'pro' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-slate-500 font-medium mb-2">{selectedUser.email}</p>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${planStyles[selectedUser.plan]}`}>
                    {selectedUser.plan} Account
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center">
                  <Zap className="h-5 w-5 text-indigo-500 mb-2" />
                  <p className="text-xl font-extrabold text-slate-900">{selectedUser.xp.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total XP</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center">
                  <Shield className="h-5 w-5 text-purple-500 mb-2" />
                  <p className="text-xl font-extrabold text-slate-900">Level {selectedUser.level}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill Level</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center">
                  <Flame className="h-5 w-5 text-orange-500 mb-2" />
                  <p className="text-xl font-extrabold text-slate-900">8 Days</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streak</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center">
                  <BookOpen className="h-5 w-5 text-emerald-500 mb-2" />
                  <p className="text-xl font-extrabold text-slate-900">18</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lessons</p>
                </div>
              </div>

              {/* Billing History */}
              {selectedUser.plan === 'pro' && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-slate-400" /> Subscription History
                  </h4>
                  <div className="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center p-4">
                      <span className="font-bold text-slate-700">April 2026</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-900 font-bold">Rs. 999</span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase border border-emerald-100">Paid</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4">
                      <span className="font-bold text-slate-700">March 2026</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-900 font-bold">Rs. 999</span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase border border-emerald-100">Paid</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Control Actions */}
              <div className="pt-4 space-y-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Administrative Controls</p>
                {selectedUser.plan === 'free' && (
                  <button className="w-full py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-all border border-indigo-100">
                    Grant Pro Access
                  </button>
                )}
                {selectedUser.plan === 'pro' && (
                  <button className="w-full py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl transition-all border border-amber-100">
                    Downgrade to Free
                  </button>
                )}
                {selectedUser.plan !== 'admin' && (
                  <button className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all border border-red-100 flex items-center justify-center gap-2">
                    <Trash2 className="h-4 w-4" /> Suspend Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
