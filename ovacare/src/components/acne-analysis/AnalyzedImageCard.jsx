import React from 'react';
import { Target, Sparkles } from 'lucide-react';

export default function AnalyzedImageCard({ image }) {
  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft overflow-hidden group">
      <div className="relative aspect-[4/3] w-full">
        {/* Main Image */}
        <img 
          src={image || "/avatars/avatar1.jpg"} 
          alt="Analyzed Face" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* AI Overlays */}
        <div className="absolute inset-0 bg-primary-lavender/5 pointer-events-none"></div>
        
        {/* Detected Areas (Subtle UI Highlighting) */}
        <div className="absolute top-[60%] left-[45%] w-12 h-12 rounded-full border-2 border-dashed border-white/60 bg-primary-lavender/20 backdrop-blur-[2px] animate-pulse-gentle"></div>
        <div className="absolute top-[70%] left-[30%] w-10 h-10 rounded-full border-2 border-dashed border-white/60 bg-primary-lavender/20 backdrop-blur-[2px] animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[65%] right-[25%] w-14 h-14 rounded-full border-2 border-dashed border-white/60 bg-primary-lavender/20 backdrop-blur-[2px] animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>

        {/* AI Label Badge */}
        <div className="absolute top-6 left-6 z-20">
          <div className="px-3 py-1.5 rounded-full bg-ai-accent/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-glow">
            <Target size={14} /> AI Detected Areas
          </div>
        </div>

        {/* Intelligent Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
      </div>
    </div>
  );
}
