import React from 'react';
import { Lightbulb, Sparkles, Activity, ArrowRight } from 'lucide-react';

export function InsightCard() {
  return (
    <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft group hover:border-primary-lavender/30 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2.5 bg-primary-lavender/10 rounded-xl text-primary-lavender group-hover:scale-110 transition-transform">
          <Lightbulb size={20} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900">What this means</h3>
      </div>
      <p className="text-sm font-medium text-gray-600 leading-relaxed">
        The breakouts detected on your <span className="text-deep-lavender font-bold">chin and jawline</span> are strong indicators of androgen activity, common in PCOS cycles.
      </p>
    </div>
  );
}

export function TipsCard() {
  return (
    <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft group hover:border-soft-pink/30 transition-all">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2.5 bg-soft-pink/10 rounded-xl text-soft-pink group-hover:scale-110 transition-transform">
          <Sparkles size={20} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900">Personalized Tips</h3>
      </div>
      <ul className="space-y-4">
        {[
          "Use a gentle Salicylic cleanser twice daily.",
          "Increase spearmint tea intake to lower androgens.",
          "Ensure your pillowcase is changed regularly."
        ].map((tip, index) => (
          <li key={index} className="flex gap-3 items-start">
             <div className="mt-1 w-1.5 h-1.5 rounded-full bg-soft-pink flex-shrink-0" />
             <p className="text-sm font-medium text-gray-600">{tip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PCOSConnectionCard() {
  return (
    <div className="bg-gradient-to-br from-[#B5A1E5]/5 to-[#F4C3D4]/5 rounded-[28px] p-8 border border-primary-lavender/20 shadow-soft relative overflow-hidden group">
      {/* Decorative Blur */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-lavender/10 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-ai-accent text-white rounded-xl shadow-glow">
            <Activity size={18} />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900">How this connects to PCOS</h3>
        </div>
        <p className="text-sm font-medium text-gray-600 leading-relaxed mb-6">
          Elevated androgen levels can cause your skin’s oil glands to overproduce sebum. This specific pattern suggests your body is responding to the <span className="text-ai-accent font-bold">follicular phase</span> of your cycle.
        </p>
        <button className="text-xs font-black text-primary-lavender uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
          Learn more about Androgens <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
