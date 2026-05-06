import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

const factors = [
  { label: 'LH/FSH Ratio', status: 'High', value: '2.9:1', pct: 85, color: 'bg-primary-lavender' },
  { label: 'Hyperandrogenism', status: 'Elevated', value: 'Testo 75', pct: 72, color: 'bg-soft-pink' },
  { label: 'Insulin Resistance', status: 'Moderate', value: 'HOMA-IR 3.2', pct: 45, color: 'bg-orange-400' },
];

export default function InfluencingFactorsCard() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-deep-lavender/10 rounded-xl text-deep-lavender">
          <Activity size={18} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900">Key Influencing Factors</h3>
      </div>

      <div className="space-y-6 mb-8">
        {factors.map((factor) => (
          <div key={factor.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{factor.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-900">{factor.value}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  factor.status === 'High' || factor.status === 'Elevated' ? 'text-red-500' : 'text-orange-500'
                }`}>
                  {factor.status}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${factor.color}`}
                style={{ width: `${factor.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary-lavender/5 rounded-2xl border border-primary-lavender/10 p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 text-primary-lavender/20 group-hover:text-primary-lavender/40 transition-colors">
          <Sparkles size={24} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-lg bg-ai-accent flex items-center justify-center">
            <Sparkles size={10} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-ai-accent uppercase tracking-widest">AI Insight</span>
        </div>
        <p className="text-xs font-medium text-gray-600 leading-relaxed relative z-10">
          The <span className="font-bold text-deep-lavender">LH/FSH ratio</span> is the primary driver of this score. Consider glucose tolerance testing to refine insulin impact.
        </p>
      </div>
    </div>
  );
}
