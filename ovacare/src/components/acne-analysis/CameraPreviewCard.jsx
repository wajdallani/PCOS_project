import React from 'react';
import { Camera, Sun, Sparkles, Loader2 } from 'lucide-react';

export default function CameraPreviewCard({ previewImage, isAnalyzing }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 group">
      {/* Shimmer Effect */}
      {!isAnalyzing && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
      )}

      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-primary-lavender/5 border-2 border-dashed border-primary-lavender/20 flex items-center justify-center">
        {/* Main Image Area */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Circular Face Guide (only if no image) */}
          {!previewImage && !isAnalyzing && (
            <div className="absolute w-[280px] h-[340px] border-4 border-dashed border-white/60 rounded-[120px] z-20 flex items-center justify-center animate-pulse-gentle">
               <span className="text-white/80 font-black uppercase tracking-widest text-[10px] mt-40">Position your face here</span>
            </div>
          )}
          
          {/* Subtle Glowing Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-lavender/20 to-transparent z-10 opacity-60"></div>
          
          {/* Preview or Placeholder */}
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Skin Preview" 
              className={`w-full h-full object-cover transition-all duration-700 ${isAnalyzing ? 'blur-[4px] scale-110' : ''}`}
            />
          ) : (
            <img 
              src="/avatars/avatar1.jpg" 
              alt="Face Guide" 
              className="w-full h-full object-cover opacity-40 grayscale blur-[2px]" 
            />
          )}

          {/* AI Scanning Lines (Animated) */}
          {!isAnalyzing && (
            <div className="absolute inset-x-0 h-0.5 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-30 animate-scan"></div>
          )}

          {/* Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-ai-accent/30 backdrop-blur-md animate-fade-in">
              <div className="relative">
                <Loader2 size={48} className="text-white animate-spin mb-4" />
                <div className="absolute inset-0 blur-xl bg-white/20 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-white font-heading font-bold text-lg tracking-wider uppercase">Analyzing Skin...</h3>
              <p className="text-white/80 text-[10px] font-bold mt-2 tracking-widest uppercase">Detecting Hormonal Patterns</p>
              
              {/* Progress Bar */}
              <div className="w-48 h-1 bg-white/20 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-white shadow-glow animate-progress"></div>
              </div>
            </div>
          )}
        </div>

        {/* Good Lighting Tag */}
        {!isAnalyzing && (
          <div className="absolute top-4 right-4 z-40">
            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white flex items-center gap-2">
              <Sun size={14} className="text-yellow-500 fill-yellow-500/20" />
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">Good Lighting</span>
            </div>
          </div>
        )}

        {/* AI Badge */}
        <div className="absolute top-4 left-4 z-40">
           <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-glow transition-colors duration-500 ${
             isAnalyzing ? 'bg-white text-ai-accent' : 'bg-ai-accent text-white'
           }`}>
              <Sparkles size={12} /> {isAnalyzing ? 'Processing' : 'AI Active'}
           </div>
        </div>
      </div>
    </div>
  );
}
