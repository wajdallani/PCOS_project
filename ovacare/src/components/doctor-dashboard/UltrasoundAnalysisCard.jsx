import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Sparkles, CheckCircle2, FileImage, Upload, Loader2, Info } from 'lucide-react';

export default function UltrasoundAnalysisCard({ 
  onUpload, 
  onSave, 
  leftResult, 
  rightResult, 
  isSegmenting,
  statusMessage 
}) {
  const [uploading, setUploading] = useState({ left: false, right: false });
  const [files, setFiles] = useState({ left: null, right: null });
  const [urls, setUrls] = useState({ left: null, right: null });
  const leftInputRef = useRef(null);
  const rightInputRef = useRef(null);

  const handleUpload = async (file, side) => {
    if (!file) return;
    setFiles(prev => ({ ...prev, [side]: file }));
    setUploading(prev => ({ ...prev, [side]: true }));
    try {
      const result = await onUpload(file);
      setUrls(prev => ({ ...prev, [side]: result.url }));
    } catch (err) {
      console.error(`Upload ${side} error:`, err);
    } finally {
      setUploading(prev => ({ ...prev, [side]: false }));
    }
  };

  const API_BASE_URL = "http://127.0.0.1:8000";
  function getImageUrl(url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  }

  const renderSide = (side, title) => {
    const isUploading = uploading[side];
    const url = urls[side];
    const result = side === 'left' ? leftResult : rightResult;
    const inputRef = side === 'left' ? leftInputRef : rightInputRef;

    return (
      <div className="flex flex-col gap-3">
        <div 
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-[22px] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-gray-50 h-48 overflow-hidden ${url ? 'border-primary-lavender/30 bg-primary-lavender/5 shadow-inner-soft' : 'border-gray-200'}`}
        >
          <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e.target.files[0], side)} />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-primary-lavender" size={28} />
              <p className="text-[10px] font-black text-primary-lavender uppercase tracking-widest">Uploading...</p>
            </div>
          ) : result?.overlay_url ? (
            <div className="relative w-full h-full group">
              <img src={getImageUrl(result.overlay_url)} className="w-full h-full object-cover rounded-xl" alt={`${title} Overlay`} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">AI Overlay</span>
              </div>
            </div>
          ) : url ? (
            <img src={url} className="w-full h-full object-cover rounded-xl shadow-sm" alt={title} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-3 group-hover:scale-110 transition-transform">
                <Camera size={24} />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</p>
              <p className="text-[8px] text-gray-400 mt-1">Click to upload scan</p>
            </div>
          )}
        </div>

        {result && (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Follicles</p>
              <p className="text-lg font-heading font-bold text-gray-900">{result.follicle_count}</p>
            </div>
            {result.mask_url && (
              <div className="bg-gray-50 rounded-xl p-1 border border-gray-100 overflow-hidden cursor-zoom-in group">
                <img src={getImageUrl(result.mask_url)} alt="Mask" className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-lavender/20 to-deep-lavender/10 rounded-2xl text-deep-lavender shadow-sm">
            <ImageIcon size={22} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-gray-900 leading-none">Ultrasound Analysis</h3>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">Follicle detection & ovarian mapping</p>
          </div>
        </div>
        
        {statusMessage && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-lavender/5 border border-primary-lavender/20 rounded-full animate-pulse-slow">
            <Loader2 size={14} className="animate-spin text-primary-lavender" />
            <span className="text-[10px] font-bold text-primary-lavender uppercase tracking-widest">{statusMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {renderSide('left', 'Left Ovary Scan')}
        {renderSide('right', 'Right Ovary Scan')}
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onSave(urls, files)}
          disabled={(!urls.left && !urls.right) || isSegmenting}
          className="w-full group relative flex items-center justify-center gap-3 py-5 rounded-[22px] bg-white border-2 border-primary-lavender/20 text-deep-lavender font-bold text-xs uppercase tracking-widest hover:border-primary-lavender/50 hover:bg-primary-lavender/5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {isSegmenting ? (
            <Loader2 className="animate-spin text-primary-lavender" size={20} />
          ) : (
            <Sparkles size={18} className="text-primary-lavender group-hover:rotate-12 transition-transform" />
          )}
          <span>{isSegmenting ? "Analyzing Scans..." : "Save & Segment Ultrasound"}</span>
          <div className="absolute inset-0 bg-primary-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        
        <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <Info size={16} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            AI segmentation will automatically count follicles and highlight clinical markers. Ensure scans are clear for maximum accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}

