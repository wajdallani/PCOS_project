import React from 'react';
import { ShieldCheck, MessageSquare, FileText, ChevronRight, Activity, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function RiskPredictionCard({ result }) {
  if (!result || !result.predictions) return null;

  const { predictions, model_run_id } = result;
  const { p_tabular = 0, p_image = 0, final_risk = 0, risk_level = 'Unknown', imputed_features = {} } = predictions;
  
  // Convert 0-1 to 0-100
  const score = Math.round(final_risk * 100);
  const tabularScore = Math.round(p_tabular * 100);
  const imageScore = Math.round(p_image * 100);
  
  // Circular progress calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const riskColors = {
    'Low': 'bg-green-50 text-green-600 border-green-100',
    'Moderate': 'bg-orange-50 text-orange-600 border-orange-100',
    'High': 'bg-red-50 text-red-600 border-red-100'
  };

  const hasImputed = imputed_features && Object.keys(imputed_features).length > 0;

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in overflow-hidden relative" style={{ animationDelay: '0.1s' }}>
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-lavender/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-lavender/10 rounded-2xl text-primary-lavender">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900">AI Risk Analysis</h3>
        </div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-inner-soft">
          ID: #{model_run_id || 'TEMP'}
        </div>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius * 1.5}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-50"
            />
            <circle
              cx="80"
              cy="80"
              r={radius * 1.5}
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={circumference * 1.5}
              strokeDashoffset={circumference * 1.5 - (score / 100) * (circumference * 1.5)}
              strokeLinecap="round"
              fill="transparent"
              className={`${score > 70 ? 'text-red-400' : score > 40 ? 'text-orange-400' : 'text-green-400'} transition-all duration-1500 ease-out`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-heading font-bold text-gray-900">{score}%</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Risk</span>
          </div>
        </div>

        <span className={`px-6 py-2 rounded-full border ${riskColors[risk_level] || riskColors['Moderate']} text-[12px] font-black uppercase tracking-widest mb-6 shadow-glow-sm`}>
          {risk_level} Risk Level
        </span>

        {/* Component Breakdown */}
        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-inner-soft">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-blue-400" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Tabular Data</p>
            </div>
            <p className="text-xl font-heading font-bold text-gray-900">{tabularScore}%</p>
            <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: `${tabularScore}%` }} />
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-inner-soft">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={14} className="text-purple-400" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Ultrasound Scan</p>
            </div>
            <p className="text-xl font-heading font-bold text-gray-900">{imageScore}%</p>
            <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${imageScore}%` }} />
            </div>
          </div>
        </div>

        {hasImputed && (
          <div className="w-full flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
            <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-amber-900 uppercase tracking-tight mb-1">Clinical Data Imputation</p>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Some patient parameters were missing. AI used medical averages for: {Object.keys(imputed_features).join(', ')}.
              </p>
            </div>
          </div>
        )}
        
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
          Multimodal Fusion Engine <span className="mx-2 text-gray-200">|</span> 70% Clinical + 30% Imaging
        </p>
      </div>

      <div className="space-y-3">
        <button className="w-full flex items-center justify-center gap-3 py-4.5 rounded-[20px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white text-xs font-bold uppercase tracking-widest hover:shadow-glow-lg hover:-translate-y-0.5 transition-all duration-300">
          <FileText size={16} /> Save Full Report
        </button>
        <button className="w-full flex items-center justify-center gap-3 py-4.5 rounded-[20px] bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-primary-lavender/40 transition-all duration-300">
          <MessageSquare size={16} /> Clinical Justification
        </button>
      </div>
    </div>
  );
}
