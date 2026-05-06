import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export default function ScanHeroCard({ onScan }) {
  return (
    <div className="bg-gradient-to-r from-primary-lavender to-deep-lavender rounded-[28px] p-8 sm:p-10 text-white shadow-soft relative overflow-hidden group">
      {/* Decorative Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="flex flex-col items-start text-left">
          <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm mb-6">
            <Sparkles size={12} /> AI Nutrition
          </div>
          <h2 className="text-3xl font-heading font-bold mb-4 leading-tight">
            Understand your body's response
          </h2>
          <p className="text-sm font-medium text-white/90 leading-relaxed mb-8 max-w-md">
            Instant AI analysis of your meal's impact on your hormonal balance and glucose levels.
          </p>
          <button 
            onClick={onScan}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-deep-lavender font-bold uppercase tracking-widest text-sm shadow-md hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
          >
            <Camera size={18} /> Scan Your Meal
          </button>
        </div>

        <div className="hidden md:flex justify-end relative">
          <div className="w-56 h-56 rounded-full bg-white/10 blur-xl absolute right-4 top-4 animate-pulse"></div>
          {/* Placeholder for a high-quality 3D food image */}
          <div className="w-64 h-64 rounded-full bg-white/20 border-4 border-white/30 backdrop-blur-sm shadow-2xl relative animate-float overflow-hidden flex items-center justify-center p-2">
            <img 
              src="/avatars/avatar1.jpg" 
              alt="Food Preview" 
              className="w-full h-full object-cover rounded-full mix-blend-overlay opacity-60 grayscale blur-[1px]" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
