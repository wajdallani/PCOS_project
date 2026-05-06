import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function WeeklyTrendsCard() {
  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-gray-400" />
          <h3 className="text-sm font-heading font-bold text-gray-900">Weekly Trends</h3>
        </div>
        <button className="text-[10px] font-bold text-primary-lavender uppercase tracking-widest hover:text-deep-lavender transition-colors flex items-center gap-1 group">
          Full Report <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="flex-1 relative mb-4">
        {/* Minimal placeholder line chart */}
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B5A1E5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#B5A1E5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M 0,30 Q 15,25 30,35 T 60,20 T 100,10" 
            fill="none" 
            stroke="#B5A1E5" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <path 
            d="M 0,30 Q 15,25 30,35 T 60,20 T 100,10 L 100,40 L 0,40 Z" 
            fill="url(#trendGradient)" 
          />
          <circle cx="100" cy="10" r="2" fill="#7B5FA5" className="animate-pulse" />
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-[-10px] left-0 right-0 flex justify-between text-[8px] font-bold text-gray-300 uppercase">
          <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-50">
        <p className="text-xs font-medium text-gray-500">
          Emotional stability <span className="text-green-500 font-bold">improved 12%</span> from last week.
        </p>
      </div>
    </div>
  );
}
