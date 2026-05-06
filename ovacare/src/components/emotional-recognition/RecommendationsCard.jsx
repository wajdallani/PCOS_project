import React from 'react';
import { Headphones, Play } from 'lucide-react';

export default function RecommendationsCard() {
  const recommendations = [
    { title: "Morning Dew", category: "Ambient", duration: "12 min", color: "from-blue-100 to-blue-200" },
    { title: "Deep Forest", category: "Nature", duration: "45 min", color: "from-green-100 to-green-200" }
  ];

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 h-[300px] flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Headphones size={18} className="text-gray-400" />
        <h3 className="text-sm font-heading font-bold text-gray-900">Recommended for You</h3>
      </div>

      <div className="flex-1 space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rec.color} flex items-center justify-center text-white/80 group-hover:text-white group-hover:shadow-md transition-all`}>
              <Play size={16} fill="currentColor" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary-lavender transition-colors">{rec.title}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {rec.category} • {rec.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
