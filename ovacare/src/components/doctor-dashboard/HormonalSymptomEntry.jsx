import React from 'react';
import { ClipboardList, Check } from 'lucide-react';

export default function HormonalSymptomEntry({ data, symptoms, onInputChange, onSymptomToggle }) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-soft-pink/10 rounded-xl text-soft-pink">
            <ClipboardList size={18} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-gray-900">Hormonal & Symptom Entry</h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Manual entry or auto-filled via OCR</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary-lavender/10 text-[10px] font-black text-primary-lavender uppercase tracking-widest border border-primary-lavender/20">
          Step 2 of 3
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">LH IU/mL</label>
            <input
              type="text"
              value={data.lh}
              onChange={(e) => onInputChange('lh', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 transition-all font-bold text-gray-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">FSH mIU/mL</label>
            <input
              type="text"
              value={data.fsh}
              onChange={(e) => onInputChange('fsh', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 transition-all font-bold text-gray-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Vit D3 ng/mL</label>
            <input
              type="text"
              value={data.vitamin_d3 || ""}
              onChange={(e) => onInputChange('vitamin_d3', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 transition-all font-bold text-gray-700"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Fasting Insulin mIU/mL</label>
            <input
              type="text"
              value={data.insulin || ""}
              onChange={(e) => onInputChange('insulin', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 transition-all font-bold text-gray-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Fasting Glucose mg/dL</label>
            <input
              type="text"
              value={data.glucose || ""}
              onChange={(e) => onInputChange('glucose', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 transition-all font-bold text-gray-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">AMH ng/mL</label>
            <input
              type="text"
              value={data.amh || ""}
              onChange={(e) => onInputChange('amh', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 transition-all font-bold text-gray-700"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Observed Symptoms</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'irregular_cycle', label: 'Irregular Cycle' },
            { id: 'acne_oily_skin', label: 'Acne / Oily Skin' },
            { id: 'hirsutism', label: 'Hirsutism' },
            { id: 'hair_loss', label: 'Hair Loss' },
            { id: 'weight_gain', label: 'Weight Gain' }
          ].map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => onSymptomToggle(symptom.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${symptoms.includes(symptom.id)
                  ? 'bg-soft-pink border-soft-pink text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-soft-pink/30 hover:text-soft-pink'
                }`}
            >
              {symptoms.includes(symptom.id) && <Check size={14} />}
              {symptom.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-50 pt-6">
        <button
          onClick={() => onInputChange('save_lab', true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border border-soft-pink/30 text-soft-pink font-bold text-xs uppercase tracking-widest hover:bg-soft-pink hover:text-white transition-all shadow-sm group"
        >
          <div className="p-1 bg-soft-pink/10 rounded-lg group-hover:bg-white/20">
            <Check size={14} />
          </div>
          Save Final Lab Test Values
        </button>
      </div>
    </div>
  );
}
