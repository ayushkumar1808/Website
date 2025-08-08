import React, { useState, useRef, useEffect } from 'react';

function Demo() {
  const [currentPage, setCurrentPage] = useState<'prompt' | 'loading' | 'waiting' | 'results'>('prompt');
  const [spec, setSpec] = useState('');
  const [verilog, setVerilog] = useState('');
  const [testbench, setTestbench] = useState('');
  const [simOutput, setSimOutput] = useState('');
  const [error, setError] = useState('');
  const [waitSeconds, setWaitSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle timer for long waits
  useEffect(() => {
    if (currentPage === 'loading') {
      setWaitSeconds(0);
      timerRef.current = setInterval(() => {
        setWaitSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPage]);

  useEffect(() => {
    if (waitSeconds >= 30 && currentPage === 'loading') {
      setCurrentPage('waiting');
    }
  }, [waitSeconds, currentPage]);

  const handleSubmit = async () => {
    if (!spec.trim()) return;
    setCurrentPage('loading');
    setError('');
    setVerilog('');
    setTestbench('');
    setSimOutput('');
    try {
      const res = await fetch('https://veridev-production.up.railway.app/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec }),
      });
      if (!res.ok) throw new Error('Failed to generate hardware.');
      const data = await res.json();
      setVerilog(data.rtl || '');
      setTestbench(data.testbench || '');
      setSimOutput(data.sim_output || '');
      setCurrentPage('results');
    } catch (err) {
      setError('Failed to generate hardware. Please try again.');
      setCurrentPage('prompt');
    }
  };

  const handleReset = () => {
    setCurrentPage('prompt');
    setSpec('');
    setVerilog('');
    setTestbench('');
    setSimOutput('');
    setError('');
    setWaitSeconds(0);
  };

  // Prompt Page
  if (currentPage === 'prompt') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-center mb-8">Enter Hardware Requirement</h1>

            <textarea
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              placeholder="e.g., A 4-bit counter with synchronous reset and enable signal"
              className="w-full h-40 p-4 text-white bg-black border border-white/30 rounded-lg resize-none focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 placeholder-gray-400"
            />

            {error && (
              <div className="text-red-400 text-center mb-4">{error}</div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!spec.trim()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-full transition-all disabled:cursor-not-allowed"
              >
                Generate Hardware
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
          }
        `}</style>
      </div>
    );
  }

  // Loading Page (first 30 seconds)
  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Generating Hardware Design...
          </h2>
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
          <p className="text-gray-400 text-lg">Transforming your idea into RTL</p>
          <p className="text-gray-500 text-sm">Elapsed: {waitSeconds}s</p>
          <p className="text-gray-500 text-xs">If this takes more than 30 seconds, please wait. Some requests may take up to 5 minutes.</p>
        </div>
        <style jsx>{`
          .loader {
            width: 20px;
            aspect-ratio: 1;
            border-radius: 50%;
            background: #000;
            box-shadow: 0 0 0 0 #0004;
            animation: l1 1s infinite;
          }
          @keyframes l1 {
            100% { box-shadow: 0 0 0 30px #0000; }
          }
        `}</style>
      </div>
    );
  }

  // Waiting Page (after 30 seconds)
  if (currentPage === 'waiting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Still Working...
          </h2>
          <div className="flex justify-center">
            <div className="loader-wait"></div>
          </div>
          <p className="text-gray-400 text-lg">This request is taking longer than usual.</p>
          <p className="text-gray-500 text-sm">Elapsed: {waitSeconds}s</p>
          <p className="text-gray-500 text-xs">Some hardware generations may take up to 5 minutes.<br />Please keep this window open.</p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Cancel and Start Over
          </button>
        </div>
        <style jsx>{`
          .loader-wait {
            width: 32px;
            aspect-ratio: 1;
            border-radius: 50%;
            border: 4px solid #f59e42;
            border-top: 4px solid #222;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Results Page
  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden">
      <div className="absolute inset-0 opacity-5 bg-grid-pattern pointer-events-none"></div>
      
      <div className="max-w-screen-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12 pt-4">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 text-sm text-green-400 font-medium mb-4">
            <span>✓</span>
            <span>Generation Complete</span>
          </div>
          <h1 className="text-3xl font-semibold mb-2 text-white">Hardware Implementation</h1>
          <button
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-white transition-colors underline"
          >
            ← Generate New Design
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          {/* Verilog Code Panel */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl flex flex-col overflow-hidden relative">
            <div className="px-6 py-4 border-b border-white/10 relative">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-base">
                    📝
                  </div>
                  <span className="text-lg font-semibold">Verilog Code</span>
                </div>
                <button className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                  onClick={() => {
                    navigator.clipboard.writeText(verilog);
                  }}
                  title="Copy Verilog"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/30 border border-white/10 border-l-4 border-l-cyan-400 rounded-lg p-6">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                  {verilog || '// No Verilog code generated.'}
                </pre>
              </div>
            </div>
          </div>

          {/* Testbench Panel */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl flex flex-col overflow-hidden relative">
            <div className="px-6 py-4 border-b border-white/10 relative">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-purple-500/20 text-purple-500 flex items-center justify-center text-base">
                    🧪
                  </div>
                  <span className="text-lg font-semibold">Testbench</span>
                </div>
                <button className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                  onClick={() => {
                    navigator.clipboard.writeText(testbench);
                  }}
                  title="Copy Testbench"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/30 border border-white/10 border-l-4 border-l-purple-500 rounded-lg p-6">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                  {testbench || '// No testbench generated.'}
                </pre>
              </div>
            </div>
          </div>

          {/* Simulation Output Panel */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl flex flex-col overflow-hidden relative">
            <div className="px-6 py-4 border-b border-white/10 relative">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-600"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-orange-500/20 text-orange-500 flex items-center justify-center text-base">
                    📊
                  </div>
                  <span className="text-lg font-semibold">Simulation Output</span>
                </div>
                <button className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                  onClick={() => {
                    navigator.clipboard.writeText(simOutput);
                  }}
                  title="Copy Output"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/50 border border-orange-500/30 border-l-4 border-l-orange-500 rounded-lg p-6">
                <pre className="text-sm leading-relaxed font-mono">
                  {simOutput
                    ? simOutput.split('\n').map((line, index) => (
                        <div key={index} className="py-1">{line}</div>
                      ))
                    : '// No simulation output.'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
            height: auto;
            gap: 1rem;
          }
          
          .bg-white\\/\\[0\\.02\\] {
            min-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}

export default Demo;