import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIInsightCard() {
  return (
    <div className="bg-gradient-to-br from-primary-lavender/10 to-soft-pink/10 rounded-[24px] border border-primary-lavender/20 p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-28 h-28 bg-primary-lavender/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-ai-accent rounded-lg shadow-glow">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-ai-accent uppercase tracking-widest">AI Insight</span>
        </div>
        <p className="text-sm font-medium text-gray-700 leading-relaxed">
          Based on the last <span className="font-bold text-deep-lavender">48 hours</span> of logs, <span className="font-bold text-deep-lavender">12%</span> of your patients are reporting increased fatigue. Consider sending a group wellness notification.
        </p>
        <button className="mt-4 w-full py-2.5 rounded-xl bg-ai-accent/10 text-ai-accent text-xs font-black uppercase tracking-widest hover:bg-ai-accent/20 transition-colors border border-ai-accent/10">
          Send Group Notification
        </button>
      </div>
    </div>
  );
}
