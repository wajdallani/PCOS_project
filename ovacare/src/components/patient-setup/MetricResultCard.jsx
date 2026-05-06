import React from 'react';
import { Activity } from 'lucide-react';

export default function MetricResultCard({ title, value, category, unit }) {
  return (
    <div className="bg-primary-lavender/10 border border-primary-lavender/30 rounded-2xl p-5 mb-4 shadow-sm relative overflow-hidden">
      <div className="absolute top-[-10px] right-[-10px] text-primary-lavender/20">
        <Activity size={80} />
      </div>
      
      <div className="relative z-10">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">{title}</h4>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-heading font-bold text-ai-accent leading-none">
            {value || '--'}
          </span>
          {unit && value && (
            <span className="text-sm font-medium text-gray-500 mb-0.5">{unit}</span>
          )}
        </div>
        {category && value && (
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-deep-lavender border border-primary-lavender/40 shadow-sm">
            {category}
          </div>
        )}
      </div>
    </div>
  );
}
