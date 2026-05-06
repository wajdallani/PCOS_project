import React from 'react';
import { History, ChevronRight, Clock } from 'lucide-react';

const logs = [
  { date: 'May 12', mood: 'Tired', emoji: '😴', time: '9:15 PM', tags: ['Acne mild', 'Sleep 6h'] },
  { date: 'May 11', mood: 'Calm', emoji: '🧘‍♀️', time: '10:15 PM', tags: ['Pain 2/10'] },
  { date: 'May 10', mood: 'Happy', emoji: '😊', time: '8:30 PM', tags: ['Yoga'] },
];

export default function PreviousLogsCard() {
  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-soft">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-heading font-bold text-gray-900">Previous Logs</h3>
        <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
          <History size={18} />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {logs.map((log, index) => (
          <div key={index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl border border-gray-50 group-hover:scale-110 transition-transform">
              {log.emoji}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-bold text-gray-900">{log.date}</h4>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  <Clock size={10} /> {log.time}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold text-primary-lavender bg-primary-lavender/10 px-2 py-0.5 rounded-md">
                  {log.mood}
                </span>
                {log.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-lavender transition-colors" />
          </div>
        ))}
      </div>

      <button className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-primary-lavender hover:border-primary-lavender/30 transition-all">
        View Full History
      </button>
    </div>
  );
}
