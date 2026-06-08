import { useState } from 'react';
import { Settings, Cpu, CreditCard, AlertTriangle, Save, RefreshCcw, Trash2, Globe, ShieldCheck } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'ai', label: 'AI Configuration', icon: Cpu },
    { id: 'payment', label: 'Payment Integration', icon: CreditCard },
    { id: 'danger', label: 'Security & Maintenance', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="flex sm:flex-col gap-1.5 sm:w-64 shrink-0 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          {activeTab === 'general' && (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                  <Globe className="h-6 w-6 text-indigo-500" /> General Settings
                </h2>
                <p className="text-slate-500 text-sm mt-1">Configure your platform's core identity and visibility</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name</label>
                    <input type="text" defaultValue="CodeCamp" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Platform Tagline</label>
                    <input type="text" defaultValue="Learn to Code. For Free." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Maintenance Mode</p>
                    <p className="text-xs text-slate-500">Only administrators can access the site when enabled</p>
                  </div>
                  <button className="w-12 h-7 rounded-full bg-slate-200 flex items-center px-1 transition-colors hover:bg-slate-300">
                    <div className="w-5 h-5 rounded-full bg-white shadow-sm"></div>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Announcement Banner (Global)</label>
                  <textarea rows="2" defaultValue="Welcome to the new CodeCamp! Explore our new interactive challenges." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                </div>
              </div>
              
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                <Save className="h-5 w-5" /> Save General Configuration
              </button>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                  <Cpu className="h-6 w-6 text-purple-500" /> AI Configuration
                </h2>
                <p className="text-slate-500 text-sm mt-1">Manage Gemini and LLM parameters for the AI Tutor</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Daily Free Queries</label>
                    <input type="number" defaultValue={10} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Active LLM Model</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                      <option>gemini-1.5-pro</option>
                      <option>gemini-1.5-flash</option>
                      <option>gpt-4o</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">AI Tutor Persona (System Prompt)</label>
                  <div className="bg-slate-900 rounded-2xl p-5 shadow-inner">
                    <textarea rows="6" className="w-full bg-transparent text-indigo-300 font-mono text-sm focus:outline-none resize-none border-none p-0" defaultValue="You are a helpful coding tutor for CodeCamp. Be concise, encouraging, and provide code examples when relevant. Always explain 'why' instead of just giving the answer." />
                  </div>
                </div>

                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-purple-900">Unlimited for Pro Users</p>
                    <p className="text-xs text-purple-600/70">Allow users with active subscriptions to bypass daily AI limits</p>
                  </div>
                  <button className="w-12 h-7 rounded-full bg-purple-500 flex items-center px-1 shadow-inner shadow-purple-600/20">
                    <div className="w-5 h-5 rounded-full bg-white shadow-sm translate-x-5"></div>
                  </button>
                </div>
              </div>

              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-100 flex items-center gap-2">
                <RefreshCcw className="h-5 w-5" /> Update AI Model Settings
              </button>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-emerald-500" /> Payment Integration
                </h2>
                <p className="text-slate-500 text-sm mt-1">Configure Khalti payment gateway credentials</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-extrabold text-amber-800">Critical Security Note</p>
                  <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed">Changes to these keys will affect live production payments. Ensure you are using the correct Sandbox or Live keys from your Khalti merchant dashboard.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Khalti Secret Key</label>
                  <input type="password" value="live_secret_key_********************" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-mono" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pro Monthly Subscription (NPR)</label>
                    <input type="number" defaultValue={999} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Operation Mode</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                      <option>Sandbox (Testing)</option>
                      <option>Live (Production)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
                <Save className="h-5 w-5" /> Save Billing Config
              </button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="bg-white border border-red-100 rounded-3xl p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-extrabold text-red-600 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-red-600" /> Security & Maintenance
                </h2>
                <p className="text-slate-500 text-sm mt-1">High-impact actions that modify global database state</p>
              </div>

              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl mb-8">
                <p className="text-sm font-bold text-red-800">Caution: Irreversible Actions</p>
                <p className="text-xs text-red-600 font-medium mt-1">The actions below cannot be undone. Please ensure you have a database backup before proceeding.</p>
              </div>
              
              <div className="divide-y divide-slate-100">
                <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0">
                  <div>
                    <p className="font-extrabold text-slate-900">Reset User Progress</p>
                    <p className="text-xs text-slate-500 mt-1">Wipes all lesson completions, XP, and streaks for every user account</p>
                  </div>
                  <button className="px-6 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all text-sm flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4" /> Reset All Data
                  </button>
                </div>

                <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 last:pb-0">
                  <div>
                    <p className="font-extrabold text-slate-900">Purge Inactive Accounts</p>
                    <p className="text-xs text-slate-500 mt-1">Permanently delete users who haven't logged in for over 180 days</p>
                  </div>
                  <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-sm shadow-lg shadow-red-100 flex items-center gap-2 border border-red-700">
                    <Trash2 className="h-4 w-4" /> Purge Database
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
