import React, { useState, useRef, useEffect } from 'react';

function ConfigAICompiler() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'loading' | 'waiting' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState('Model');
  const [inputShape, setInputShape] = useState('1,3,32,32');
  const [optLevel, setOptLevel] = useState(0);
  const [jobId, setJobId] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [waitSeconds, setWaitSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Direct HTTPS connection to backend with nginx + Let's Encrypt SSL
  const API_URL = 'https://api.configai.co';

  useEffect(() => {
    if (currentPage === 'loading') {
      setWaitSeconds(0);
      timerRef.current = setInterval(() => setWaitSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentPage]);

  useEffect(() => {
    if (waitSeconds >= 60 && currentPage === 'loading') setCurrentPage('waiting');
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
        setCurrentPage('results');
      } else {
        throw new Error(data.error || data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to compile model');
      setCurrentPage('upload');
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // downloadUrl will be like "/api/download/abc123"
      window.location.href = downloadUrl;
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
    setError('');
    setWaitSeconds(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (currentPage === 'upload') {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ConfigAI Compiler
            </h1>
            <p className="text-gray-400">PyTorch → FPGA HLS</p>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-400 transition-all"
          >
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">
              {file ? file.name : 'Drag & Drop PyTorch Model'}
            </h3>
            <p className="text-gray-400">.py files only</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".py"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Model Class Name</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Model"
                className="w-full p-3 bg-black border border-white/30 rounded-lg focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Input Shape</label>
              <input
                type="text"
                value={inputShape}
                onChange={(e) => setInputShape(e.target.value)}
                placeholder="1,3,32,32"
                className="w-full p-3 bg-black border border-white/30 rounded-lg focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Opt Level (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                value={optLevel}
                onChange={(e) => setOptLevel(parseInt(e.target.value) || 0)}
                className="w-full p-3 bg-black border border-white/30 rounded-lg focus:border-cyan-400"
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
    );
  }

  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-cyan-400">Compiling...</h2>
          <div className="text-6xl">⚙️</div>
          <p className="text-gray-400">Elapsed: {waitSeconds}s</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'waiting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-orange-400">Still Compiling...</h2>
          <div className="text-6xl">⏳</div>
          <p className="text-gray-400">Elapsed: {waitSeconds}s</p>
          <p className="text-gray-500 text-sm">Large models may take 2-5 minutes</p>
          <button onClick={handleReset} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-400">Compilation Complete!</h1>
        <p className="text-gray-400">Job ID: {jobId}</p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-full"
          >
            📥 Download HLS Package
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-full"
          >
            ← New Compilation
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigAICompiler;
