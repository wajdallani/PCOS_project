import React from 'react';

export default function RecommendationItem({ title, text, icon: Icon }) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-primary-lavender/10 rounded-2xl border border-primary-lavender/5 transition-all duration-300 hover:bg-primary-lavender/15 hover:border-primary-lavender/20 group">
      <div className="p-3 bg-white rounded-xl shadow-sm text-primary-lavender transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}
