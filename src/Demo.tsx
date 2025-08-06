import React, { useState } from 'react';

const mockVerilogCode = `// Verilog Code
module counter (
  input clk,
  input rst,
  output reg [3:0] out
);
  always @(posedge clk or posedge rst) begin
    if (rst)
      out <= 0;
    else
      out <= out + 1;
  end
endmodule
`;

const mockTestbench = `// Testbench
module testbench;
  reg clk = 0;
  reg rst = 1;
  wire [3:0] out;

  counter uut (.clk(clk), .rst(rst), .out(out));

  always #5 clk = ~clk;

  initial begin
    $monitor("Time: %t | Output: %d", $time, out);
    #10 rst = 0;
    #100 $finish;
  end
endmodule
`;

const mockSimulation = `# Simulation Output
Time: 0 | Output: x
Time: 10 | Output: 0
Time: 20 | Output: 1
Time: 30 | Output: 2
Time: 40 | Output: 3
Time: 50 | Output: 4
...
`;

function Demo() {
  const [spec, setSpec] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl text-center space-y-6">
          <h1 className="text-3xl font-bold">Describe Your Hardware Spec</h1>
          <textarea
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            placeholder="e.g., A 4-bit counter with synchronous reset"
            required
            className="w-full h-40 p-4 text-white bg-black border border-white/30 rounded-lg resize-none focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold rounded-full transition-all"
          >
            Generate Verilog
          </button>
        </form>
      ) : (
        <div className="w-full max-w-7xl grid md:grid-cols-3 gap-8">
          <Card title="Verilog Code" content={mockVerilogCode} borderColor="border-cyan-500" />
          <Card title="Testbench" content={mockTestbench} borderColor="border-purple-500" />
          <Card title="Simulation Output" content={mockSimulation} borderColor="border-blue-500" />
        </div>
      )}
    </div>
  );
}

type CardProps = {
  title: string;
  content: string;
  borderColor: string;
};

const Card = ({ title, content, borderColor }: CardProps) => (
  <div
    className={`backdrop-blur-md bg-black/60 rounded-xl p-8 border-2 ${borderColor} shadow-lg transition-all hover:scale-[1.02]`}
    style={{ minHeight: '480px' }}
  >
    <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
    <pre className="whitespace-pre-wrap text-sm text-white/90 font-mono overflow-auto max-h-[380px]">
      {content}
    </pre>
  </div>
);

export default Demo;
