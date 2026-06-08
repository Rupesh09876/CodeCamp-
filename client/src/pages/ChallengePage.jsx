import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, Play, CheckCircle2, XCircle, Zap } from 'lucide-react';
import CodeEditor from '../components/Editor/CodeEditor';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';

const ChallengePage = () => {
  const { id } = useParams();

  const [challenge] = useState({
    title: 'FizzBuzz',
    difficulty: 'Easy',
    xp: 35,
    description: 'Write a program that prints the numbers from 1 to 100. For multiples of 3, print "Fizz" instead. For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".',
    instructions: [
      'Create a function called fizzBuzz() that loops from 1 to 100.',
      'For numbers divisible by 3, output "Fizz".',
      'For numbers divisible by 5, output "Buzz".',
      'For numbers divisible by both 3 and 5, output "FizzBuzz".',
      'For all other numbers, output the number itself.',
    ],
    hints: [
      'Use the modulo operator (%) to check divisibility.',
      'Check for divisibility by both 3 AND 5 first before checking individually.',
      'Use console.log() to print each result.',
    ],
    testCases: [
      { name: 'Output at position 1 is "1"', passed: null },
      { name: 'Output at position 3 is "Fizz"', passed: null },
      { name: 'Output at position 5 is "Buzz"', passed: null },
      { name: 'Output at position 15 is "FizzBuzz"', passed: null },
      { name: 'Output at position 100 is "Buzz"', passed: null },
    ],
    starterCode: '// Write your FizzBuzz solution here\nfunction fizzBuzz() {\n  for (let i = 1; i <= 100; i++) {\n    // Your code here\n    console.log(i);\n  }\n}\n\nfizzBuzz();',
  });

  const [code, setCode] = useState(challenge.starterCode);
  const [testResults, setTestResults] = useState(challenge.testCases);
  const [showHints, setShowHints] = useState(false);
  const [output, setOutput] = useState('');
  const allPassed = testResults.every((t) => t.passed === true);

  const handleRun = () => {
    try {
      let result = [];
      const fakeLog = (...args) => result.push(args.join(' '));
      const fn = new Function('console', code);
      fn({ log: fakeLog, error: fakeLog });
      setOutput(result.join('\n'));
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  const handleRunTests = () => {
    handleRun();
    try {
      let result = [];
      const fakeLog = (...args) => result.push(args.join(' '));
      const fn = new Function('console', code);
      fn({ log: fakeLog, error: fakeLog });

      const updated = challenge.testCases.map((tc, idx) => {
        if (idx === 0) return { ...tc, passed: result[0] === '1' };
        if (idx === 1) return { ...tc, passed: result[2] === 'Fizz' };
        if (idx === 2) return { ...tc, passed: result[4] === 'Buzz' };
        if (idx === 3) return { ...tc, passed: result[14] === 'FizzBuzz' };
        if (idx === 4) return { ...tc, passed: result[99] === 'Buzz' };
        return tc;
      });
      setTestResults(updated);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  const handleSubmit = () => {
    alert('Challenge submitted! +' + challenge.xp + ' XP');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[var(--color-base)]">
      {/* Top Bar */}
      <div className="bg-[var(--color-card)] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/challenges" className="hover:text-white transition-colors">Challenges</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white font-semibold">{challenge.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={challenge.difficulty}>{challenge.difficulty}</Badge>
          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> {challenge.xp} XP</span>
        </div>
      </div>

      {/* Split Screen */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        {/* LEFT - Instructions */}
        <div className="w-full lg:w-[40%] border-r border-slate-800 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4">{challenge.title}</h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">{challenge.description}</p>

          <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-3">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300 mb-6">
            {challenge.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ol>

          {/* Hints accordion */}
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center justify-between w-full bg-slate-800 px-4 py-3 rounded-xl text-sm font-semibold mb-4 transition-colors hover:bg-slate-700"
          >
            <span>💡 Hints ({challenge.hints.length})</span>
            {showHints ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>
          {showHints && (
            <ul className="space-y-2 mb-6 pl-4">
              {challenge.hints.map((hint, i) => (
                <li key={i} className="text-sm text-amber-300/80 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">{i + 1}.</span> {hint}
                </li>
              ))}
            </ul>
          )}

          {/* Test Cases */}
          <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-3">Test Cases</h3>
          <div className="space-y-2">
            {testResults.map((tc, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                tc.passed === true ? 'bg-emerald-900/20 border-emerald-700/50' :
                tc.passed === false ? 'bg-red-900/20 border-red-700/50' :
                'bg-slate-800/50 border-slate-700'
              }`}>
                {tc.passed === true && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                {tc.passed === false && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                {tc.passed === null && <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0"></div>}
                <span className={tc.passed === false ? 'text-red-300' : 'text-slate-300'}>{tc.name}</span>
              </div>
            ))}
          </div>

          {allPassed && (
            <div className="mt-6">
              <Button variant="success" className="w-full" onClick={handleSubmit}>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Submit Solution (+{challenge.xp} XP)
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT - Editor */}
        <div className="w-full lg:w-[60%] flex flex-col overflow-hidden">
          {/* Tab */}
          <div className="bg-[var(--color-card)] border-b border-slate-800 p-2 flex justify-between items-center shrink-0">
            <div className="flex gap-0.5 bg-slate-900 p-0.5 rounded-lg">
              <span className="px-4 py-1.5 rounded-md text-xs font-semibold uppercase bg-slate-800 text-yellow-400 shadow-sm">JS</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleRun} className="flex items-center gap-1 px-3 py-1.5 rounded-md font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                <Play className="h-4 w-4" /> RUN
              </button>
              <button onClick={handleRunTests} className="flex items-center gap-1 px-3 py-1.5 rounded-md font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                RUN TESTS
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-grow min-h-[300px]">
            <CodeEditor language="javascript" value={code} onChange={setCode} />
          </div>

          {/* Output */}
          <div className="h-[200px] bg-[#1e1e1e] border-t border-slate-700 overflow-y-auto font-mono text-xs p-3 shrink-0">
            <div className="text-slate-500 border-b border-slate-700 pb-1 mb-1 text-xs">Output</div>
            {output ? (
              <pre className={`whitespace-pre-wrap ${output.startsWith('Error') ? 'text-red-400' : 'text-emerald-300'}`}>{output}</pre>
            ) : (
              <div className="text-slate-600 italic">Run your code to see output...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
