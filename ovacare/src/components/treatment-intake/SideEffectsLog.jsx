import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function SideEffectsLog() {
  const [selectedChips, setSelectedChips] = useState(['Fine']);
  const [note, setNote] = useState('');

  const chips = ['Fine', 'Nausea', 'Headache', 'Bloated', 'Fatigue'];

  const toggleChip = (chip) => {
    setSelectedChips(prev => 
      prev.includes(chip) 
        ? prev.filter(c => c !== chip)
        : [...prev, chip]
    );
  };

  const handleSubmitSideEffects = () => {
    console.log("Submitting side effects...", { chips: selectedChips, note });
    // Future integration
    setNote('');
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 flex flex-col h-full">
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Side Effects Log</h3>
      <p className="text-sm font-medium text-gray-500 mb-6">How did you feel after taking your meds today?</p>

      <div className="flex flex-wrap gap-3 mb-8">
        {chips.map(chip => {
          const isSelected = selectedChips.includes(chip);
          return (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border-2 ${
                isSelected
                  ? 'border-primary-lavender bg-primary-lavender/10 text-deep-lavender shadow-sm scale-105'
                  : 'border-primary-lavender/20 bg-white text-gray-500 hover:border-primary-lavender/40 hover:bg-gray-50'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <div className="mt-auto relative">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)..."
          className="w-full h-28 resize-none bg-gray-50 rounded-2xl border-none p-4 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-primary-lavender/30 transition-all"
        ></textarea>
        <button 
          onClick={handleSubmitSideEffects}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-deep-lavender text-white flex items-center justify-center shadow-md hover:shadow-glow hover:-translate-y-0.5 transition-all group"
        >
          <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
