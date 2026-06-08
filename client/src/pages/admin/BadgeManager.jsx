import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Rocket, Code, CheckCircle, Award, Trophy, Star, Flame, Shield, Zap, BookOpen, Crown, Target, Heart, Loader2, Download } from 'lucide-react';
import api from '../../api';

const iconMap = {
  Rocket, Code, CheckCircle, Award, Trophy, Star, Flame, Shield, Zap, BookOpen, Crown, Target, Heart
};

const iconOptions = Object.keys(iconMap).map(name => ({ name, icon: iconMap[name] }));

const BadgeManager = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBadge, setEditBadge] = useState(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', icon: 'Rocket', color: '#6366F1', criteriaType: 'lessons_completed', criteriaTarget: 1
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const res = await api.get('/admin/badges');
      setBadges(res.data);
    } catch (err) {
      console.error('Failed to fetch badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this badge?')) return;
    try {
      await api.delete(`/admin/badges/${id}`);
      setBadges(badges.filter(b => b._id !== id));
    } catch (err) {
      alert('Failed to delete badge');
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        criteria: {
          type: formData.criteriaType,
          target: formData.criteriaTarget
        }
      };

      if (editBadge) {
        await api.put(`/admin/badges/${editBadge._id}`, payload);
      } else {
        await api.post('/admin/badges', payload);
      }
      setShowModal(false);
      fetchBadges();
    } catch (err) {
      console.error('Failed to save badge', err);
    }
  };

  const openModal = (badge = null) => {
    setEditBadge(badge);
    if (badge) {
      setFormData({
        name: badge.name || '',
        slug: badge.slug || '',
        description: badge.description || '',
        icon: badge.icon || 'Rocket',
        color: badge.color || '#6366F1',
        criteriaType: badge.criteria?.type || 'lessons_completed',
        criteriaTarget: badge.criteria?.target || 1
      });
    } else {
      setFormData({ name: '', slug: '', description: '', icon: 'Rocket', color: '#6366F1', criteriaType: 'lessons_completed', criteriaTarget: 1 });
    }
    setShowModal(true);
  };

  const exportCSV = () => {
    if (badges.length === 0) return;
    const headers = ['Name,Slug,Description,Icon,Color,Criteria Type,Criteria Target'];
    const csvData = badges.map(b => {
      return `"${b.name}","${b.slug}","${b.description}","${b.icon}","${b.color}","${b.criteria?.type}","${b.criteria?.target}"`;
    });
    
    const blob = new Blob([headers.concat(csvData).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `badges_export_${new Date().toLocaleDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const colors = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#EC4899', '#64748B'];
  const triggerTypes = ['lessons_completed', 'streak_days', 'challenges_solved', 'xp_earned'];

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
          <h2 className="text-2xl font-extrabold text-slate-900">Gamification</h2>
          <p className="text-slate-500 text-sm">Design and distribute achievement badges</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          >
            <Download className="h-5 w-5" /> Export CSV
          </button>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-100"
          >
            <Plus className="h-5 w-5" /> Create Badge
          </button>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, i) => {
          const Icon = iconMap[badge.icon] || Star;
          const color = badge.color || '#6366F1';
          return (
            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col items-center text-center hover:border-indigo-200 hover:shadow-lg transition-all group relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-50" style={{ backgroundColor: color + '15' }}>
                <Icon className="h-10 w-10" style={{ color: color }} />
              </div>
              <h3 className="font-extrabold text-slate-900 mb-1">{badge.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">{badge.description}</p>
              <div className="flex flex-col gap-2 w-full pt-2 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-1.5 rounded-lg">
                  {badge.criteria?.type?.replace('_', ' ')} ({badge.criteria?.target})
                </span>
              </div>
              
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(badge)} className="p-2 bg-white text-indigo-600 hover:text-indigo-800 rounded-full shadow-md border border-slate-100"><Edit className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(badge._id)} className="p-2 bg-white text-slate-400 hover:text-red-600 rounded-full shadow-md border border-slate-100"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Badge Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[2rem] w-full max-w-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full transition-colors"><X className="h-5 w-5" /></button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">Create Achievement</h2>
              <p className="text-slate-500">Configure visual style and award logic</p>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Badge Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-')})} placeholder="e.g. Master Coder" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Badge Slug</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="master-coder" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Public Description</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="How users see this achievement..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all" />
              </div>

              {/* Icon & Color Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Choose Icon</label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map(opt => {
                      const isSelected = formData.icon === opt.name;
                      return (
                        <button 
                          key={opt.name} 
                          onClick={() => setFormData({...formData, icon: opt.name})} 
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border ${isSelected ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:text-slate-900 border-slate-100'}`}
                        >
                          <opt.icon className="h-5 w-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Theme Color</label>
                  <div className="grid grid-cols-3 gap-3">
                    {colors.map(c => (
                      <button 
                        key={c} 
                        onClick={() => setFormData({...formData, color: c})} 
                        className={`w-full h-8 rounded-lg border-2 transition-all shadow-sm ${formData.color === c ? 'border-indigo-600 ring-2 ring-indigo-50 scale-105' : 'border-transparent'}`} 
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Logic */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Requirement Type</label>
                  <select value={formData.criteriaType} onChange={e => setFormData({...formData, criteriaType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer font-bold">
                    {triggerTypes.map(t => <option value={t} key={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Target Goal</label>
                  <input type="number" value={formData.criteriaTarget} onChange={e => setFormData({...formData, criteriaTarget: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-bold" />
                </div>
              </div>

              {/* Preview Card */}
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-3 shadow-xl bg-white border-4 border-white" style={{ backgroundColor: formData.color + '10' }}>
                  {(() => { const Icon = iconOptions.find(o => o.name === formData.icon)?.icon || Rocket; return <Icon className="h-12 w-12" style={{ color: formData.color }} />; })()}
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Live Preview</p>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                  Create Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeManager;
