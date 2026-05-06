import React from 'react';
import { Sparkles, TrendingUp, Moon, FileText } from 'lucide-react';

export function PatientsAIInsightCard() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 relative overflow-hidden group flex-1">
      {/* Decorative glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary-lavender/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-ai-accent rounded-lg shadow-glow">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-ai-accent uppercase tracking-widest">AI Clinical Insight</span>
        </div>

        <div className="mt-4 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Attention Recommended</span>
          </div>
          <p className="text-sm font-medium text-gray-600 leading-relaxed">
            Our analysis shows a correlation between <span className="font-bold text-gray-900">decreased medication adherence</span> and increased symptom reporting in <span className="font-bold text-deep-lavender">4 patients</span> this week. Early intervention is suggested for <span className="font-bold text-red-500">Emily R.</span> and <span className="font-bold text-red-500">Maya S.</span>
          </p>
        </div>

        <div className="flex gap-4 my-5 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-2">
            <Moon size={14} className="text-gray-400" />
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Primary Factor</span>
              <span className="text-xs font-bold text-gray-800">Inconsistent Sleep</span>
            </div>
          </div>
          <div className="border-l border-gray-200 pl-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-orange-400" />
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Impact Level</span>
              <span className="text-xs font-bold text-orange-600">Medium</span>
            </div>
          </div>
        </div>

        <button className="w-full py-3 rounded-[16px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold text-xs uppercase tracking-widest hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
          <FileText size={15} /> Generate Report
        </button>
      </div>
    </div>
  );
}

export function ClinicOverviewCard() {
  const metrics = [
    { icon: '👥', label: 'Total Patients', value: '124', color: 'text-primary-lavender' },
    { icon: '⚠️', label: 'High Risk Active', value: '8', color: 'text-red-500' },
    { icon: '📋', label: 'Pending Reviews', value: '12', color: 'text-orange-500' },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 w-full lg:w-[300px] flex-shrink-0">
      <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Clinic Overview</h3>
      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-primary-lavender/5 transition-colors cursor-default group">
            <div className="flex items-center gap-3">
              <span className="text-lg">{m.icon}</span>
              <span className="text-sm font-medium text-gray-600">{m.label}</span>
            </div>
            <span className={`text-xl font-bold ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
