import React from 'react';
import { Zap, Wheat, Beef, Droplets } from 'lucide-react';

const macros = [
  { label: 'Calories', value: '290', unit: 'kcal', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { label: 'Carbs', value: '33', unit: 'g', icon: Wheat, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Protein', value: '7', unit: 'g', icon: Beef, color: 'text-red-400', bg: 'bg-red-50' },
  { label: 'Fat', value: '15.5', unit: 'g', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-50' },
];

const ingredients = [
  { name: 'Avocado', contribution: '200 kcal • 15g fat', tag: 'Low Impact', tagColor: 'text-green-600 bg-green-50 border-green-100' },
  { name: 'Whole Grain Toast', contribution: '65 kcal • 14g carbs', tag: 'Moderate', tagColor: 'text-orange-600 bg-orange-50 border-orange-100' },
  { name: 'Cherry Tomato', contribution: '25 kcal • 5g carbs', tag: 'Low Impact', tagColor: 'text-green-600 bg-green-50 border-green-100' },
];

export default function NutritionBreakdown() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8">
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">Nutritional Breakdown</h3>

      {/* Macro Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {macros.map((macro) => (
          <div key={macro.label} className={`flex flex-col items-center p-4 rounded-2xl ${macro.bg} group hover:scale-105 transition-transform cursor-default`}>
            <div className={`${macro.color} mb-2`}>
              <macro.icon size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 leading-none">{macro.value}<span className="text-xs font-medium text-gray-400 ml-0.5">{macro.unit}</span></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{macro.label}</span>
          </div>
        ))}
      </div>

      {/* Ingredient List */}
      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Detected Ingredients</h4>
      <div className="space-y-3">
        {ingredients.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-primary-lavender/30 hover:bg-gray-50/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div>
              <h5 className="text-sm font-bold text-gray-900">{item.name}</h5>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">{item.contribution}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${item.tagColor} uppercase tracking-widest`}>
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
