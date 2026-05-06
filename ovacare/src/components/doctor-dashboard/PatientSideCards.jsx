import React from 'react';
import { BrainCircuit, ClipboardList, Send, Sparkles, Utensils, SmilePlus, Activity } from 'lucide-react';

/* ─── Doctor Actions ─── */
export function DoctorActionsCard({ onPredictRisk, onAddTreatment, onSendRecommendation }) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6">
      <h3 className="text-lg font-heading font-bold text-gray-900 mb-5">Doctor Actions</h3>
      <div className="space-y-3">
        <button
          onClick={onPredictRisk}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold text-xs uppercase tracking-widest hover:shadow-glow hover:-translate-y-0.5 transition-all"
        >
          <BrainCircuit size={16} /> Predict Risk Trend
        </button>
        <button
          onClick={onAddTreatment}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] bg-primary-lavender/10 text-deep-lavender font-bold text-xs uppercase tracking-widest hover:bg-primary-lavender/20 hover:-translate-y-0.5 transition-all border border-primary-lavender/20"
        >
          <ClipboardList size={16} /> Add Treatment Plan
        </button>
        <button
          onClick={onSendRecommendation}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] bg-white border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-primary-lavender/30 hover:-translate-y-0.5 transition-all"
        >
          <Send size={16} /> Send Recommendation
        </button>
      </div>
    </div>
  );
}

/* ─── Patient Daily Logs ─── */
export function PatientDailyLogsCard({ mealLogs = [], dailyLogs = [] }) {
  const latestMeal = mealLogs[0];
  const latestDaily = dailyLogs[0];

  const displayLogs = [
    {
      icon: Utensils,
      iconBg: 'bg-orange-50 text-orange-500',
      label: 'Latest Meal',
      text: latestMeal ? `Recorded ${latestMeal.meal_type || 'Meal'}: ${latestMeal.description || 'No description'}` : 'No meal logs recorded yet.',
      badge: latestMeal?.glucose_level > 140 ? 'Glucose Alert' : null,
      badgeStyle: 'bg-red-50 text-red-600 border-red-100',
      lineColor: 'bg-orange-200',
    },
    {
      icon: SmilePlus,
      iconBg: 'bg-green-50 text-green-500',
      label: 'Wellness Snapshot',
      text: latestDaily ? `Mood: ${latestDaily.mood || 'N/A'}. Sleep: ${latestDaily.sleep_hours || 'N/A'} hrs. Stress: ${latestDaily.stress_level || 'N/A'}/10.` : 'No daily wellness logs yet.',
      badge: latestDaily?.mood === 'Happy' ? 'Positive' : null,
      badgeStyle: 'bg-green-50 text-green-700 border-green-100',
      lineColor: 'bg-green-200',
    },
    {
      icon: Activity,
      iconBg: 'bg-primary-lavender/10 text-primary-lavender',
      label: 'Active Symptoms',
      text: null,
      tags: latestDaily?.symptoms ? String(latestDaily.symptoms).split(',') : [],
      badge: null,
      lineColor: 'bg-primary-lavender/20',
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6">
      <h3 className="text-lg font-heading font-bold text-gray-900 mb-5">Patient Daily Logs</h3>
      <div className="space-y-0">
        {displayLogs.map((log, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${log.iconBg}`}>
                <log.icon size={15} />
              </div>
              {idx < displayLogs.length - 1 && (
                <div className={`w-0.5 flex-1 my-1 ${log.lineColor} min-h-[20px]`}></div>
              )}
            </div>
            <div className="pb-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-800">{log.label}</span>
                {log.badge && (
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${log.badgeStyle}`}>
                    {log.badge}
                  </span>
                )}
              </div>
              {log.text && <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{log.text}</p>}
              {log.tags && log.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {log.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : log.label === 'Active Symptoms' ? (
                <p className="text-[11px] font-medium text-gray-300 italic">No symptoms reported today</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Predictive AI Tip ─── */
export function PredictiveAITipCard() {
  return (
    <div className="bg-gradient-to-br from-primary-lavender/10 to-soft-pink/10 rounded-[24px] border border-primary-lavender/20 p-6 relative overflow-hidden group">
      <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-primary-lavender/10 rounded-full blur-3xl group-hover:scale-110 transition-transform pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-ai-accent rounded-lg shadow-glow">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-ai-accent uppercase tracking-widest">Predictive AI Tip</span>
        </div>
        <p className="text-sm font-medium text-gray-700 leading-relaxed">
          Sarah is showing signs of <span className="font-bold text-deep-lavender">insulin resistance sensitivity</span>. Recommend switching to the <span className="font-bold text-deep-lavender">1800-kcal Low-GI Meal Plan B</span> to stabilize hormonal shifts before ovulation.
        </p>
      </div>
    </div>
  );
}
