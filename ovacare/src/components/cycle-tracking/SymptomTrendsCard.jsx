import React from 'react';
import { TrendingUp, Info } from 'lucide-react';

export default function SymptomTrendsCard() {
  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-soft">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-heading font-bold text-gray-900">Symptom Trends</h3>
        <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
          <TrendingUp size={18} />
        </div>
      </div>

      {/* Placeholder Chart */}
      <div className="relative h-40 w-full mb-6">
        <svg viewBox="0 0 400 100" className="w-full h-full">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B5A1E5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#B5A1E5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0,80 Q50,40 100,60 T200,20 T300,50 T400,30" 
            fill="none" 
            stroke="#B5A1E5" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <path 
            d="M0,80 Q50,40 100,60 T200,20 T300,50 T400,30 L400,100 L0,100 Z" 
            fill="url(#chartGradient)" 
          />
          {/* Animated Points */}
          <circle cx="100" cy="60" r="4" fill="white" stroke="#B5A1E5" strokeWidth="2" className="animate-pulse" />
          <circle cx="200" cy="20" r="4" fill="white" stroke="#B5A1E5" strokeWidth="2" />
          <circle cx="300" cy="50" r="4" fill="white" stroke="#B5A1E5" strokeWidth="2" />
        </svg>
      </div>

      <div className="p-4 bg-primary-lavender/5 rounded-2xl border border-primary-lavender/10 flex gap-3">
        <div className="mt-0.5 text-primary-lavender">
          <Info size={16} />
        </div>
        <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
          Your logging consistency has improved. We’ve detected a <span className="text-deep-lavender font-bold">correlation</span> between your sleep and morning fatigue.
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Health Metric</span>
          <span className="text-lg font-heading font-bold text-gray-900">Estrogen balance</span>
        </div>
        <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg border border-green-100">
          +12%
        </div>
      </div>
    </div>
  );
}
