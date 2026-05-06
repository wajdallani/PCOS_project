import React, { useState, useEffect } from 'react';
import { Pill } from 'lucide-react';

export default function MedicationProtocolCard({ prediction }) {
  const [medication, setMedication] = useState("Metformin");

  useEffect(() => {
    if (prediction) {
      if (prediction.recommendation === 'metformin') {
        setMedication("Metformin");
      } else if (prediction.recommendation === 'myo-inositol') {
        setMedication("Myo-inositol");
      }
    }
  }, [prediction]);

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender">
          <Pill size={18} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900">Medication Protocol</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Medication</label>
          <input 
            type="text" 
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            className="w-full px-4 py-3 bg-primary-lavender/5 border border-primary-lavender/10 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Dosage</label>
          <input 
            type="text" 
            defaultValue="500mg"
            className="w-full px-4 py-3 bg-primary-lavender/5 border border-primary-lavender/10 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Frequency</label>
          <input 
            type="text" 
            defaultValue="BID (Twice daily)"
            className="w-full px-4 py-3 bg-primary-lavender/5 border border-primary-lavender/10 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Duration</label>
          <input 
            type="text" 
            defaultValue="90 days"
            className="w-full px-4 py-3 bg-primary-lavender/5 border border-primary-lavender/10 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/30 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Provider Instructions</label>
        <textarea 
          rows="4"
          defaultValue="Start with 500mg once daily for week 1 to minimize GI side effects, then increase to twice daily as tolerated."
          className="w-full px-4 py-3 bg-primary-lavender/5 border border-primary-lavender/10 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/30 transition-all resize-none"
        />
      </div>
    </div>
  );
}
