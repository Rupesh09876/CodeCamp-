import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Bot, BookOpen, Zap, Trophy, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Soft background orbs */}
        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-indigo-100 rounded-full blur-[160px] opacity-60 -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-[140px] opacity-60 translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                🎓 Free Coding Bootcamp — Made in Nepal
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 mb-6">
                Learn to Code.<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }}>
                  For Free.
                </span>
              </h1>
              <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
                Watch bite-sized video lessons, write code live in your browser, and get instant help from your AI tutor — all in one place.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-opacity"
                  style={{ backgroundImage: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }}
                >
                  Start Learning Free
                </Link>
                <button className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-base hover:bg-slate-50 transition-colors shadow-sm">
                  <PlayCircle className="w-5 h-5 text-[#6C63FF]" />
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 50+ Lessons</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 100% Free</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> AI Powered</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Gamified XP</span>
              </div>
            </div>

            {/* Right — code window illustration */}
            <div className="relative group">
              <div className="absolute -inset-4 rounded-[2.5rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }} />
              <div className="relative bg-[#0d1117] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                {/* Titlebar */}
                <div className="bg-[#161b22] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">index.html</span>
                  <span className="w-12" />
                </div>
                {/* Code body */}
                <div className="p-6 font-mono text-sm leading-7 select-none">
                  <div><span className="text-slate-500">1 </span><span className="text-pink-400">&lt;!</span><span className="text-indigo-300">DOCTYPE html</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">2 </span><span className="text-pink-400">&lt;</span><span className="text-green-400">html</span> <span className="text-yellow-300">lang</span><span className="text-slate-300">=</span><span className="text-orange-300">"en"</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">3 </span><span className="text-slate-600">  </span><span className="text-pink-400">&lt;</span><span className="text-green-400">head</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">4 </span><span className="text-slate-600">    </span><span className="text-pink-400">&lt;</span><span className="text-green-400">title</span><span className="text-pink-400">&gt;</span><span className="text-slate-200">My CodeCamp App</span><span className="text-pink-400">&lt;/</span><span className="text-green-400">title</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">5 </span><span className="text-slate-600">  </span><span className="text-pink-400">&lt;/</span><span className="text-green-400">head</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">6 </span><span className="text-slate-600">  </span><span className="text-pink-400">&lt;</span><span className="text-green-400">body</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">7 </span><span className="text-slate-600">    </span><span className="text-pink-400">&lt;</span><span className="text-green-400">h1</span> <span className="text-yellow-300">class</span><span className="text-slate-300">=</span><span className="text-orange-300">"hero"</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">8 </span><span className="text-slate-600">      </span><span className="text-slate-100">Hello, CodeCamp! 🚀</span></div>
                  <div><span className="text-slate-500">9 </span><span className="text-slate-600">    </span><span className="text-pink-400">&lt;/</span><span className="text-green-400">h1</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">10</span><span className="text-slate-600">    </span><span className="text-pink-400">&lt;</span><span className="text-green-400">script</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">11</span><span className="text-slate-600">      </span><span className="text-indigo-300">console</span><span className="text-slate-300">.</span><span className="text-yellow-300">log</span><span className="text-slate-300">(</span><span className="text-orange-300">"Ready!"</span><span className="text-slate-300">);</span></div>
                  <div><span className="text-slate-500">12</span><span className="text-slate-600">    </span><span className="text-pink-400">&lt;/</span><span className="text-green-400">script</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">13</span><span className="text-slate-600">  </span><span className="text-pink-400">&lt;/</span><span className="text-green-400">body</span><span className="text-pink-400">&gt;</span></div>
                  <div><span className="text-slate-500">14</span><span className="text-pink-400">&lt;/</span><span className="text-green-400">html</span><span className="text-pink-400">&gt;</span></div>
                </div>
                {/* Floating AI badge */}
                <div className="absolute bottom-5 right-5 bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">AI Tutor</p>
                    <p className="text-xs text-emerald-600 font-semibold">Online</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TECH LOGOS ──────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Master Modern Web Development</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Follow our structured path from beginner to professional developer.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* HTML */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:-translate-y-2 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 48 48" className="w-9 h-9">
                  <path d="M8 4l4 40 12 3.5L36 44l4-40z" fill="#e44d26"/>
                  <path d="M24 8v32l10-2.8 3.2-29.2z" fill="#f16529"/>
                  <path d="M16 18h8v4h-4l.5 6H24v4h-7.5l-.8-9.5-.2-.5zm8 0h8.5l-.5 5H24v-5zm0 10h4l-.4 4-3.6 1v-5z" fill="#fff"/>
                  <path d="M24 18v4h4l-.5 5H24v5l3.6-1 .4-4 .8-9H24v0z" fill="#ebebeb"/>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">HTML5</h3>
              <p className="text-slate-500 text-sm mb-4">Structure & semantics of the web.</p>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">12 Lessons</span>
            </div>

            {/* CSS */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:-translate-y-2 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 48 48" className="w-9 h-9">
                  <path d="M8 4l4 40 12 3.5L36 44l4-40z" fill="#1572b6"/>
                  <path d="M24 8v32l10-2.8 3.2-29.2z" fill="#33a9dc"/>
                  <path d="M16 18h8v4h-4.5l.5 5H24v4H16.5l-.8-8.5-.2-.5zm8 0h8l-.5 5H24v-5zm0 9h4l-.4 4-3.6 1v-5z" fill="#fff"/>
                  <path d="M24 18v4h4l-.5 5H24v5l3.6-1 .4-4 .8-9H24z" fill="#ebebeb"/>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">CSS3</h3>
              <p className="text-slate-500 text-sm mb-4">Layouts, animations & responsiveness.</p>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">15 Lessons</span>
            </div>

            {/* JavaScript */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:-translate-y-2 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-extrabold text-slate-900 text-base">JS</div>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">JavaScript</h3>
              <p className="text-slate-500 text-sm mb-4">Logic, DOM & modern ES6+ features.</p>
              <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">20 Lessons</span>
            </div>

            {/* React */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:-translate-y-2 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-xl bg-cyan-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 48 48" className="w-9 h-9">
                  <circle cx="24" cy="24" r="4" fill="#61dafb"/>
                  <ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="#61dafb" strokeWidth="2"/>
                  <ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="#61dafb" strokeWidth="2" transform="rotate(60 24 24)"/>
                  <ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="#61dafb" strokeWidth="2" transform="rotate(120 24 24)"/>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">React.js</h3>
              <p className="text-slate-500 text-sm mb-4">Components, hooks & state management.</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">30 Lessons</span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Soon</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '15k+', label: 'Students', icon: <Users className="w-5 h-5 text-[#6C63FF]" /> },
              { num: '50+',  label: 'Courses',  icon: <BookOpen className="w-5 h-5 text-[#6C63FF]" /> },
              { num: '100k+',label: 'XP Earned',icon: <Zap className="w-5 h-5 text-[#6C63FF]" /> },
              { num: '4.9★', label: 'Rating',   icon: <Trophy className="w-5 h-5 text-[#6C63FF]" /> },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-extrabold text-slate-900 mb-1">{s.num}</div>
                <div className="text-sm text-slate-500 font-medium flex items-center justify-center gap-1.5">{s.icon}{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI TUTOR ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Chat mockup */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl blur-3xl opacity-20" style={{ backgroundImage: 'linear-gradient(135deg,#6C63FF,#00D4FF)' }} />
              <div className="relative bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(135deg,#6C63FF,#00D4FF)' }}>
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">CodeCamp Tutor</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> Online
                    </p>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-5">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">U</div>
                    <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-700 max-w-xs">
                      Why isn't my button turning red? I set <code className="text-[#6C63FF] font-mono">color: red</code> in CSS.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundImage: 'linear-gradient(135deg,#6C63FF,#00D4FF)' }}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-indigo-900 max-w-sm">
                      <strong>Got it!</strong> <code className="font-mono text-[#6C63FF]">color</code> changes text colour. To change a button's background use{' '}
                      <code className="font-mono text-[#6C63FF]">background-color: red</code> instead. 🎨
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                Your Personal{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#6C63FF,#00D4FF)' }}>
                  AI Coding Coach
                </span>
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Stuck on a bug? Your AI tutor understands your exact code, explains the issue in plain language, and guides you to the fix — just like a senior dev sitting beside you.
              </p>
              <ul className="space-y-4">
                {['Instant bug detection & explanation', 'Context-aware code suggestions', 'Real-time hints — not just answers', 'Free plan: 10 queries/day · Pro: Unlimited'].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700 font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────── */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative rounded-3xl overflow-hidden px-10 py-20" style={{ backgroundImage: 'linear-gradient(135deg,#0d1117 60%,#1a1f2e)' }}>
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-30" style={{ backgroundImage: 'linear-gradient(135deg,#6C63FF,#00D4FF)', transform: 'translate(30%,-30%)' }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700 rounded-full blur-3xl opacity-20" style={{ transform: 'translate(-30%,30%)' }} />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                Ready to build the<br />future of the web?
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
                Join thousands of students. No credit card required.
              </p>
              <Link
                to="/register"
                className="inline-block px-10 py-5 rounded-xl text-white font-bold text-lg shadow-2xl shadow-indigo-500/30 hover:opacity-90 transition-opacity"
                style={{ backgroundImage: 'linear-gradient(135deg,#6C63FF,#00D4FF)' }}
              >
                Start Your First Lesson Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
