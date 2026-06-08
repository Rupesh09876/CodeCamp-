import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Copy, RefreshCw, CheckCircle, Terminal, Bot, X, Loader } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import api from '../api';
import axios from 'axios';

// Map specific languages to Piston API language names and versions
const PISTON_LANGUAGES = {
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  javascript: { language: 'javascript', version: '18.15.0' },
};

const Practice = () => {
  const { course, level } = useParams();
  const navigate = useNavigate();
  const { user, login, loadUserProfile } = useAuth(); // Need login to update context if we want to manually refresh user

  const currentLevel = parseInt(level) || 1;
  const maxLevels = 15;

  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]); // Array of strings for console output
  const [isExecuting, setIsExecuting] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const consoleEndRef = useRef(null);

  // Initialize progress and fetch YouTube video
  useEffect(() => {
    const initLesson = async () => {
      try {
        // 1. Init Progress (ensures it shows up in My Courses)
        await api.post('/progress/start', { slug: course });

        // 2. Fetch YouTube Video via backend proxy (avoids 403 from API key referrer restrictions)
        setYoutubeVideoId(null);
        setIsVideoLoading(true);
        try {
          const query = `${course} programming tutorial lesson ${currentLevel} for beginners`;
          const ytRes = await api.get(`/youtube/search?q=${encodeURIComponent(query)}`);
          if (ytRes.data.videoId) {
            setYoutubeVideoId(ytRes.data.videoId);
          }
        } catch (ytErr) {
          console.warn('Could not fetch YouTube video:', ytErr.message);
        }
      } catch (err) {
        console.error("Failed to init lesson or fetch video", err);
      } finally {
        setIsVideoLoading(false);
      }
    };
    initLesson();
  }, [course, currentLevel]);

  // Set default code based on course type
  useEffect(() => {
    let defaultCode = '';
    const c = course.toLowerCase();
    if (c === 'html' || c === 'css' || c === 'react') {
      defaultCode = `<!-- Level ${currentLevel} of ${course.toUpperCase()} -->\n<h1>Hello World</h1>\n<p>Start coding here...</p>`;
    } else if (c === 'javascript') {
      defaultCode = `// Level ${currentLevel} of JavaScript\nconsole.log("Hello from JavaScript!");\n`;
    } else if (c === 'python') {
      defaultCode = `# Level ${currentLevel} of Python\nprint("Hello from Python!")\n`;
    } else if (c === 'java') {
      defaultCode = `// Level ${currentLevel} of Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`;
    }
    setCode(defaultCode);
    setOutput([]);
  }, [course, currentLevel]);

  // Scroll console to bottom
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const appendOutput = (text, type = 'info') => {
    setOutput(prev => [...prev, { text, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    appendOutput('Code copied to clipboard.', 'success');
  };

  const handleReload = () => {
    // Just reset to default for now
    appendOutput('Editor reloaded.', 'info');
  };

  const handleRunCode = async () => {
    const c = course.toLowerCase();
    
    // For HTML/CSS/React (Frontend)
    if (c === 'html' || c === 'css' || c === 'react') {
      appendOutput('Executing web code in new window...', 'info');
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      return;
    }

    // For Backend Languages (Python, Java, pure JS) via Piston API
    const pistonLang = PISTON_LANGUAGES[c];
    if (!pistonLang) {
      appendOutput(`Language execution not supported for ${c}.`, 'error');
      return;
    }

    setIsExecuting(true);
    appendOutput(`Sending code to execution server...`, 'info');

    try {
      const response = await axios.post('https://emacs-engine.piston.rs/api/v2/execute', {
        language: pistonLang.language,
        version: pistonLang.version,
        files: [{ name: `main.${c === 'python' ? 'py' : c === 'java' ? 'java' : 'js'}`, content: code }]
      });

      if (response.data.run.stdout) {
        appendOutput(response.data.run.stdout, 'success');
        
        // As per user request, also open output in a new window
        const win = window.open('', '_blank');
        win.document.write(`<pre style="padding: 20px; background: #0f172a; color: #10b981; font-family: monospace; font-size: 16px; height: 100vh; margin: 0;">${response.data.run.stdout}</pre>`);
      }
      
      if (response.data.run.stderr) {
        appendOutput(response.data.run.stderr, 'error');
      }

      if (response.data.run.signal) {
        appendOutput(`Process terminated by signal: ${response.data.run.signal}`, 'error');
      }

    } catch (error) {
      appendOutput(`Execution failed: ${error.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      appendOutput('Marking level complete...', 'info');
      
      // Call backend to update real progress
      const res = await api.post('/progress/complete', { slug: course, level: currentLevel });
      
      // Force context update so UI catches the new XP/Level globally
      if (loadUserProfile) {
        await loadUserProfile();
      }
      
      const xpGained = res.data.xpGained || 0;
      appendOutput(`Level complete! +${xpGained} XP Earned.`, 'success');
      alert(`Level ${currentLevel} Complete! +${xpGained} XP Earned.`);
      
      if (currentLevel < maxLevels) {
        navigate(`/practice/${course}/${currentLevel + 1}`);
      } else {
        alert("Course Completed! You've reached the maximum level.");
        navigate('/my-courses');
      }
    } catch (err) {
      console.error('Error marking complete', err);
      appendOutput('Failed to save progress.', 'error');
    }
  };

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;

    if (user?.plan !== 'pro' && (user?.aiQueriesUsedToday || 0) >= 10) {
      alert("You have reached your daily limit of 10 AI queries. Upgrade to Pro for unlimited access.");
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/query', {
        query: aiQuery,
        context: code
      });

      setAiResponse(res.data.response);
    } catch (error) {
      console.error(error);
      setAiResponse(error.response?.data?.msg || 'AI is currently unavailable.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-[var(--color-base)] text-[var(--color-text-primary)] overflow-hidden">
      
      {/* LEFT PANEL: Video & Description */}
      <div className="w-1/2 flex flex-col border-r border-[var(--color-ui-border)] bg-[var(--color-card)] overflow-y-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-[var(--color-ui-border)] flex items-center justify-between sticky top-0 bg-[var(--color-card)] z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center p-1.5 border border-slate-100 shadow-sm">
              {course?.toLowerCase()?.includes('html') ? (
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" className="w-full h-full" alt="HTML5" />
              ) : course?.toLowerCase()?.includes('css') ? (
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" className="w-full h-full" alt="CSS3" />
              ) : (course?.toLowerCase()?.includes('javascript') || course?.toLowerCase()?.includes('js')) ? (
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" className="w-full h-full" alt="JavaScript" />
              ) : (course?.toLowerCase()?.includes('react')) ? (
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" className="w-full h-full" alt="React" />
              ) : (course?.toLowerCase()?.includes('node')) ? (
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" className="w-full h-full" alt="Node.js" />
              ) : (course?.toLowerCase()?.includes('next')) ? (
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" className="w-full h-full" alt="Next.js" />
              ) : (
                <span className="text-xl">💻</span>
              )}
            </div>
            <div>
              <h1 className="font-extrabold text-xl capitalize text-indigo-600 leading-tight">{course} Course</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level {currentLevel} of {maxLevels}</p>
            </div>
          </div>
          <Button 
            variant="success" 
            size="sm" 
            className="text-xs px-3 py-1.5"
            onClick={handleMarkComplete}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Mark Complete
          </Button>
        </div>

        {/* Video Placeholder or YouTube Iframe */}
        <div className="w-full aspect-video bg-slate-900 relative flex items-center justify-center border-b border-[var(--color-ui-border)] shadow-inner overflow-hidden">
          {isVideoLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Loading Lesson...</span>
            </div>
          ) : youtubeVideoId ? (
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`} 
              title={`${course} Lesson ${currentLevel}`} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
            <>
              <Play className="w-16 h-16 text-white opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-widest">
                12:45
              </div>
            </>
          )}
        </div>

        {/* Description */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Understanding the Basics</h2>
          <div className="prose prose-sm prose-slate max-w-none text-slate-600 font-medium">
            <p className="mb-4">
              Welcome to Level {currentLevel} of your {course} journey. In this module, we'll focus on foundational concepts.
            </p>
            <p className="mb-4">
              <strong>Your Task:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>Review the video material above.</li>
              <li>Write your implementation in the editor on the right.</li>
              <li>Click <strong>Run Code</strong> to test your solution.</li>
              <li>When satisfied, click <strong>Mark Complete</strong> to earn your XP.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Editor & Console */}
      <div className="w-1/2 flex flex-col h-full bg-slate-900 relative">
        
        {/* Editor Toolbar */}
        <div className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReload} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors" title="Reload">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors" title="Copy">
              <Copy className="w-4 h-4" />
            </button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-1.5 rounded-lg border-0"
              onClick={handleRunCode}
              disabled={isExecuting}
            >
              {isExecuting ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isExecuting ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="flex-grow p-4 overflow-hidden flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            className="w-full h-full bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none leading-relaxed"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Console Area */}
        <div className="h-48 border-t border-slate-800 bg-[#0f111a] flex flex-col flex-shrink-0">
          <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <Terminal className="w-4 h-4" /> Console Output
            </div>
            <button onClick={() => setOutput([])} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Clear</button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 font-mono text-sm">
            {output.length === 0 ? (
              <span className="text-slate-600 italic">No output yet. Run your code to see results here.</span>
            ) : (
              output.map((out, idx) => (
                <div key={idx} className={`mb-1 pb-1 border-b border-slate-800/50 flex gap-4 ${
                  out.type === 'error' ? 'text-red-400' : 
                  out.type === 'success' ? 'text-emerald-400' : 
                  'text-slate-300'
                }`}>
                  <span className="text-slate-600 text-[10px] w-16 flex-shrink-0 pt-1">{out.time}</span>
                  <span className="whitespace-pre-wrap">{out.text}</span>
                </div>
              ))
            )}
            <div ref={consoleEndRef} />
          </div>
        </div>

        {/* AI Tutor Toggle (Floating) */}
        <button 
          onClick={() => setShowAiModal(!showAiModal)}
          className="absolute bottom-56 right-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg shadow-purple-500/20 transition-all transform hover:scale-110 z-20 flex items-center gap-2 pr-4 font-bold"
        >
          <Bot className="w-5 h-5" /> Ask AI
        </button>

        {/* AI Tutor Panel */}
        {showAiModal && (
          <div className="absolute right-6 bottom-72 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[500px] z-30 animate-in slide-in-from-bottom-10">
            <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold">
                <Bot className="w-5 h-5" /> AI Code Tutor
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-purple-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-purple-50 border-b border-purple-100 flex justify-between items-center text-xs font-bold text-purple-800">
              <span>{user?.plan === 'pro' ? 'Unlimited Access' : 'Free Tier'}</span>
              <span>{user?.plan === 'pro' ? '∞' : `${5 - (user?.aiQueriesUsedToday || 0)} queries left`}</span>
            </div>

            <div className="flex-grow overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-slate-200 text-sm text-slate-700 shadow-sm max-w-[85%] leading-relaxed">
                Hi! I'm your **CodeCamp AI Tutor**. I see you're working on the <span className="text-indigo-600 font-bold capitalize">{course}</span> course. 
                <br /><br />
                I've analyzed your current code. I can help you debug errors, explain complex concepts, or suggest optimizations. What can I do for you right now?
              </div>
              
              {aiResponse && (
                <div className="bg-white p-3 rounded-xl rounded-tl-none border border-purple-200 text-sm text-slate-700 shadow-sm max-w-[90%] prose prose-sm">
                  {aiResponse}
                </div>
              )}
              {isAiLoading && (
                <div className="flex items-center gap-2 text-purple-600 text-sm font-bold animate-pulse">
                  <Loader className="w-4 h-4 animate-spin" /> Thinking...
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                  placeholder="Ask a question..."
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl"
                  onClick={handleAiAsk}
                  disabled={isAiLoading}
                >
                  Ask
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Practice;