import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AssistantInsightCard({ title, text }) {
  return (
    <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-soft relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-soft-pink/30 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-lavender/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ai-accent/10 mb-3">
          <Sparkles size={16} className="text-ai-accent" />
        </div>
        <h4 className="text-sm font-heading font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
