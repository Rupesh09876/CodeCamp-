import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, AlertCircle, HelpCircle, Code } from 'lucide-react';

const AITutorPanel = ({ codeContext }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm CodeCamp's **Gemini AI Tutor**. I'm here to help you master the current lesson. If you're stuck on a bug or need a concept explained, just ask! I can also suggest fixes directly for your code." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customQuestion = null) => {
    const question = customQuestion || inputValue;
    if (!question.trim()) return;

    if (!customQuestion) setInputValue('');
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const context = `HTML:\n${codeContext.html}\n\nCSS:\n${codeContext.css}\n\nJS:\n${codeContext.js}`;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ context, query: question })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Daily AI limit reached. Upgrade to Pro for unlimited access.');
        }
        throw new Error('API response was not ok');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages([...newMessages, { role: 'ai', content: error.message || "I'm having trouble connecting right now. Try checking your console for errors." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApplyFix = (aiContent) => {
    // This is a naive implementation: it looks for code block markers
    const codeMatch = aiContent.match(/```([\s\S]*?)```/);
    if (codeMatch && codeMatch[1]) {
      const code = codeMatch[1].trim();
      // In a real app, you'd use a callback passed from LessonPage to update editor state
      alert("Apply Fix clicked! Code snippet:\n\n" + code.substring(0, 50) + "...\n\n(This would inject back into the editor)");
    }
  };

  const renderMessageContent = (content, role) => {
    if (role !== 'ai') return content;
    
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeSnippet = part.substring(3, part.length - 3).replace(/^[a-z]+\n/, '');
        return (
          <div key={index} className="my-3">
            <div className="bg-[#0d1117] text-gray-300 p-3 rounded-t-lg font-mono text-xs overflow-x-auto whitespace-pre">
              {codeSnippet}
            </div>
            <button 
              onClick={() => handleApplyFix(part)}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-xs font-bold py-1.5 rounded-b-lg flex items-center justify-center gap-1 transition-colors"
            >
              <Code className="h-3 w-3" /> Apply Fix
            </button>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap">{part}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-card-bg)]">
      <div className="p-2 bg-[var(--color-dark-bg)] border-b border-[var(--color-muted)] border-opacity-20 flex justify-between items-center overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0 mr-4">
          <Bot className="h-5 w-5 text-[var(--color-success)]" />
          <span className="font-bold text-sm">AI Tutor</span>
        </div>
        <div className="flex gap-2 text-xs whitespace-nowrap">
          <button onClick={() => handleSend("Explain this error")} className="bg-[var(--color-card-bg)] hover:bg-gray-700 px-2 py-1 rounded border border-gray-700 flex items-center gap-1 transition-colors text-[var(--color-error)]">
            <AlertCircle className="h-3 w-3" /> Explain Error
          </button>
          <button onClick={() => handleSend("Fix my code")} className="bg-[var(--color-card-bg)] hover:bg-gray-700 px-2 py-1 rounded border border-gray-700 flex items-center gap-1 transition-colors text-[var(--color-success)]">
            <Zap className="h-3 w-3" /> Fix My Code
          </button>
          <button onClick={() => handleSend("Give me a hint")} className="bg-[var(--color-card-bg)] hover:bg-gray-700 px-2 py-1 rounded border border-gray-700 flex items-center gap-1 transition-colors text-[var(--color-warning)]">
            <HelpCircle className="h-3 w-3" /> Give Hint
          </button>
          <button onClick={() => handleSend("Explain this concept")} className="bg-[var(--color-card-bg)] hover:bg-gray-700 px-2 py-1 rounded border border-gray-700 flex items-center gap-1 transition-colors text-[var(--color-accent)]">
            <Bot className="h-3 w-3" /> Explain Concept
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-success)] bg-opacity-20 text-[var(--color-success)]'}`}>
              {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5" />}
            </div>
            <div className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-[var(--color-primary)] text-white rounded-tr-none' : 'bg-[var(--color-card-bg)] border border-[var(--color-muted)] border-opacity-30 rounded-tl-none text-gray-200'}`}>
              {renderMessageContent(msg.content, msg.role)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-success)] bg-opacity-20 text-[var(--color-success)] flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-5" />
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-muted)] border-opacity-30 rounded-tl-none text-gray-200 text-sm">
              <div className="flex gap-1 items-center h-5 px-2">
                <div className="w-2 h-2 bg-[var(--color-muted)] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[var(--color-muted)] rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-[var(--color-muted)] rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-[var(--color-muted)] border-opacity-20 bg-[var(--color-dark-bg)]">
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI anything..." 
            className="w-full bg-[var(--color-card-bg)] border border-[var(--color-muted)] border-opacity-30 rounded-full py-2 pl-4 pr-12 text-sm focus:outline-none focus:border-[var(--color-primary)] text-white transition-colors"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-1.5 top-1.5 p-1 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutorPanel;
