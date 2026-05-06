import React from 'react';
import { Activity } from 'lucide-react';

const defaultFactors = [
  { label: 'Insulin Resistance', match: '88%', pct: 88, color: 'bg-primary-lavender' },
  { label: 'LH/FSH Ratio', match: '72%', pct: 72, color: 'bg-soft-pink' },
  { label: 'BMI Impact', match: '65%', pct: 65, color: 'bg-deep-lavender' },
];

export default function AIAnalysisCard({ isPredicting, predictionSaved, prediction }) {
  const displayPercentage = prediction
    ? Math.round(prediction.effectiveness_score * 100)
    : 78;

  const displayLabel = prediction
    ? `${prediction.recommendation_label} RECOMMENDED`
    : predictionSaved ? 'Input Saved' : 'Analysis Pending';

  const badgeClasses = prediction || predictionSaved
    ? 'bg-green-50 text-success-green border-green-100'
    : 'bg-ai-accent/5 text-ai-accent border-ai-accent/10';

  let displayFactors = defaultFactors;
  if (prediction && prediction.raw_prediction && prediction.raw_prediction.length >= 2) {
    displayFactors = [
      { label: 'Metformin Match', match: `${Math.round(prediction.raw_prediction[0] * 100)}%`, pct: Math.round(prediction.raw_prediction[0] * 100), color: 'bg-primary-lavender' },
      { label: 'Myo-inositol Match', match: `${Math.round(prediction.raw_prediction[1] * 100)}%`, pct: Math.round(prediction.raw_prediction[1] * 100), color: 'bg-soft-pink' }
    ];
  }

  let explanatoryText = predictionSaved
    ? "Treatment response input saved successfully. AI suggests metabolic alignment with this protocol."
    : "Review clinical features and select a treatment to initiate response probability analysis.";

  if (prediction && prediction.recommendation === 'metformin') {
    explanatoryText = "Based on the patient’s hormonal and metabolic profile, Metformin is predicted to have the strongest treatment response.";
  } else if (prediction && prediction.recommendation === 'myo-inositol') {
    explanatoryText = "Based on the patient’s hormonal and metabolic profile, Myo-inositol is predicted to have the strongest treatment response.";
  }

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ai-accent/10 rounded-xl text-ai-accent">
            <Activity size={18} />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900">AI Analysis</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badgeClasses}`}>
          {displayLabel}
        </span>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            <circle
              cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" strokeDasharray="364.4" strokeDashoffset={isPredicting ? "364.4" : (364.4 - (364.4 * displayPercentage / 100)).toString()}
              strokeLinecap="round" fill="transparent" className="text-primary-lavender transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center text-center">
            {isPredicting ? (
              <span className="text-xs font-bold text-primary-lavender animate-pulse">Analyzing...</span>
            ) : (
              <>
                <span className="text-3xl font-heading font-bold text-gray-900">{predictionSaved ? `${displayPercentage}%` : '--'}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Match</span>
              </>
            )}
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 text-center leading-relaxed max-w-[240px]">
          {explanatoryText}
        </p>
      </div>

      <div className="space-y-6">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Key Influencing Factors</p>
        {displayFactors.map((factor) => (
          <div key={factor.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-700">{factor.label}</span>
              <span className="text-[11px] font-black text-primary-lavender uppercase tracking-widest">{factor.match}</span>
            </div>
            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${isPredicting ? 'w-0' : ''} ${factor.color}`}
                style={{ width: isPredicting ? '0%' : `${factor.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
