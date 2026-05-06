import React from 'react';

export default function CyclePhaseCard() {
  const chartData = [
    { label: 'LH', value: 40, color: 'bg-[#FADBD8]' },
    { label: 'FSH', value: 30, color: 'bg-[#FADBD8]' },
    { label: 'E2', value: 65, color: 'bg-[#F5B7B1]' },
    { label: 'P4', value: 85, color: 'bg-[#7B5FA5]' }, // Deep mauve for current high progesterone
  ];

  return (
    <div className="bg-gradient-to-br from-soft-pink to-primary-lavender/40 rounded-[28px] p-6 sm:p-8 border border-white/40 shadow-soft text-white relative overflow-hidden group hover:shadow-xl transition-all duration-500">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Cycle Phase</span>
          <h3 className="text-3xl font-heading font-bold mt-1 mb-2">Luteal Phase</h3>
          <p className="text-white/80 font-medium">Day 21 • <span className="text-white">High Progesterone</span></p>
          
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-xs font-medium border border-white/10 transition-colors">
              Phase Insights
            </button>
            <button className="px-4 py-2 bg-ai-accent/20 hover:bg-ai-accent/30 backdrop-blur-md rounded-full text-xs font-medium border border-ai-accent/10 transition-colors">
              History
            </button>
          </div>
        </div>

        {/* Vertical Chart */}
        <div className="flex items-end gap-3 h-28">
          {chartData.map((bar, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-4 bg-white/10 rounded-full h-24 relative overflow-hidden">
                <div 
                  className={`absolute bottom-0 w-full rounded-full transition-all duration-1000 delay-300 ${bar.color}`}
                  style={{ height: `${bar.value}%` }}
                />
              </div>
              <span className="text-[10px] font-bold opacity-70 tracking-tighter">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
