import React from 'react';
import { Activity, Brain, Smile, Zap } from 'lucide-react';

export default function LastResultCard() {
  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-lavender/10 text-primary-lavender rounded-xl">
          <Activity size={20} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900">Last Analysis Result</h3>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-soft-pink/20 to-primary-lavender/20 flex items-center justify-center mb-4 shadow-inner border border-white">
          <Smile size={48} className="text-primary-lavender drop-shadow-sm" />
        </div>
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Detected Mood</span>
        <h4 className="text-3xl font-heading font-bold text-gray-900">Calm</h4>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center">
           <Brain size={18} className="text-gray-400 mb-2" />
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stress Level</span>
           <span className="text-lg font-bold text-gray-900 mt-1">Low</span>
        </div>
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center">
           <Zap size={18} className="text-yellow-500 mb-2" />
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence</span>
           <span className="text-lg font-bold text-gray-900 mt-1">85%</span>
        </div>
      </div>

      <div className="mt-auto p-5 rounded-2xl bg-primary-lavender/10 border border-primary-lavender/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <span className="text-[10px] font-black text-deep-lavender uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Sparkles size={12} /> AI Insight
          </span>
          <p className="text-sm font-medium text-gray-700 leading-relaxed">
            Your biomarkers suggest high emotional stability. A perfect time for focus-heavy tasks or light yoga to maintain this balance.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Sparkles } from 'lucide-react';
