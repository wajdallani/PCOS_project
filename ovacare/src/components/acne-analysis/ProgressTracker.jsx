import React from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';

export default function ProgressTracker({ history = [], onSelect }) {
  return (
    <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-heading font-bold text-gray-900">Your Progress</h3>
        <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-1.5">
           <CheckCircle2 size={12} /> Improving
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* History Entries */}
        {history.map((img, index) => {
          const date = new Date(img.created_at);
          const label = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          return (
            <div key={img.id} className="flex-shrink-0 text-center">
              <div 
                onClick={() => onSelect(img)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 ${index === 0 ? 'border-primary-lavender shadow-md' : 'border-gray-100 grayscale hover:grayscale-0'} transition-all cursor-pointer group relative`}
              >
                 <img src={img.image_url} alt={label} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-primary-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 block ${index === 0 ? 'text-primary-lavender' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          );
        })}

        {/* Add New Entry Button */}
        <button className="flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:border-primary-lavender/30 hover:text-primary-lavender transition-all group">
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-primary-lavender/10 transition-colors">
            <Plus size={20} />
          </div>
        </button>
      </div>
    </div>
  );
}
