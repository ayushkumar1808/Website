import React, { useState, useRef, useEffect } from 'react';

function ConfigAICompiler() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'loading' | 'waiting' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState('Model');
  const [inputShape, setInputShape] = useState('1,3,32,32');
  const [optLevel, setOptLevel] = useState(0);
  const [jobId, setJobId] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [hlsCode, setHlsCode] = useState('');
  const [mlirCode, setMlirCode] = useState('');
  const [metadata, setMetadata] = useState('');
  const [error, setError] = useState('');
  const [waitSeconds, setWaitSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API URL - connects to your GCP backend
  const API_URL = 'http://34.147.66.35:8000/api';

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
    if (waitSeconds >= 60 && currentPage === 'loading') {
      setCurrentPage('waiting');
    }
  }, [waitSeconds, currentPage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.py')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a Python (.py) file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.py')) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a Python (.py) file');
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    setCurrentPage('loading');
    setError('');
    setHlsCode('');
    setMlirCode('');
    setMetadata('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model_name', modelName);
      formData.append('input_shape', inputShape);
      formData.append('opt_level', optLevel.toString());

      const res = await fetch(`${API_URL}/compile`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Compilation failed');
      }

      const data = await res.json();
      
      if (data.status === 'success') {
        setJobId(data.job_id);
        setDownloadUrl(data.download_url);
        
        setHlsCode('// HLS C++ code generated successfully\n// Download the package to view full code');
        setMlirCode('// MLIR intermediate representation generated\n// Download the package to view full code');
        setMetadata(JSON.stringify({
          model_name: modelName,
          input_shape: inputShape,
          opt_level: optLevel,
          job_id: data.job_id,
          status: 'compiled'
        }, null, 2));
        
        setCurrentPage('results');
      } else {
        throw new Error(data.error || data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to compile model. Please try again.');
      setCurrentPage('upload');
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const baseUrl = API_URL.replace('/api', '');
      window.location.href = `${baseUrl}${downloadUrl}`;
    }
  };

  const handleReset = () => {
    setCurrentPage('upload');
    setFile(null);
    setModelName('Model');
    setInputShape('1,3,32,32');
    setOptLevel(0);
    setJobId('');
    setDownloadUrl('');
    setHlsCode('');
    setMlirCode('');
    setMetadata('');
    setError('');
    setWaitSeconds(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload Page
  if (currentPage === 'upload') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                ConfigAI Compiler
              </h1>
              <p className="text-gray-400">Upload your PyTorch model and compile to FPGA HLS</p>
            </div>

            {/* File Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-400 transition-all hover:bg-white/5"
            >
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">
                {file ? file.name : 'Drag & Drop your PyTorch model'}
              </h3>
              <p className="text-gray-400">or click to browse (.py files only)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".py"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Configuration - Only 3 fields now */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model Class Name</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g., MyModel, VGG8"
                  className="w-full p-3 bg-black border border-white/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Input Shape</label>
                <input
                  type="text"
                  value={inputShape}
                  onChange={(e) => setInputShape(e.target.value)}
                  placeholder="e.g., 1,3,32,32"
                  className="w-full p-3 bg-black border border-white/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Optimization Level (0-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={optLevel}
                  onChange={(e) => setOptLevel(parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-black border border-white/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-center p-4 bg-red-400/10 border border-red-400/30 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!file}
                className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-full transition-all disabled:cursor-not-allowed text-lg"
              >
                🚀 Compile to HLS
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
            Compiling PyTorch → HLS...
          </h2>
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 text-lg">Converting your model to FPGA hardware</p>
            <p className="text-gray-500 text-sm">Elapsed: {waitSeconds}s</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div>⚙️ Loading PyTorch model...</div>
              <div>🔄 Converting to MLIR...</div>
              <div>⚡ Generating HLS code...</div>
            </div>
          </div>
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

  // Waiting Page
  if (currentPage === 'waiting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Still Compiling...
          </h2>
          <div className="flex justify-center">
            <div className="loader-wait"></div>
          </div>
          <p className="text-gray-400 text-lg">This is taking longer than usual</p>
          <p className="text-gray-500 text-sm">Elapsed: {waitSeconds}s</p>
          <p className="text-gray-500 text-xs">
            Large models may take 2-5 minutes to compile.<br />
            Please keep this window open.
          </p>
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
        <div className="text-center mb-12 pt-4">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 text-sm text-green-400 font-medium mb-4">
            <span>✓</span>
            <span>Compilation Complete</span>
          </div>
          <h1 className="text-3xl font-semibold mb-4 text-white">HLS Hardware Implementation</h1>
          
          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-white font-semibold rounded-full transition-all"
            >
              📥 Download HLS Package (.zip)
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full transition-all"
            >
              ← Upload New Model
            </button>
          </div>
          
          <p className="text-sm text-gray-400">Job ID: {jobId}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
          {/* HLS Code Panel */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl flex flex-col overflow-hidden relative">
            <div className="px-6 py-4 border-b border-white/10 relative">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-base">⚡</div>
                  <span className="text-lg font-semibold">HLS C++ Code</span>
                </div>
                <button 
                  className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                  onClick={() => navigator.clipboard.writeText(hlsCode)}
                  title="Copy HLS Code"
                >📋</button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/30 border border-white/10 border-l-4 border-l-cyan-400 rounded-lg p-6">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">{hlsCode || '// Download the package to view HLS code'}</pre>
              </div>
            </div>
          </div>

          {/* MLIR Panel */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl flex flex-col overflow-hidden relative">
            <div className="px-6 py-4 border-b border-white/10 relative">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-purple-500/20 text-purple-500 flex items-center justify-center text-base">🔄</div>
                  <span className="text-lg font-semibold">MLIR Code</span>
                </div>
                <button 
                  className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                  onClick={() => navigator.clipboard.writeText(mlirCode)}
                  title="Copy MLIR"
                >📋</button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/30 border border-white/10 border-l-4 border-l-purple-500 rounded-lg p-6">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">{mlirCode || '// Download the package to view MLIR'}</pre>
              </div>
            </div>
          </div>

          {/* Metadata Panel */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl flex flex-col overflow-hidden relative">
            <div className="px-6 py-4 border-b border-white/10 relative">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-600"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-orange-500/20 text-orange-500 flex items-center justify-center text-base">📊</div>
                  <span className="text-lg font-semibold">Compilation Info</span>
                </div>
                <button 
                  className="w-8 h-8 border border-white/20 bg-transparent rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                  onClick={() => navigator.clipboard.writeText(metadata)}
                  title="Copy Metadata"
                >📋</button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-black/50 border border-orange-500/30 border-l-4 border-l-orange-500 rounded-lg p-6">
                <pre className="text-sm leading-relaxed font-mono">{metadata || '// No metadata available'}</pre>
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

export default ConfigAICompiler;
