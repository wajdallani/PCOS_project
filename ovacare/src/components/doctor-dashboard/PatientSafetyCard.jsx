import React from 'react';
import { AlertCircle } from 'lucide-react';

const alerts = [
  'GI sensitivity likely. Advise slow dosage titration as per protocol.',
  'Schedule 30-day liver function check-in (LFT).',
];

export default function PatientSafetyCard() {
  return (
    <div className="bg-[#FFF5F5] rounded-[28px] border border-red-100 shadow-soft p-6 sm:p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-6 text-red-600">
        <AlertCircle size={20} />
        <h3 className="text-xl font-heading font-bold">Patient Safety Alerts</h3>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-red-50 shadow-sm flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-700 leading-relaxed">{alert}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
