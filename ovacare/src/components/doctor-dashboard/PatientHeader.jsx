import React from 'react';
import { Download, Video, Circle } from 'lucide-react';

export default function PatientHeader({ patient, onExportPDF, onStartTelehealth }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 animate-fade-in">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-soft-pink/40 to-primary-lavender/40 flex items-center justify-center text-deep-lavender font-bold text-2xl border-2 border-white shadow-md">
            {(patient.user?.username || "P").split(' ').map(n => n[0]).join('')}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></span>
        </div>

        {/* Identity */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 leading-tight">
            {patient.user?.username || "Patient"}, <span className="text-gray-400 font-medium">{patient.age_yrs || "??"}</span>
          </h1>
          <p className="text-xs font-medium text-gray-400 mt-0.5 mb-3">#OVA-{patient.id}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary-lavender/10 border border-primary-lavender/20 text-[10px] font-black text-deep-lavender uppercase tracking-widest">
              PCOS (Type {patient.pcos_type || "N/A"})
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              BMI: {patient.bmi || "N/A"}
            </span>
            {patient.cycle_day && (
              <span className="px-3 py-1 rounded-full bg-soft-pink/10 border border-soft-pink/30 text-[10px] font-black text-soft-pink uppercase tracking-widest flex items-center gap-1">
                <Circle size={8} className="fill-soft-pink animate-pulse" /> Active Cycle: Day {patient.cycle_day}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-primary-lavender/30 transition-all shadow-sm"
        >
          <Download size={15} /> Export PDF
        </button>
        <button
          onClick={onStartTelehealth}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-glow hover:-translate-y-0.5 transition-all"
        >
          <Video size={15} /> Start Telehealth
        </button>
      </div>
    </div>
  );
}
