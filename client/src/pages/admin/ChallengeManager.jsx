import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Crown, Zap, Save, Loader2 } from 'lucide-react';
import Badge from '../../components/UI/Badge';
import api from '../../api';

const ChallengeManager = () => {
  const [showSlideOver, setShowSlideOver] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editChallenge, setEditChallenge] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', module: 'HTML', difficulty: 'Easy', 
    xp: 50, proOnly: false, starterCode: '', published: false
  });

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/challenges');
      setChallenges(res.data);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSave = async () => {
    try {
      if (editChallenge) {
        await api.put(`/admin/challenges/${editChallenge._id}`, formData);
      } else {
        await api.post('/admin/challenges', formData);
      }
      setShowSlideOver(false);
      fetchChallenges();
    } catch (err) {
      console.error('Failed to save challenge', err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this challenge?')) return;
    try {
      await api.delete(`/admin/challenges/${id}`);
      fetchChallenges();
    } catch (err) {
      console.error('Failed to delete challenge', err);
    }
  };

  const openSlideOver = (challenge = null) => {
    setEditChallenge(challenge);
    if (challenge) {
      setFormData({
        title: challenge.title || '',
        description: challenge.description || '',
        module: challenge.module || 'HTML',
        difficulty: challenge.difficulty || 'Easy',
        xp: challenge.xp || 50,
        proOnly: challenge.proOnly || false,
        starterCode: challenge.starterCode || '',
        published: challenge.published || false
      });
    } else {
      setFormData({ title: '', description: '', module: 'HTML', difficulty: 'Easy', xp: 50, proOnly: false, starterCode: '', published: false });
    }
    setShowSlideOver(true);
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
          <h2 className="text-2xl font-extrabold text-slate-900">Challenge Manager</h2>
          <p className="text-slate-500 text-sm">Manage hands-on coding exercises</p>
        </div>
        <button 
          onClick={() => openSlideOver()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="h-5 w-5" /> Add Challenge
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4 hidden sm:table-cell">Module</th>
                <th className="text-left p-4">Difficulty</th>
                <th className="text-left p-4">XP Reward</th>
                <th className="text-left p-4">Pro Only</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {challenges.map((c) => (
                <tr key={c._id} className={`hover:bg-slate-50/50 transition-colors ${c.proOnly ? 'bg-purple-50/30' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${c.proOnly ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.title}</span>
                        {c.proOnly && <Crown className="h-3.5 w-3.5 text-purple-500" />}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 font-medium hidden sm:table-cell">{c.module}</td>
                  <td className="p-4"><Badge variant={c.difficulty}>{c.difficulty}</Badge></td>
                  <td className="p-4 font-bold text-slate-900">{c.xp} XP</td>
                  <td className="p-4">
                    <div className={`w-11 h-6 rounded-full transition-all flex items-center px-1 ${c.proOnly ? 'bg-purple-500 shadow-inner' : 'bg-slate-200'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${c.proOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${c.published ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                      {c.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openSlideOver(c)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(c._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Panel */}
      {showSlideOver && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex justify-end" onClick={() => setShowSlideOver(false)}>
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-8 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Add Challenge</h2>
                <p className="text-slate-500 text-sm">Create a new interactive coding challenge</p>
              </div>
              <button onClick={() => setShowSlideOver(false)} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full transition-colors"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Challenge Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. FizzBuzz Algorithms" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Explain the challenge objectives..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Module</label>
                    <select value={formData.module} onChange={e => setFormData({...formData, module: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                      <option>HTML</option><option>CSS</option><option>JavaScript</option><option>React</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty</label>
                    <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">XP Reward</label>
                    <input type="number" value={formData.xp} onChange={e => setFormData({...formData, xp: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer group pb-2" onClick={() => setFormData({...formData, proOnly: !formData.proOnly})}>
                      <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${formData.proOnly ? 'bg-purple-500' : 'bg-slate-200'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.proOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Pro Only</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer group pb-2" onClick={() => setFormData({...formData, published: !formData.published})}>
                      <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${formData.published ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.published ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Published</span>
                    </label>
                  </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Starter Code (JavaScript)</label>
                  <div className="bg-slate-900 rounded-xl p-4 shadow-inner">
                    <textarea rows="8" value={formData.starterCode} onChange={e => setFormData({...formData, starterCode: e.target.value})} placeholder="// Write your starter code here..." className="w-full bg-transparent text-indigo-300 font-mono text-sm focus:outline-none resize-none border-none p-0" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
              <button 
                onClick={() => setShowSlideOver(false)}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-6 py-4 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" /> Save Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeManager;
