import { useEffect, useState, useRef } from 'react';

const OutputPreview = ({ code, runTrigger }) => {
  const [srcDoc, setSrcDoc] = useState('');
  const [logs, setLogs] = useState([]);
  const iframeRef = useRef(null);

  useEffect(() => {
    // Clear logs on new run
    setLogs([]);
    
    // Inject custom console.log override into the user's code string directly
    const consoleOverride = `
      const originalConsoleLog = console.log;
      console.log = function(...args) {
        window.parent.postMessage({ type: 'console', method: 'log', data: args }, '*');
        originalConsoleLog.apply(console, args);
      };
      
      const originalConsoleError = console.error;
      console.error = function(...args) {
        window.parent.postMessage({ type: 'console', method: 'error', data: args }, '*');
        originalConsoleError.apply(console, args);
      };

      window.onerror = function(message, source, lineno, colno, error) {
        window.parent.postMessage({ type: 'console', method: 'error', data: [message] }, '*');
      };
    `;

    const htmlDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${code.css}</style>
          <script>${consoleOverride}</script>
        </head>
        <body>
          ${code.html}
          <script>
            try {
              ${code.js}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;
    setSrcDoc(htmlDocument);
  }, [runTrigger]);

  useEffect(() => {
    const handleMessage = (event) => {
      // Basic security check could go here
      if (event.data && event.data.type === 'console') {
        const { method, data } = event.data;
        const formattedData = data.map(d => typeof d === 'object' ? JSON.stringify(d) : String(d)).join(' ');
        setLogs(prev => [...prev, { method, msg: formattedData }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title="output"
        sandbox="allow-scripts"
        frameBorder="0"
        className="w-full flex-grow"
        style={{ minHeight: '60%' }}
      />
      <div className="h-1/3 bg-[#1e1e1e] border-t border-gray-700 overflow-y-auto font-mono text-sm p-2 flex flex-col">
        <div className="text-gray-400 border-b border-gray-700 pb-1 mb-1 text-xs">Console Output</div>
        {logs.map((log, i) => (
          <div key={i} className={`py-0.5 ${log.method === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
            {log.method === 'error' ? '✖ ' : '› '}{log.msg}
          </div>
        ))}
        {logs.length === 0 && <div className="text-gray-600 italic">No console output...</div>}
      </div>
    </div>
  );
};

export default OutputPreview;
