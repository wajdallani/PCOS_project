import React from 'react';

// Mock data: LH/FSH readings for the last 7 days
const bars = [
  { day: 'Mon', lh: 55, fsh: 70 },
  { day: 'Tue', lh: 72, fsh: 60 },
  { day: 'Wed', lh: 48, fsh: 80 },
  { day: 'Thu', lh: 85, fsh: 55 },
  { day: 'Fri', lh: 65, fsh: 75 },
  { day: 'Sat', lh: 90, fsh: 50 },
  { day: 'Sun', lh: 60, fsh: 68 },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-heading font-bold text-gray-900">Hormonal Balance Analytics</h3>
          <p className="text-xs font-medium text-gray-400 mt-1">Average LH / FSH levels across monitored patients · Last 7 days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary-lavender"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-soft-pink"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">FSH</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 h-44 px-2">
        {bars.map((bar) => (
          <div key={bar.day} className="flex-1 flex flex-col items-center gap-2">
            {/* Bar group */}
            <div className="w-full flex items-end gap-1 h-40">
              <div
                className="flex-1 rounded-t-xl bg-primary-lavender/80 hover:bg-primary-lavender transition-colors duration-300 cursor-pointer group relative"
                style={{ height: `${bar.lh}%` }}
                title={`LH: ${bar.lh}`}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary-lavender opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{bar.lh}</div>
              </div>
              <div
                className="flex-1 rounded-t-xl bg-soft-pink/70 hover:bg-soft-pink transition-colors duration-300 cursor-pointer group relative"
                style={{ height: `${bar.fsh}%` }}
                title={`FSH: ${bar.fsh}`}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-soft-pink opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{bar.fsh}</div>
              </div>
            </div>
            {/* Day label */}
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">{bar.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
