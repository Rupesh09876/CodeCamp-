import { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Crown, Banknote, Calendar, ChevronRight, FileText, Download, Loader2 } from 'lucide-react';
import api from '../../api';

const Revenue = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [statsData, setStatsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, transRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/transactions')
        ]);
        setStatsData(statsRes.data);
        setTransactions(transRes.data);
      } catch (err) {
        console.error('Failed to fetch revenue data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportReport = () => {
    if (transactions.length === 0) return;
    const headers = ['Date,User,Amount,Transaction ID,Status'];
    const csvData = transactions.map(t => {
      const date = new Date(t.createdAt).toLocaleDateString();
      const user = t.userId?.name || 'Unknown User';
      return `${date},${user},Rs. ${t.amount},${t._id},${t.status}`;
    });
    
    const blob = new Blob([headers.concat(csvData).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue_report_${new Date().toLocaleDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${statsData?.revenue?.toLocaleString() || 0}`, icon: Banknote, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'This Month', value: `Rs. ${statsData?.revenueGrowthData?.[statsData.revenueGrowthData.length-1]?.revenue?.toLocaleString() || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Total Users', value: statsData?.totalUsers?.toLocaleString() || 0, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'Active Pro', value: statsData?.proUsers?.toLocaleString() || 0, icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ];

  // Map backend revenue growth to chart data
  const revenueData = statsData?.revenueGrowthData?.map(d => ({ day: d.name, amount: d.revenue })) || [];
  const maxRevenue = Math.max(...revenueData.map(d => d.amount), 1); // fallback to 1 to avoid division by zero

  const statusStyles = { 
    success: 'text-emerald-700 bg-emerald-50 border-emerald-100', 
    failed: 'text-red-700 bg-red-50 border-red-100', 
    pending: 'text-amber-700 bg-amber-50 border-amber-100' 
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Revenue Analytics</h2>
          <p className="text-slate-500 text-sm">Track your earnings and subscription growth</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="h-4 w-4" /> Filter Date
          </button>
          <button onClick={exportReport} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white border ${s.border} rounded-2xl p-6 shadow-sm`}>
            <div className={`${s.bg} p-2.5 rounded-xl w-fit mb-4 border ${s.border}`}><s.icon className={`h-6 w-6 ${s.color}`} /></div>
            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Income Stream</h3>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Last 30 Days Activity</p>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {['day', 'week', 'month'].map(r => (
              <button 
                key={r} 
                onClick={() => setTimeRange(r)} 
                className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${timeRange === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-end gap-1.5 h-56 px-2">
          {revenueData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20 mb-2">
                Rs. {d.amount.toLocaleString()}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
              <div 
                className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 rounded-t-lg transition-all cursor-pointer shadow-sm" 
                style={{ height: `${(d.amount / maxRevenue) * 100}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6 px-1 border-t border-slate-50 pt-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Day 1</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Day 15</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Day 30</span>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-white flex justify-between items-center">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-400" /> Recent Transactions
          </h3>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Statement</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">User Details</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4 hidden sm:table-cell">Transaction ID</th>
                <th className="text-left p-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {transactions.length > 0 ? transactions.map((t, i) => (
                <tr key={t._id || i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-400 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-extrabold text-[10px] text-slate-500">
                        {t.userId?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-bold text-slate-900">{t.userId?.name || 'Unknown User'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-900 font-extrabold">Rs. {t.amount}</td>
                  <td className="p-4 text-slate-400 font-mono text-[10px] hidden sm:table-cell uppercase tracking-tighter">{t._id}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${statusStyles[t.status] || statusStyles.pending}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-medium bg-slate-50/30">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard className="h-8 w-8 text-slate-300" />
                      <span>No transactions found yet. Live billing data will appear here.</span>
                    </div>
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

export default Revenue;
