import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, BookOpen, X, Loader2 } from 'lucide-react';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import api from '../../api';

const CourseManager = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editModule, setEditModule] = useState(null);
  const [formData, setFormData] = useState({ title: '', slug: '', emoji: '📘', difficulty: 'Easy', description: '' });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/courses');
      setModules(res.data.map(m => ({ ...m, expanded: false })));
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSave = async () => {
    try {
      if (editModule) {
        await api.put(`/admin/courses/${editModule._id}`, formData);
      } else {
        await api.post('/admin/courses', formData);
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error('Failed to save course', err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this module?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error('Failed to delete course', err);
    }
  };

  const openModal = (mod = null) => {
    setEditModule(mod);
    if (mod) {
      setFormData({ title: mod.title || '', slug: mod.slug || '', emoji: mod.emoji || '📘', difficulty: mod.difficulty || 'Easy', description: mod.description || '' });
    } else {
      setFormData({ title: '', slug: '', emoji: '📘', difficulty: 'Easy', description: '' });
    }
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const toggleExpand = (id) => {
    setModules(modules.map(m => m._id === id ? { ...m, expanded: !m.expanded } : m));
  };

  const togglePublished = async (id, currentStatus) => {
    try {
      await api.put(`/admin/courses/${id}`, { published: !currentStatus });
      setModules(modules.map(m => m._id === id ? { ...m, published: !currentStatus } : m));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Course Manager</h2>
          <p className="text-slate-500 text-sm">Create and organize learning modules</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="h-5 w-5" /> Add Module
        </button>
      </div>

      {/* Modules Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-slate-600">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="text-left p-4 w-12"></th>
              <th className="text-left p-4">Module Name</th>
              <th className="text-left p-4 hidden md:table-cell">Slug</th>
              <th className="text-left p-4">Lessons</th>
              <th className="text-left p-4 hidden sm:table-cell">Difficulty</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {modules.map((mod) => (
              <React.Fragment key={mod._id}>
                <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => toggleExpand(mod._id)}>
                  <td className="p-4 text-center">
                    {mod.expanded ? <ChevronUp className="h-4 w-4 text-slate-400 mx-auto" /> : <ChevronDown className="h-4 w-4 text-slate-400 mx-auto" />}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl shadow-sm border border-slate-200">
                        {mod.emoji || '📘'}
                      </div>
                      <span className="font-bold text-slate-900">{mod.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-xs hidden md:table-cell">/{mod.slug}</td>
                  <td className="p-4 font-semibold text-slate-900">{mod.lessons?.length || 0}</td>
                  <td className="p-4 hidden sm:table-cell"><Badge variant={mod.difficulty}>{mod.difficulty}</Badge></td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => togglePublished(mod._id, mod.published)} 
                      className={`w-11 h-6 rounded-full transition-all flex items-center px-1 ${mod.published ? 'bg-emerald-500 shadow-inner' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${mod.published ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(mod)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(mod._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
                {mod.expanded && (
                  <tr key={`${mod._id}-lessons`}>
                    <td colSpan="7" className="bg-slate-50/30 px-8 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(mod.lessons || []).map((l, li) => (
                          <div key={li} className="flex items-center gap-3 text-sm text-slate-600 py-3 px-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
                            <span className="text-xs text-indigo-600 font-bold w-6">{String(li + 1).padStart(2, '0')}</span>
                            <BookOpen className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{l.title || `Lesson ${li + 1}`}</span>
                          </div>
                        ))}
                        <button className="flex items-center gap-2 text-sm text-indigo-600 font-bold py-3 px-4 border border-dashed border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
                          <Plus className="h-4 w-4" /> Add Lesson
                        </button>
                        {mod.lessons?.length === 0 && <p className="text-slate-400 text-sm italic col-span-full">No lessons yet.</p>}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Module Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full transition-colors"><X className="h-5 w-5" /></button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">{editModule ? 'Edit Module' : 'Create Module'}</h2>
              <p className="text-slate-500">Configure your learning module settings</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Module Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-')})} placeholder="e.g. HTML Basics" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Icon (Emoji)</label>
                  <input type="text" value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-2xl text-center focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty Level</label>
                  <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe what students will learn..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                  {editModule ? 'Save Changes' : 'Create Module'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
