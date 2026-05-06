import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function PatientRiskCard({ name, id, age, risk, trend, riskPercent }) {
  return (
    <div className="bg-white rounded-[20px] border-l-4 border-l-red-400 border border-gray-100 shadow-soft p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soft-pink/30 to-primary-lavender/30 flex items-center justify-center text-deep-lavender font-bold text-sm">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{name}</h4>
            <p className="text-[10px] font-medium text-gray-400 mt-0.5">{id} • Age {age}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest flex-shrink-0">
          High Risk
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Level</span>
          <span className="text-sm font-bold text-red-500">{riskPercent}%</span>
        </div>
        <div className="h-2 bg-red-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-1000"
            style={{ width: `${riskPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
          <span className="text-xs font-medium text-gray-500">{trend}</span>
        </div>
        <button className="text-[10px] font-black text-primary-lavender uppercase tracking-widest flex items-center gap-1 group-hover:text-deep-lavender transition-colors">
          Review Data <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
