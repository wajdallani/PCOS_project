import React from 'react';

export default function TreatmentSelector({ selected, onSelect }) {
  return (
    <div className="flex flex-col gap-3 mb-8">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Treatment Selection</p>
      <div className="flex gap-4">
        {[
          { id: 'metformin', label: 'Metformin' },
          { id: 'myo-inositol', label: 'Myo-inositol' },
        ].map((option) => (
          <label key={option.id} className="flex-1 cursor-pointer group">
            <input
              type="radio"
              name="treatment"
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(option.id)}
              className="hidden"
            />
            <div className={`p-4 rounded-2xl border-2 transition-all text-center font-bold text-sm ${
              selected === option.id
                ? 'border-primary-lavender bg-primary-lavender/5 text-deep-lavender'
                : 'border-gray-100 bg-white text-gray-400 hover:border-primary-lavender/30 group-hover:bg-gray-50'
            }`}>
              {option.label}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
