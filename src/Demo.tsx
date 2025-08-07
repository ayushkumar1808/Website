import React, { useState } from 'react';

const mockVerilogCode = `// 4-bit Synchronous Counter
module counter_4bit (
    input clk,
    input rst,
    output reg [3:0] out
);

always @(posedge clk or posedge rst)
begin
    if (rst)
        out <= 4'b0000;
    else
        out <= out + 1;
end

endmodule`;

const mockTestbench = `// Testbench for 4-bit Counter
module testbench;
    reg clk = 0;
    reg rst = 1;
    wire [3:0] out;

    counter_4bit uut (
        .clk(clk),
        .rst(rst),
        .out(out)
    );

    always #5 clk = ~clk;

    initial begin
        $monitor("Time: %t | Output: %d", $time, out);
        
        #10 rst = 0;
        #200 $finish;
    end

endmodule`;

const mockSimulation = `Time: 0 | Output: x
Time: 10 | Output: 0
Time: 20 | Output: 1
Time: 30 | Output: 2
Time: 40 | Output: 3
Time: 50 | Output: 4
Time: 60 | Output: 5
Time: 70 | Output: 6
Time: 80 | Output: 7
Time: 90 | Output: 8
Time: 100 | Output: 9
Time: 110 | Output: 10
Time: 120 | Output: 11
Time: 130 | Output: 12
Time: 140 | Output: 13
Time: 150 | Output: 14
Time: 160 | Output: 15
Time: 170 | Output: 0
...`;

function Demo() {
  const [currentPage, setCurrentPage] = useState('prompt'); // Only 'prompt', 'loading', 'results'
  const [spec, setSpec] = useState('');

  const handleSubmit = () => {
    if (!spec.trim()) return;
    setCurrentPage('loading');
    
    // Simulate processing time
    setTimeout(() => {
      setCurrentPage('results');
    }, 3000);
  };

  const handleReset = () => {
    setCurrentPage('prompt');
    setSpec('');
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

  // Loading Page
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

  // Results Page - matching the HTML design exactly
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
          <h1 className="text-3xl font-semibold mb-2 text-white">4-bit Counter Implementation</h1>
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
                <button className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center">
                  📋
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/30 border border-white/10 border-l-4 border-l-cyan-400 rounded-lg p-6">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                  <span className="text-gray-500">// 4-bit Synchronous Counter</span>
                  {'\n'}<span className="text-pink-400">module</span> counter_4bit (
                  {'\n'}    <span className="text-pink-400">input</span> clk,
                  {'\n'}    <span className="text-pink-400">input</span> rst,
                  {'\n'}    <span className="text-pink-400">output</span> <span className="text-pink-400">reg</span> [3:0] out
                  {'\n'});
                  {'\n'}
                  {'\n'}<span className="text-pink-400">always</span> @(<span className="text-pink-400">posedge</span> clk <span className="text-pink-400">or</span> <span className="text-pink-400">posedge</span> rst)
                  {'\n'}<span className="text-pink-400">begin</span>
                  {'\n'}    <span className="text-pink-400">if</span> (rst)
                  {'\n'}        out {'<='} <span className="text-purple-400">4'b0000</span>;
                  {'\n'}    <span className="text-pink-400">else</span>
                  {'\n'}        out {'<='} out + <span className="text-purple-400">1</span>;
                  {'\n'}<span className="text-pink-400">end</span>
                  {'\n'}
                  {'\n'}<span className="text-pink-400">endmodule</span>
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
                <button className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center">
                  📋
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/30 border border-white/10 border-l-4 border-l-purple-500 rounded-lg p-6">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                  <span className="text-gray-500">// Testbench for 4-bit Counter</span>
                  {'\n'}<span className="text-pink-400">module</span> testbench;
                  {'\n'}    <span className="text-pink-400">reg</span> clk = <span className="text-purple-400">0</span>;
                  {'\n'}    <span className="text-pink-400">reg</span> rst = <span className="text-purple-400">1</span>;
                  {'\n'}    <span className="text-pink-400">wire</span> [3:0] out;
                  {'\n'}
                  {'\n'}    counter_4bit uut (
                  {'\n'}        .clk(clk),
                  {'\n'}        .rst(rst),
                  {'\n'}        .out(out)
                  {'\n'}    );
                  {'\n'}
                  {'\n'}    <span className="text-pink-400">always</span> #<span className="text-purple-400">5</span> clk = ~clk;
                  {'\n'}
                  {'\n'}    <span className="text-pink-400">initial</span> <span className="text-pink-400">begin</span>
                  {'\n'}        <span className="text-yellow-300">$monitor("Time: %t | Output: %d", $time, out);</span>
                  {'\n'}        
                  {'\n'}        #<span className="text-purple-400">10</span> rst = <span className="text-purple-400">0</span>;
                  {'\n'}        #<span className="text-purple-400">200</span> <span className="text-yellow-300">$finish;</span>
                  {'\n'}    <span className="text-pink-400">end</span>
                  {'\n'}
                  {'\n'}<span className="text-pink-400">endmodule</span>
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
                <button className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center">
                  📋
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/50 border border-orange-500/30 border-l-4 border-l-orange-500 rounded-lg p-6">
                <pre className="text-sm leading-relaxed font-mono">
                  {mockSimulation.split('\n').map((line, index) => {
                    if (line.includes('Time:')) {
                      const parts = line.split(' | ');
                      return (
                        <div key={index} className="py-1 border-b border-white/[0.03] last:border-b-0">
                          <span className="text-green-400">{parts[0]}</span>
                          {parts[1] && (
                            <>
                              <span className="text-white"> | Output: </span>
                              <span className="text-yellow-400">{parts[1].split(': ')[1]}</span>
                            </>
                          )}
                        </div>
                      );
                    }
                    return <div key={index} className="py-1">{line}</div>;
                  })}
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
