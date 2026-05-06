import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';

export default function TreatmentItemCard({ icon: Icon, name, details, onLogIntake, isLogged }) {
  return (
    <div className="bg-white rounded-[24px] border border-primary-lavender/20 shadow-soft p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:-translate-y-1 hover:shadow-lg hover:border-primary-lavender/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary-lavender/10 border border-primary-lavender/20 flex items-center justify-center text-deep-lavender group-hover:scale-105 transition-transform">
          <Icon size={24} />
        </div>
        <div>
          <h4 className="text-lg font-heading font-bold text-gray-900 group-hover:text-deep-lavender transition-colors">{name}</h4>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{details}</p>
        </div>
      </div>
      
      <button 
        onClick={() => !isLogged && onLogIntake(name)}
        disabled={isLogged}
        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
          isLogged 
            ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
            : 'bg-gradient-to-r from-deep-lavender to-ai-accent text-white shadow-md hover:shadow-glow hover:scale-105'
        }`}
      >
        {isLogged ? (
          <>Logged <CheckCircle2 size={16} /></>
        ) : (
          <>Log Intake <Check size={16} /></>
        )}
      </button>
    </div>
  );
}
