import React from 'react';
import { Eye, Map as MapIcon, ChevronRight } from 'lucide-react';

export default function GradCAMPreviewCard() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ai-accent/10 rounded-xl text-ai-accent">
            <Eye size={18} />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900">Grad-CAM Preview</h3>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ai-accent text-[10px] font-black text-white uppercase tracking-widest shadow-glow">
          <MapIcon size={12} /> AI Heatmap
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-900 mb-6 group">
        {/* Placeholder for Ultrasound with Heatmap */}
        <img 
          src="https://images.unsplash.com/photo-1579154235602-3c2c2aa9502a?q=80&w=1470&auto=format&fit=crop" 
          alt="Ultrasound Heatmap" 
          className="w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-lavender/30 via-transparent to-soft-pink/30 mix-blend-overlay"></div>
        
        {/* Detection label */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Detection Active</span>
          </div>
        </div>

        {/* Heatmap overlay markers (simulated) */}
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-soft-pink/40 blur-xl rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-primary-lavender/40 blur-2xl rounded-full"></div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Analysis Result</p>
          <p className="text-sm font-bold text-gray-900">Follicle count estimate: <span className="text-deep-lavender">14+</span></p>
        </div>
        <button className="text-[10px] font-black text-primary-lavender uppercase tracking-widest flex items-center gap-1 hover:text-deep-lavender transition-colors group">
          View Full Report <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
