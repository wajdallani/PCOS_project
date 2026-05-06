import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import ClinicalFeatureGrid from './ClinicalFeatureGrid';


export default function TreatmentPredictionCard({ selectedTreatment, onTreatmentSelect, onPredict, isPredicting, values, onChange }) {
  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ai-accent/10 rounded-xl text-ai-accent">
            <Sparkles size={18} />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900">Treatment Response Prediction (AI)</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-ai-accent/5 text-[10px] font-black text-ai-accent uppercase tracking-widest border border-ai-accent/10">
          Predictive Model v4.2
        </span>
      </div>

      <ClinicalFeatureGrid values={values} onChange={onChange} />


      <button
        onClick={onPredict}
        disabled={isPredicting}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-[22px] bg-gradient-to-r from-ai-accent to-deep-lavender text-white font-bold text-sm uppercase tracking-widest shadow-glow hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPredicting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Zap size={18} className="fill-white" />
        )}
        {isPredicting ? 'Calculating Response...' : 'Predict Treatment Response'}
      </button>
    </div>
  );
}
