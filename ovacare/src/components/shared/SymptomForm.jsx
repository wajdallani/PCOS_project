import React, { useState } from 'react';
import { 
  ClipboardList, 
  Check, 
  AlertCircle, 
  Loader2, 
  Activity, 
  Zap, 
  Scissors, 
  TrendingUp, 
  Utensils, 
  Dumbbell, 
  Calendar
} from 'lucide-react';

export default function SymptomForm({ onSubmit, isPredicting, title, subtitle }) {
  const [formData, setFormData] = useState({
    cycle_r_i: 2, // Regular by default
    hair_growth_y_n: 0,
    skin_darkening_y_n: 0,
    pimples_y_n: 0,
    hair_loss_y_n: 0,
    weight_gain_y_n: 0,
    fast_food_y_n: 0,
    'reg.exercise_y_n': 0,
    bmi: 22.0,
    age_yrs: 25
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const ToggleButton = ({ label, field, currentVal }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex bg-gray-100 p-1 rounded-xl">
        {[0, 1].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => handleChange(field, val)}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              currentVal === val 
                ? 'bg-white text-primary-lavender shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {val === 1 ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary-lavender/10 rounded-2xl text-primary-lavender">
          <ClipboardList size={24} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold text-gray-900">{title}</h3>
          <p className="text-xs font-medium text-gray-400 mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Numeric Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Age (Years)</label>
            <input
              type="number"
              value={formData.age_yrs}
              onChange={(e) => handleChange('age_yrs', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 font-bold text-gray-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">BMI</label>
            <input
              type="number"
              step="0.1"
              value={formData.bmi}
              onChange={(e) => handleChange('bmi', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 font-bold text-gray-700"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Cycle Regularity</span>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {[2, 4].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleChange('cycle_r_i', val)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    formData.cycle_r_i === val 
                      ? 'bg-white text-primary-lavender shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {val === 2 ? 'Regular' : 'Irregular'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Inputs */}
        <div className="space-y-3">
          <ToggleButton label="Excess Hair Growth" field="hair_growth_y_n" currentVal={formData.hair_growth_y_n} />
          <ToggleButton label="Skin Darkening" field="skin_darkening_y_n" currentVal={formData.skin_darkening_y_n} />
          <ToggleButton label="Pimples / Acne" field="pimples_y_n" currentVal={formData.pimples_y_n} />
          <ToggleButton label="Hair Loss" field="hair_loss_y_n" currentVal={formData.hair_loss_y_n} />
          <ToggleButton label="Weight Gain" field="weight_gain_y_n" currentVal={formData.weight_gain_y_n} />
          <ToggleButton label="Frequent Fast Food" field="fast_food_y_n" currentVal={formData.fast_food_y_n} />
          <ToggleButton label="Regular Exercise" field="reg.exercise_y_n" currentVal={formData['reg.exercise_y_n']} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPredicting}
        className="w-full py-4 rounded-[20px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold tracking-widest uppercase text-sm shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isPredicting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Analyzing...
          </>
        ) : (
          <>
            Run AI Prediction <TrendingUp size={20} />
          </>
        )}
      </button>
    </form>
  );
}
