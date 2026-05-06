import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ReviewCard({ title, data, fields }) {
  return (
    <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 mb-6">
      <h4 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
        {fields.map(({ key, label }) => {
          const value = data[key];
          // Determine if this is a highlight field
          const isHighlight = key === 'bmi' || key === 'waist_hip_ratio';
          
          return (
            <div key={key} className={isHighlight ? "sm:col-span-2 bg-white p-3 rounded-xl border border-primary-lavender/30 shadow-sm" : ""}>
              <span className="block text-xs font-medium text-gray-500 mb-1">
                {label}
              </span>
              <span className={`block text-sm ${isHighlight ? 'text-ai-accent font-bold text-lg' : 'text-gray-800'}`}>
                {value ? (key === 'password' ? '••••••••' : value) : <span className="text-gray-400 italic">Not provided</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
