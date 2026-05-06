import React from 'react';
import { Activity } from 'lucide-react';

// Mock glucose curve points: time (0–120 min) -> mg/dL value
const glucosePoints = [
  { t: 0, v: 82 }, { t: 15, v: 88 }, { t: 30, v: 95 },
  { t: 45, v: 102 }, { t: 60, v: 99 }, { t: 75, v: 93 },
  { t: 90, v: 88 }, { t: 105, v: 84 }, { t: 120, v: 82 }
];

const normalPoints = [
  { t: 0, v: 82 }, { t: 30, v: 90 }, { t: 60, v: 88 }, { t: 90, v: 84 }, { t: 120, v: 82 }
];

// Chart dimensions
const W = 300, H = 120, MINT = 0, MAXT = 120, MINV = 70, MAXV = 120;
const tx = (t) => ((t - MINT) / (MAXT - MINT)) * W;
const ty = (v) => H - ((v - MINV) / (MAXV - MINV)) * H;

const toPath = (points) =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${tx(p.t)},${ty(p.v)}`).join(' ');

const toAreaPath = (points) =>
  `${toPath(points)} L ${tx(points[points.length - 1].t)},${H} L ${tx(points[0].t)},${H} Z`;

export default function GlucoseChart() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-xl font-heading font-bold text-gray-900">Estimated Glucose Response</h3>
          <p className="text-xs font-medium text-gray-400 mt-1">Post-meal 2-hour curve (AUC)</p>
        </div>
        <div className="p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender">
          <Activity size={18} />
        </div>
      </div>

      {/* Key Stats */}
      <div className="flex gap-6 my-6">
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Peak Value</span>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">102 <span className="text-sm font-medium text-gray-400">mg/dL</span></p>
        </div>
        <div className="border-l border-gray-100 pl-6">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recovery Time</span>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">45 <span className="text-sm font-medium text-gray-400">mins</span></p>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-hidden rounded-2xl bg-gray-50/50 px-4 pt-4 pb-2 border border-gray-50">
        <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B5A1E5" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#B5A1E5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Normal range band */}
          <rect x="0" y={ty(100)} width={W} height={ty(82) - ty(100)} fill="#dcfce7" opacity="0.4" rx="4" />

          {/* Predicted area fill */}
          <path d={toAreaPath(glucosePoints)} fill="url(#glucoseGradient)" />
          {/* Predicted line */}
          <path d={toPath(glucosePoints)} fill="none" stroke="#B5A1E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Normal line */}
          <path d={toPath(normalPoints)} fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Peak dot */}
          <circle cx={tx(45)} cy={ty(102)} r="4" fill="#7B5FA5" className="drop-shadow-md" />

          {/* X-axis labels */}
          {[0, 30, 60, 90, 120].map((t) => (
            <text key={t} x={tx(t)} y={H + 18} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="600">{t}m</text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 bg-primary-lavender rounded"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 bg-gray-300 rounded border-dashed"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Normal</span>
        </div>
      </div>
    </div>
  );
}
