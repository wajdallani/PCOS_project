import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AdherenceCard() {
  const percentage = 92;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 flex flex-col items-center text-center h-full group hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 w-full text-left">Adherence</h3>
      
      <div className="relative w-32 h-32 mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-50"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="url(#lavenderGradientAdherence)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out drop-shadow-md"
          />
          <defs>
            <linearGradient id="lavenderGradientAdherence" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B5A1E5" />
              <stop offset="100%" stopColor="#7B5FA5" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 leading-none">{percentage}%</span>
          <span className="text-[10px] font-black text-primary-lavender uppercase tracking-widest mt-1">Monthly</span>
        </div>
      </div>

      <p className="text-sm font-medium text-gray-600 leading-relaxed mb-6">
        You're doing great! You've missed only <span className="text-red-400 font-bold">2</span> doses this month.
      </p>

      <div className="mt-auto w-full p-4 rounded-xl bg-primary-lavender/10 border border-primary-lavender/20 flex items-start gap-3">
         <div className="p-1.5 bg-white rounded-lg text-primary-lavender shadow-sm">
            <Sparkles size={14} />
         </div>
         <p className="text-xs font-bold text-deep-lavender text-left leading-relaxed">
            AI Insight: Optimal hormonal balance reached with current adherence.
         </p>
      </div>
    </div>
  );
}
