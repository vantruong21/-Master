import React, { useState } from 'react';

const ImportModal = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setError('');
      onClose();
    }, 250);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonData(event.target.result);
        setError('');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.title || !parsed.cards || !Array.isArray(parsed.cards)) {
        setError('JSON must contain "title" and "cards" array.');
        return;
      }
      setError('');
      onImport(parsed);
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center modal-backdrop p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
      onClick={handleClose}
    >
      <div
        className={`bg-white border border-zen-accent w-full max-w-2xl shadow-2xl transition-all duration-300 ${isClosing ? 'opacity-0 scale-95' : 'animate-scale-in'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zen-accent flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-lg">📥</span>
            <h2 className="text-xs uppercase tracking-[0.3em] font-light text-zen-black">Import Study Set</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zen-gray transition-colors duration-200 text-zen-muted hover:text-zen-black"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Drag Zone */}
          <div
            className={`border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer ${dragActive
              ? 'border-zen-black bg-zen-gray scale-[1.01]'
              : 'border-zen-accent hover:border-zen-hover'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`transition-transform duration-300 ${dragActive ? 'scale-110' : ''}`}>
              <span className="text-3xl block mb-3 opacity-30">📄</span>
              <p className="text-xs font-light text-zen-muted">
                Drag and drop your <span className="text-zen-black font-medium">.json</span> file here
              </p>
              <p className="text-[10px] text-zen-accent mt-1">or paste JSON data below</p>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={jsonData}
              onChange={(e) => { setJsonData(e.target.value); setError(''); }}
              placeholder='{ "title": "N5 Kanji", "cards": [{ "prompt": "一", "answer": "ichi" }] }'
              className="w-full h-44 p-4 bg-zen-gray border border-zen-accent font-mono text-xs focus:outline-none focus:border-zen-black focus:bg-white transition-all duration-300 resize-none"
              spellCheck="false"
            />
            {jsonData && (
              <button
                onClick={() => setJsonData('')}
                className="absolute top-3 right-3 text-[9px] uppercase tracking-widest text-zen-muted hover:text-zen-black transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="animate-slide-down flex items-center space-x-2 p-3 bg-red-50 border border-red-100 text-red-400 text-xs font-light">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-[9px] text-zen-accent">
              {jsonData ? `${jsonData.length} characters` : 'Awaiting data...'}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!jsonData.trim()}
              className={`btn-magnetic px-10 py-3 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${jsonData.trim()
                ? 'bg-zen-black text-white hover:bg-gray-800 cursor-pointer'
                : 'bg-zen-gray text-zen-accent cursor-not-allowed'
                }`}
            >
              Initialize Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
