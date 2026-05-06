import React, { useState } from 'react';

export default function AdherenceCalendar() {
  const [selectedDay, setSelectedDay] = useState(12); // Assume today is the 12th
  
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  // Placeholder data: 1=taken, 0=missed, null=future
  const calendarData = [
    1, 1, 1, 0, 1, 1, 1, // Week 1 (4th day missed)
    1, 0, 1, 1, 1, null, null // Week 2 (9th day missed, today is 12th)
  ];

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-heading font-bold text-gray-900">Adherence Calendar</h3>
        
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-deep-lavender"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Taken</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Missed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {/* Weekdays Header */}
        {daysOfWeek.map((day, idx) => (
          <div key={`header-${idx}`} className="text-center pb-2">
            <span className="text-xs font-black text-gray-300 uppercase">{day}</span>
          </div>
        ))}

        {/* Calendar Cells */}
        {calendarData.map((status, index) => {
          const dayNumber = index + 1;
          const isSelected = selectedDay === dayNumber;
          
          let bgColor = 'bg-gray-50';
          let textColor = 'text-gray-400';
          let borderColor = 'border-transparent';

          if (status === 1) {
            bgColor = 'bg-deep-lavender';
            textColor = 'text-white';
          } else if (status === 0) {
            bgColor = 'bg-red-400';
            textColor = 'text-white';
          }

          if (isSelected) {
            borderColor = 'border-primary-lavender ring-2 ring-primary-lavender/30';
          }

          return (
            <button
              key={dayNumber}
              onClick={() => setSelectedDay(dayNumber)}
              className={`aspect-square flex items-center justify-center rounded-2xl font-bold text-sm sm:text-base border-2 transition-all hover:scale-105 ${bgColor} ${textColor} ${borderColor}`}
              disabled={status === null}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
