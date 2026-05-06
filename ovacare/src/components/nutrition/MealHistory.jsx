import React from 'react';
import { ArrowRight } from 'lucide-react';

const history = [
  {
    name: 'Salmon Quinoa Salad',
    time: 'Yesterday',
    risk: 'Low Risk',
    peak: '94 mg/dL',
    riskStyle: 'bg-green-50 text-green-700 border-green-100',
    avatar: '/avatars/avatar2.jpg',
  },
  {
    name: 'Glazed Donut',
    time: '2 days ago',
    risk: 'High Risk',
    peak: '162 mg/dL',
    riskStyle: 'bg-red-50 text-red-600 border-red-100',
    avatar: '/avatars/avatar3.jpg',
  },
  {
    name: 'Whole Wheat Pasta',
    time: '3 days ago',
    risk: 'Moderate',
    peak: '128 mg/dL',
    riskStyle: 'bg-orange-50 text-orange-600 border-orange-100',
    avatar: '/avatars/avatar1.jpg',
  },
];

export default function MealHistory() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-heading font-bold text-gray-900">Meal History</h3>
        <button className="text-[10px] font-black text-primary-lavender uppercase tracking-widest flex items-center gap-1 hover:text-deep-lavender transition-colors group">
          View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {history.map((meal) => (
          <div
            key={meal.name}
            className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:shadow-md transition-shadow">
              <img src={meal.avatar} alt={meal.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-deep-lavender transition-colors">{meal.name}</h4>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">{meal.time}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${meal.riskStyle}`}>
                {meal.risk}
              </span>
              <span className="text-[11px] font-bold text-gray-500">{meal.peak} peak</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
