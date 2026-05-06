import React from 'react';

const moods = [
  { label: 'Calm', emoji: '🧘‍♀️', color: 'hover:bg-blue-50' },
  { label: 'Happy', emoji: '😊', color: 'hover:bg-yellow-50' },
  { label: 'Tired', emoji: '😴', color: 'hover:bg-purple-50' },
  { label: 'Low', emoji: '😔', color: 'hover:bg-indigo-50' },
  { label: 'Irritated', emoji: '😤', color: 'hover:bg-red-50' },
];

export default function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">How are you feeling today?</label>
      <div className="flex flex-wrap gap-3">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.label;
          return (
            <button
              key={mood.label}
              onClick={() => onSelect(mood.label)}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all duration-300 border-2 ${
                isSelected 
                  ? 'border-primary-lavender bg-primary-lavender/10 shadow-sm scale-105' 
                  : `border-gray-50 bg-gray-50/50 ${mood.color} text-gray-400 grayscale-[0.5]`
              } hover:grayscale-0 transform hover:-translate-y-1`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-deep-lavender' : 'text-gray-400'}`}>
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
