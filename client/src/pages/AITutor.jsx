import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Sparkles, Code, FileText, Settings, Loader, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import api from '../api';

const AITutor = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const isPro = user?.plan === 'pro';

  const handleAsk = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.post('/ai/query', { query });
      setResponse(res.data.response);
    } catch (err) {
      setResponse(err.response?.data?.msg || 'Failed to get response from AI Tutor.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPro) {
    return (
      <div className="bg-[var(--color-base)] h-full text-[var(--color-text-primary)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center p-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Pro Feature Locked</h2>
          <p className="text-slate-500 mb-8 font-medium">
            The dedicated AI Tutor page is an exclusive feature for Premium subscribers. It provides a full-screen, distraction-free environment for complex code analysis and pair programming.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
            <p className="text-sm font-bold text-slate-700">You can still use the AI Tutor inside the Practice editor (up to 5 queries per day).</p>
          </div>
          <Link to="/pricing">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 shadow-lg shadow-purple-100">
              Upgrade to Pro <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-base)] h-full text-[var(--color-text-primary)] py-8 px-4 flex flex-col">
      <div className="max-w-6xl w-full mx-auto flex gap-6 flex-grow h-full">
        
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden hidden md:flex">
          <div className="p-6 bg-purple-600 text-white">
            <h2 className="font-extrabold text-xl flex items-center gap-2">
              <Bot className="w-6 h-6" /> AI Studio
            </h2>
            <p className="text-purple-200 text-xs mt-1 font-medium">Unlimited Access</p>
          </div>
          <div className="p-4 flex-grow">
            <div className="space-y-2">
              <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'chat' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Sparkles className="w-4 h-4" /> General Chat
              </button>
              <button onClick={() => setActiveTab('review')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'review' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Code className="w-4 h-4" /> Code Review
              </button>
              <button onClick={() => setActiveTab('explain')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'explain' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <FileText className="w-4 h-4" /> Explain Concept
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'settings' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Settings className="w-4 h-4" /> AI Settings
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-grow bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">CodeCamp Assistant</h2>
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online & Ready
              </p>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-6 bg-slate-50 flex flex-col gap-6">
            <div className="flex gap-4 max-w-3xl">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-purple-200">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-slate-700 font-medium leading-relaxed">
                Welcome back, {user?.name?.split(' ')[0]}! I'm your dedicated **Gemini-powered AI Studio**. 
                <br /><br />
                I have full context of the CodeCamp curriculum. You can paste snippets for a deep-dive review, ask for architectural advice, or even request custom challenges to test your skills. How can I assist your learning journey today?
              </div>
            </div>
            
            {response && (
              <div className="flex gap-4 max-w-4xl">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-purple-200">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-purple-200 shadow-sm text-slate-700 font-medium prose max-w-none">
                  {response}
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center gap-3 text-purple-600 font-bold ml-14">
                <Loader className="w-5 h-5 animate-spin" /> Generating response...
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-3 max-w-4xl mx-auto">
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your coding question here..."
                className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none font-medium"
                rows="2"
              />
              <Button 
                onClick={handleAsk}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-8 shadow-lg shadow-purple-100 h-auto"
              >
                Send
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AITutor;
