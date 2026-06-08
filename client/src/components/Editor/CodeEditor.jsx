import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, value, onChange }) => {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', monospace",
        wordWrap: 'on',
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        formatOnPaste: true,
        renderLineHighlight: 'all',
        lineHeight: 22,
      }}
      loading={<div className="flex items-center justify-center h-full text-slate-500 text-sm">Loading Editor...</div>}
    />
  );
};

export default CodeEditor;
