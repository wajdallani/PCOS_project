import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function MealPredictionCard({ image }) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft overflow-hidden group">
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="text-xl font-heading font-bold text-gray-900">AI Prediction</h3>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <ShieldCheck size={12} className="text-green-600" />
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Low Risk</span>
        </div>
      </div>

      <div className="relative overflow-hidden aspect-video mx-6 rounded-2xl mb-4">
        <img
          src={image || "/avatars/avatar1.jpg"}
          alt="Scanned Meal"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none"></div>
        <span className="absolute bottom-4 left-4 z-20 text-white font-heading font-bold text-xl drop-shadow-md">Avocado Toast</span>
      </div>

      <div className="px-6 pb-6">
        <p className="text-sm font-medium text-gray-500 leading-relaxed">
          Fiber from <span className="text-deep-lavender font-bold">whole grain</span> and healthy fats from <span className="text-deep-lavender font-bold">avocado</span> will slow glucose absorption and provide sustained energy.
        </p>
      </div>
    </div>
  );
}
