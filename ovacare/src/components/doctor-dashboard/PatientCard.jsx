import React from 'react';
import { MessageSquare, ChevronRight, MoreVertical } from 'lucide-react';

const riskConfig = {
  high: {
    badge: 'bg-red-50 text-red-600 border-red-100',
    border: 'border-t-red-400',
    bar: 'bg-red-400',
    label: 'High Risk',
  },
  medium: {
    badge: 'bg-orange-50 text-orange-600 border-orange-100',
    border: 'border-t-orange-400',
    bar: 'bg-orange-400',
    label: 'Med Risk',
  },
  low: {
    badge: 'bg-primary-lavender/10 text-deep-lavender border-primary-lavender/20',
    border: 'border-t-primary-lavender',
    bar: 'bg-primary-lavender',
    label: 'Low Risk',
  },
};

export default function PatientCard({ patient, onViewProfile }) {
  const config = riskConfig[patient.risk];
  const maxBar = Math.max(...patient.trend);

  return (
    <div className={`bg-white rounded-[20px] border-t-4 border border-gray-100 shadow-soft group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden ${config.border}`}>
      {/* Top section */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-soft-pink/40 to-primary-lavender/40 flex items-center justify-center font-bold text-deep-lavender text-sm border-2 border-white shadow-sm flex-shrink-0">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{patient.name}</h4>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5">{patient.id} · Age {patient.age}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${config.badge}`}>
              {config.label}
            </span>
            <button className="p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors">
              <MoreVertical size={14} />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-gray-900 leading-none">{patient.adherence}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Adherence</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-gray-900 leading-none">{patient.lastLog}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Last Log</p>
          </div>
        </div>

        {/* Trend Bar Chart */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Symptom Severity</span>
            <span className={`text-xs font-bold ${patient.risk === 'high' ? 'text-red-500' : patient.risk === 'medium' ? 'text-orange-500' : 'text-primary-lavender'}`}>
              {patient.trendLabel}
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-10">
            {patient.trend.map((val, idx) => {
              const isLast = idx === patient.trend.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-t-md transition-all duration-300 ${isLast ? config.bar : 'bg-gray-100'}`}
                  style={{ height: `${(val / maxBar) * 100}%` }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto border-t border-gray-50 p-4 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onViewProfile && onViewProfile(patient.id); }}
          className="flex-1 py-2.5 rounded-xl bg-primary-lavender/10 text-deep-lavender text-xs font-bold hover:bg-primary-lavender/20 transition-colors flex items-center justify-center gap-1.5 group/btn"
        >
          View Profile <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
        <button className="p-2.5 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-primary-lavender hover:border-primary-lavender/30 transition-colors">
          <MessageSquare size={15} />
        </button>
      </div>
    </div>
  );
}
