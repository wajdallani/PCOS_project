import React from 'react';

export default function SkinConditionCard({ severity = 30, label = "Mild Acne" }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (severity / 100) * circumference;

  const getDescription = () => {
    switch(label) {
      case 'CLEAR_SKIN': return "Your skin appears clear. Maintaining your current PCOS wellness routine is helping keep metabolic triggers in check.";
      case 'MILD_ACNE': return "Mild breakouts detected. Often linked to minor hormonal fluctuations or dietary shifts.";
      case 'MODERATE_ACNE': return "Moderate acne detected, often linked to hormonal fluctuations and PCOS metabolic management.";
      case 'SEVERE_ACNE': return "Severe acne detected. Significant hormonal imbalance may be present. Consider medical follow-up.";
      default: return "Your skin shows minor breakouts, often linked to hormonal fluctuations and PCOS metabolic management.";
    }
  };

  const displayLabel = label.replace('_', ' ');

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-8 text-center mt-6">
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">Your Skin Condition</h3>
      
      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100"
            />
            {/* Progress Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#lavenderGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="lavenderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B5A1E5" />
                <stop offset="100%" stopColor="#7B5FA5" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 leading-none">{severity}%</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Severity</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="px-4 py-1.5 rounded-full bg-primary-lavender/10 text-deep-lavender border border-primary-lavender/30 text-xs font-bold mb-4 uppercase tracking-widest">
          {displayLabel}
        </div>

        <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[280px]">
          {getDescription()}
        </p>
      </div>
    </div>
  );
}
