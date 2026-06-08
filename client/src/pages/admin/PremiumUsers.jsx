import { useState, useEffect } from 'react';
import { Crown, AlertCircle, CheckCircle2, XCircle, Search, Filter, Loader2 } from 'lucide-react';
import api from '../../api';

const PremiumUsers = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [premiumUsers, setPremiumUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        const proUsers = res.data.filter(u => u.plan === 'pro').map(u => {
          const sub = u.subscription || {};
          const start = sub.startDate ? new Date(sub.startDate) : new Date(u.createdAt);
          const end = sub.endDate ? new Date(sub.endDate) : new Date(start);
          if (!sub.endDate) end.setMonth(end.getMonth() + 1);
          
          const daysLeft = Math.max(0, Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24)));
          
          return {
            _id: u._id,
            name: u.name,
            email: u.email,
            start: start.toLocaleDateString(),
            end: end.toLocaleDateString(),
            daysLeft: daysLeft,
            amount: u.plan === 'pro' ? 'Rs. 999' : 'N/A', // Amount logic can be improved later
            pidx: sub.khaltiPaymentId || 'N/A',
            status: daysLeft > 7 ? 'active' : daysLeft > 0 ? 'expiring' : 'expired'
          };
        });
        setPremiumUsers(proUsers);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const statusStyles = { 
    active: 'text-emerald-700 bg-emerald-50 border-emerald-100', 
    expiring: 'text-amber-700 bg-amber-50 border-amber-100', 
    expired: 'text-red-700 bg-red-50 border-red-100' 
  };

  const statusIcons = {
    active: CheckCircle2,
    expiring: AlertCircle,
    expired: XCircle
  };

  const filters = ['All', 'Active', 'Expiring Soon'];

  const filtered = premiumUsers.filter(u => {
    const matchesFilter = filter === 'All' || (filter === 'Active' && u.status === 'active') || (filter === 'Expiring Soon' && u.status === 'expiring');
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Crown className="h-6 w-6 text-purple-600" /> Premium Subscribers
          </h2>
          <p className="text-slate-500 text-sm mt-1">{premiumUsers.filter(u => u.status !== 'expired').length} active premium accounts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 w-64 shadow-sm"
            />
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shadow-inner">
            {filters.map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="text-left p-6">Subscriber</th>
                <th className="text-left p-6 hidden sm:table-cell">Duration</th>
                <th className="text-left p-6">Validity</th>
                <th className="text-left p-6 hidden md:table-cell">Total Invested</th>
                <th className="text-left p-6 hidden lg:table-cell">Last Invoice</th>
                <th className="text-left p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u, i) => {
                const Icon = statusIcons[u.status] || CheckCircle2;
                return (
                  <tr key={u._id || i} className={`hover:bg-slate-50/50 transition-colors ${u.status === 'expiring' ? 'bg-amber-50/20' : ''}`}>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm border shadow-sm ${u.status === 'active' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block">{u.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Started: {u.start}</span>
                        <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tighter">Ends: {u.end}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${u.daysLeft <= 7 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(100, (u.daysLeft / 90) * 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-extrabold ${u.daysLeft <= 7 && u.daysLeft > 0 ? 'text-amber-600' : u.daysLeft === 0 ? 'text-red-600' : 'text-slate-900'}`}>
                          {u.daysLeft === 0 ? 'Expired' : `${u.daysLeft} days left`}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-slate-900 font-extrabold hidden md:table-cell">{u.amount}</td>
                    <td className="p-6 text-slate-400 font-mono text-[10px] hidden lg:table-cell uppercase tracking-tighter">{u.pidx}</td>
                    <td className="p-6">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest flex items-center gap-1.5 w-fit ${statusStyles[u.status]}`}>
                        <Icon className="h-3 w-3" />
                        {u.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PremiumUsers;
