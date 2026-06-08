import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle, Clock, ArrowRight, RotateCcw, AlertTriangle, Zap, Target } from 'lucide-react';
import Badge from '../components/UI/Badge';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import api from '../api';

const PracticeCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleResetProgress = async () => {
    setIsResetting(true);
    try {
      await api.delete('/progress/reset');
      alert('Your journey has been reset! XP and Levels are back to 1.');
      window.location.reload(); // Refresh to update UI state globally
    } catch (err) {
      console.error('Reset failed', err);
      alert('Failed to reset progress. Please try again.');
    } finally {
      setIsResetting(false);
      setShowResetConfirm(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--color-base)]">
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2 text-slate-900 tracking-tight">Practice Arena</h1>
            <p className="text-[var(--color-text-secondary)] text-lg">Choose a technology and start building your skills through interactive lessons.</p>
          </div>
          
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2 shrink-0"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw className="w-4 h-4" /> Reset My Journey
          </Button>
        </div>

        {/* Reset Confirmation Overlay */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="max-w-md w-full p-8 shadow-2xl border-0 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Reset All Progress?</h2>
              <p className="text-slate-500 text-center mb-8">
                This will permanently delete all your completed lessons, earned XP, and reset your level to 1. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setShowResetConfirm(false)} disabled={isResetting}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleResetProgress} disabled={isResetting}>
                  {isResetting ? 'Resetting...' : 'Yes, Reset Everything'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((mod) => (
              <Card 
                key={mod._id} 
                className="flex flex-col p-0 overflow-hidden border border-[var(--color-ui-border)] hover:border-indigo-400 transition-all hover:shadow-xl group bg-white rounded-3xl"
              >
                <div className="h-40 bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center border-b border-[var(--color-ui-border)] relative">
                  {mod.thumbnail ? (
                    <img src={mod.thumbnail} alt={mod.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 group-hover:scale-110 transition-transform duration-500">
                      {(mod.category === 'HTML' || mod.title?.toLowerCase()?.includes('html')) ? (
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" className="w-20 h-20" alt="HTML5" />
                      ) : (mod.category === 'CSS' || mod.title?.toLowerCase()?.includes('css')) ? (
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" className="w-20 h-20" alt="CSS3" />
                      ) : (mod.category === 'JavaScript' || mod.category?.toLowerCase()?.includes('javascript') || mod.title?.toLowerCase()?.includes('javascript')) ? (
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" className="w-20 h-20" alt="JavaScript" />
                      ) : (mod.category === 'React' || mod.category?.toLowerCase()?.includes('react') || mod.title?.toLowerCase()?.includes('react')) ? (
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" className="w-20 h-20" alt="React" />
                      ) : (mod.category === 'Node' || mod.category?.toLowerCase()?.includes('node') || mod.title?.toLowerCase()?.includes('node')) ? (
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" className="w-20 h-20" alt="Node.js" />
                      ) : (mod.category?.toLowerCase()?.includes('next') || mod.title?.toLowerCase()?.includes('next')) ? (
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" className="w-20 h-20" alt="Next.js" />
                      ) : (
                        <span className="text-7xl">💻</span>
                      )}
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant={mod.level || 'Beginner'}>{mod.level || 'Beginner'}</Badge>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">{mod.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
                    {mod.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {mod.category || 'General'}
                    </span>
                    {mod.isPremium && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {mod.modules?.length || 0} modules
                    </div>
                    <Link to={`/practice/${(mod.category || 'html').toLowerCase()}/1`}>
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-6 group">
                        Start <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State / Bottom Info */}
        <div className="bg-indigo-600 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
           <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-300" /> Mastery Awaits
              </h2>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                Every line of code you write brings you closer to your goals. Complete lessons to earn XP, unlock achievements, and see your name on the global leaderboard.
              </p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black">100+</span>
                  <span className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Interactive Tasks</span>
                </div>
                <div className="w-px h-10 bg-indigo-500 mx-4 opacity-30"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black">6+</span>
                  <span className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Technologies</span>
                </div>
                <div className="w-px h-10 bg-indigo-500 mx-4 opacity-30"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black">AI</span>
                  <span className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Guided Learning</span>
                </div>
              </div>
           </div>
           <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
              <Target className="w-96 h-96" />
           </div>
        </div>

      </div>
    </div>
  );
};

export default PracticeCatalog;