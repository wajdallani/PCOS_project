import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function WellnessScoreCard() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to 78
    const timeout = setTimeout(() => {
      setScore(78);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Calculate SVG stroke offset for the circle
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-soft flex flex-col sm:flex-row items-center gap-8 group hover:shadow-xl transition-all duration-500">
      {/* Progress Ring */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-primary-lavender/10 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-deep-lavender fill-none transition-all duration-[1500ms] ease-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-heading font-bold text-gray-900 leading-none">{score}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
          <h3 className="text-xl font-heading font-bold text-gray-900">Wellness Score</h3>
          <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full tracking-wider border border-green-100">
            Great Progress
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
          Your hormonal balance and sleep quality have improved by <span className="text-deep-lavender font-bold">12%</span> this week.
        </p>
        <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-deep-lavender font-medium text-xs">
          <div className="p-1.5 bg-primary-lavender/10 rounded-full">
            <TrendingUp size={14} />
          </div>
          Keep maintaining your bedtime routine!
        </div>
      </div>
    </div>
  );
}
