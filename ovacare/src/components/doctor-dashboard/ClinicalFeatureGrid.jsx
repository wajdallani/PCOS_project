import React from 'react';

export default function ClinicalFeatureGrid({ values, onChange }) {
  const features = [
    { label: 'FSH/LH', key: 'FSH/LH', unit: '' },
    { label: 'FSH', key: 'FSHmIU/mL', unit: 'mIU/mL' },
    { label: 'LH', key: 'LHmIU/mL', unit: 'mIU/mL' },
    { label: 'AMH', key: 'AMHng/mL', unit: 'ng/mL' },
    { label: 'BMI', key: 'BMI', unit: '' },
    { label: 'RBS', key: 'RBSmg/dl', unit: 'mg/dl' },
    { label: 'Follicle No. (L)', key: 'Follicle_No._L', unit: '' },
    { label: 'Follicle No. (R)', key: 'Follicle_No._R', unit: '' },
  ];


  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      {features.map((feature) => (
        <div key={feature.key} className="p-3 bg-primary-lavender/5 border border-primary-lavender/10 rounded-2xl">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{feature.label} {feature.unit && `(${feature.unit})`}</label>
          <input 
            type="number"
            value={values[feature.key] || ''}
            onChange={(e) => onChange(feature.key, e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-gray-900 border-none p-0 focus:ring-0 focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
}
