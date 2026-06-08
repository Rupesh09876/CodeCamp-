import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, CheckCircle, Crown, Code, Loader2 } from 'lucide-react';
import Badge from '../components/UI/Badge';
import api from '../api';

const Challenges = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = { solved: 8, available: 24, xpEarned: 400 };

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await api.get('/challenges');
        setChallenges(res.data);
      } catch (err) {
        console.error('Failed to fetch challenges:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const filters = ['All', 'Easy', 'Medium', 'Hard'];

  const filtered = challenges.filter((c) => {
    const matchesFilter = activeFilter === 'All' || c.difficulty === activeFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || (c.tags && c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--color-base)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Coding Challenges</h1>
          <p className="text-[var(--color-text-secondary)]">Test your skills with real coding problems.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--color-card)] border border-[var(--color-ui-border)] rounded-xl p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{stats.solved}</p>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-1 uppercase tracking-wider">Solved</p>
          </div>
          <div className="bg-[var(--color-card)] border border-[var(--color-ui-border)] rounded-xl p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">{stats.available}</p>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-1 uppercase tracking-wider">Available</p>
          </div>
          <div className="bg-[var(--color-card)] border border-[var(--color-ui-border)] rounded-xl p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-500">{stats.xpEarned}</p>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-1 uppercase tracking-wider">XP Earned</p>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-1 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-ui-border)]">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeFilter === f 
                    ? 'bg-white text-indigo-600 shadow-sm border border-[var(--color-ui-border)]' 
                    : 'text-[var(--color-text-secondary)] hover:text-indigo-500 hover:bg-white/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[var(--color-ui-border)] rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-[var(--color-text-primary)] transition-all placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Challenge Grid */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((challenge) => (
              <div
                key={challenge._id}
                className={`bg-[var(--color-card)] border rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  challenge.solved ? 'border-emerald-200 bg-emerald-50/10' : challenge.isPremium ? 'border-purple-200' : 'border-[var(--color-ui-border)]'
                } shadow-sm`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={challenge.difficulty}>{challenge.difficulty}</Badge>
                    {challenge.isPremium && (
                      <span className="flex items-center gap-1 text-purple-600 text-xs font-bold bg-purple-50 px-2 py-0.5 rounded-full">
                        <Crown className="h-3.5 w-3.5" /> PRO
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full">
                    <Zap className="h-3.5 w-3.5" /> {challenge.xpReward} XP
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">{challenge.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6 line-clamp-2 leading-relaxed">{challenge.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {challenge.tags && challenge.tags.map((tag) => (
                    <span key={tag} className="bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[var(--color-ui-border)]">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-ui-border)]/50">
                  {challenge.solved && (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                      <CheckCircle className="h-4 w-4" /> Solved
                    </span>
                  )}
                  {!challenge.solved && !challenge.isPremium && <span></span>}
                  {challenge.isPremium && !challenge.solved && (
                    <span className="text-xs text-[var(--color-text-muted)] font-medium italic">Pro only content</span>
                  )}

                  {challenge.isPremium && !challenge.solved ? (
                    <Link to="/pricing" className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all hover:bg-purple-700 shadow-md shadow-purple-200">
                      <Crown className="h-4 w-4" /> Unlock
                    </Link>
                  ) : (
                    <Link
                      to={`/challenges/${challenge._id}`}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-slate-200"
                    >
                      <Code className="h-4 w-4" /> {challenge.solved ? 'Review' : 'Start Challenge'}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;