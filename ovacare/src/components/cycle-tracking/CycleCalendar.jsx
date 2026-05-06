import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CycleCalendar() {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Static data for May 2024
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 3; // Wednesday starts on 1st

  const cycleDays = [1, 2, 3, 4, 5]; // Period days
  const predictedOvulation = [14, 15, 16]; // Fertile window
  const selectedDay = 13;

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-soft">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-heading font-bold text-gray-900">May 2024</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-primary-lavender transition-all">
            <ChevronLeft size={18} />
          </button>
          <button className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-primary-lavender transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-8">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-black text-gray-300 py-2 tracking-widest">{day}</div>
        ))}
        
        {/* Padding for month start */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`offset-${i}`} className="py-3"></div>
        ))}

        {daysInMonth.map(day => {
          const isPeriod = cycleDays.includes(day);
          const isOvulation = predictedOvulation.includes(day);
          const isSelected = day === selectedDay;

          return (
            <div key={day} className="flex justify-center py-1">
              <button className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all relative group
                ${isSelected ? 'border-2 border-primary-lavender bg-primary-lavender/5 text-deep-lavender' : ''}
                ${isPeriod ? 'bg-soft-pink/20 text-soft-pink' : ''}
                ${isOvulation ? 'ring-2 ring-primary-lavender/20 ring-inset text-primary-lavender' : ''}
                ${!isSelected && !isPeriod && !isOvulation ? 'text-gray-400 hover:bg-gray-50' : ''}
              `}>
                {day}
                {isOvulation && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary-lavender"></div>
                )}
                {isPeriod && !isSelected && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-soft-pink/40"></div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-6 pt-6 border-t border-gray-50 justify-center sm:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-soft-pink/20 border border-soft-pink/30"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cycle Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md border-2 border-primary-lavender/30"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Predicted Ovulation</span>
        </div>
      </div>
    </div>
  );
}
