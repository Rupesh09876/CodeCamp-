import { useState, useEffect } from 'react';
import { Users as UsersIcon, CreditCard, Activity, TrendingUp, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/UI/Card';
import api from '../../api';

const Crown = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
  </svg>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, transRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/transactions')
        ]);
        setStats(statsRes.data);
        setTransactions(transRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const userGrowthData = stats?.userGrowthData || [];
  const revenueData = stats?.revenueGrowthData || [];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Users</p>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">{stats?.totalUsers?.toLocaleString() || 0}</h3>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 w-fit px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> +12.5%
          </p>
        </div>

        {/* Pro Users */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Pro Users</p>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Crown className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">{stats?.proUsers?.toLocaleString() || 0}</h3>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 w-fit px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> +8.2%
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Revenue</p>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">Rs. {stats?.revenue?.toLocaleString() || 0}</h3>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 w-fit px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> +24.5%
          </p>
        </div>

        {/* Active Challenges */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Active Challenges</p>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">{stats?.activeChallenges || 0}</h3>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
            Real-time tracking enabled
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-900 text-lg mb-6">User Growth</h3>
          <div className="h-[300px] min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.userGrowthData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#6C63FF', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="users" stroke="#6C63FF" strokeWidth={4} dot={{r: 4, fill: '#6C63FF', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-900 text-lg mb-6">Revenue Overview (NPR)</h3>
          <div className="h-[300px] min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} tickFormatter={(value) => `Rs. ${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#00D4FF', fontWeight: 'bold' }}
                  formatter={(value) => [`Rs. ${value}`, 'Revenue']}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} barSize={32}>
                  {/* Add gradient definition */}
                  {revenueData.map((entry, index) => (
                    <cell key={`cell-${index}`} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-extrabold text-slate-900 text-lg">Recent Transactions</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-bold transition-colors">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 border-b border-slate-100 text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {transactions.length > 0 ? transactions.map((trx) => (
                <tr key={trx._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{trx.purchase_order_id || trx._id.substring(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-700 border border-indigo-200 shadow-sm">
                        {trx.userId?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-bold text-slate-900">{trx.userId?.name || 'Unknown User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                      {trx.plan || 'Pro'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-bold">Rs. {trx.amount}</td>
                  <td className="px-6 py-4 font-medium">{new Date(trx.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      trx.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      trx.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/30">
                    No transactions found yet. Live revenue will appear here once users upgrade.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
