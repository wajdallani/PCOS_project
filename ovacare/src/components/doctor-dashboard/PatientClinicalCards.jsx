import React from 'react';
import { BrainCircuit, Camera, ChevronRight, FlaskConical } from 'lucide-react';

/* ─── Risk Score History ─── */
export function RiskScoreHistoryCard({ modelRuns = [] }) {
  const recentRuns = modelRuns.slice(0, 6).reverse();
  const scores = recentRuns.map(r => r.risk_score || 0);
  const maxBar = scores.length > 0 ? Math.max(...scores) : 100;
  const latestScore = scores.length > 0 ? scores[scores.length - 1] : null;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 group">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-xl font-heading font-bold text-gray-900">AI Risk Score History</h3>
          <p className="text-xs font-medium text-gray-400 mt-1">Predicted trend based on recent evaluations</p>
        </div>
        <div className="p-2 bg-ai-accent/10 rounded-xl text-ai-accent group-hover:scale-110 transition-transform">
          <BrainCircuit size={18} />
        </div>
      </div>

      <div className="flex items-end gap-3 mb-6 mt-6">
        <span className="text-5xl font-bold text-gray-900 leading-none">
          {latestScore !== null ? `${latestScore}%` : '--'}
        </span>
        {latestScore !== null && (
          <div className="mb-1">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${latestScore > 70 ? 'text-red-500 bg-red-50 border border-red-100' : 'text-green-500 bg-green-50 border border-green-100'}`}>
              {latestScore > 70 ? 'High' : 'Moderate'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 h-16 mb-5">
        {scores.length > 0 ? scores.map((val, idx) => {
          const isLast = idx === scores.length - 1;
          return (
            <div
              key={idx}
              className={`flex-1 rounded-t-lg transition-all duration-500 ${isLast ? 'bg-primary-lavender' : 'bg-primary-lavender/30'}`}
              style={{ height: `${(val / maxBar) * 100}%` }}
            />
          );
        }) : (
          <div className="flex-1 flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase tracking-widest border-t border-dashed border-gray-100 pt-8">
            No risk evaluations yet
          </div>
        )}
      </div>
      
      {recentRuns.length > 0 && (
        <div className="flex justify-between text-[9px] font-bold text-gray-300 uppercase px-0.5 mb-4">
          {recentRuns.map((r, idx) => {
            const date = r.created_at ? new Date(r.created_at) : null;
            return <span key={idx}>{date && !isNaN(date) ? date.toLocaleDateString('en-US', { month: 'short' }) : 'N/A'}</span>
          })}
        </div>
      )}

      <div className="p-4 bg-primary-lavender/5 rounded-2xl border border-primary-lavender/10">
        <p className="text-xs font-medium text-gray-600 leading-relaxed">
          {latestScore !== null 
            ? `Latest prediction suggests ${latestScore > 70 ? 'elevated' : 'stable'} risk levels. Monitor recent lifestyle logs for correlation.`
            : "Complete a risk assessment to see AI-driven hormonal insights and trend predictions."
          }
        </p>
      </div>
    </div>
  );
}

/* ─── Last Labs ─── */
export function LastLabsCard({ labTests = [] }) {
  const latestTest = labTests[0];
  
  const displayLabs = latestTest ? [
    { name: 'LH', value: `${latestTest.lh} IU/mL`, pct: 65, alert: (latestTest.lh > 10) },
    { name: 'FSH', value: `${latestTest.fsh} mIU/mL`, pct: 45, alert: false },
    { name: 'AMH', value: `${latestTest.amh} ng/mL`, pct: 80, alert: (latestTest.amh > 4.5) },
  ].filter(l => l.value !== 'null IU/mL' && l.value !== 'null mIU/mL' && l.value !== 'null ng/mL') : [];

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender">
            <FlaskConical size={18} />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900">Last Labs</h3>
        </div>
        <button className="text-[10px] font-black text-primary-lavender uppercase tracking-widest flex items-center gap-1 hover:text-deep-lavender transition-colors group">
          Full History <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      {displayLabs.length > 0 ? (
        <div className="space-y-5">
          {displayLabs.map(lab => (
            <div key={lab.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-800">{lab.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${lab.alert ? 'text-red-500' : 'text-gray-600'}`}>{lab.value}</span>
                  {lab.alert && (
                    <span className="text-[9px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Elevated</span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${lab.alert ? 'bg-red-400' : 'bg-primary-lavender'}`}
                  style={{ width: `${lab.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">No lab tests recorded yet</p>
        </div>
      )}
    </div>
  );
}

/* ─── Ultrasound Imaging History ─── */
export function UltrasoundHistoryCard({ ultrasounds = [] }) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-gray-900">Ultrasound Imaging History</h3>
        <button className="text-[10px] font-black text-primary-lavender uppercase tracking-widest hover:text-deep-lavender transition-colors">
          View All Scans
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {ultrasounds.length > 0 ? ultrasounds.slice(0, 3).map((scan, idx) => (
          <div key={idx} className="flex-shrink-0 text-center cursor-pointer group">
            <div className="w-24 h-20 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden group-hover:border-primary-lavender/50 group-hover:shadow-md transition-all flex items-center justify-center">
              {scan.left_image_url || scan.right_image_url ? (
                <img src={scan.left_image_url || scan.right_image_url} className="w-full h-full object-cover" alt="Scan" />
              ) : (
                <span className="text-3xl opacity-30">🔬</span>
              )}
            </div>
            <span className="text-[9px] font-bold text-gray-400 mt-2 block uppercase tracking-widest">
              {scan.ultrasound_date ? new Date(scan.ultrasound_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
            </span>
          </div>
        )) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl h-20 mr-4">
             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No scans uploaded</span>
          </div>
        )}
        {/* Add New */}
        <button className="flex-shrink-0 w-24 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:border-primary-lavender/40 hover:text-primary-lavender transition-all">
          <Camera size={18} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Add New</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Treatment Adherence ─── */
export function TreatmentAdherenceCard({ dailyLogs = [] }) {
  // Mock logic to show last 4 weeks of adherence
  const adherenceBars = [
    { day: 'W1', prescribed: 100, recorded: 80 },
    { day: 'W2', prescribed: 100, recorded: 95 },
    { day: 'W3', prescribed: 100, recorded: 70 },
    { day: 'W4', prescribed: 100, recorded: 85 },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-gray-900">Treatment Adherence</h3>
        <span className="text-[10px] font-bold text-gray-400">Activity Level</span>
      </div>
      <div className="flex items-end justify-around gap-4 h-28 mb-4">
        {adherenceBars.map((bar) => (
          <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-1 h-24">
              <div
                className="flex-1 rounded-t-lg bg-primary-lavender/30"
                style={{ height: `${bar.prescribed}%` }}
              />
              <div
                className="flex-1 rounded-t-lg bg-primary-lavender"
                style={{ height: `${bar.recorded}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-300 uppercase">{bar.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary-lavender/30"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prescribed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary-lavender"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recorded</span>
        </div>
      </div>
    </div>
  );
}
