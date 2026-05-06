import React from 'react';
import { Save, History, UserRound, Share2 } from 'lucide-react';

export default function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-10">
      <button className="flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-[20px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold tracking-widest uppercase text-sm shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
        <Save size={18} />
        Save this
      </button>
      
      <button className="flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-[20px] bg-white border border-gray-200 text-gray-600 font-bold tracking-widest uppercase text-sm shadow-sm hover:bg-gray-50 hover:border-primary-lavender/30 transition-all duration-300">
        <History size={18} />
        Track over time
      </button>

      <button className="flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-[20px] bg-white border border-gray-200 text-gray-600 font-bold tracking-widest uppercase text-sm shadow-sm hover:bg-gray-50 hover:border-primary-lavender/30 transition-all duration-300">
        <Share2 size={18} />
        Share with Doctor
      </button>
    </div>
  );
}
