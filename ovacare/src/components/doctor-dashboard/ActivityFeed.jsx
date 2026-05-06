import React from 'react';
import { Weight, Droplets, SmilePlus, Utensils } from 'lucide-react';

const activities = [
  {
    icon: Weight,
    name: 'Amara K.',
    type: 'Weight Log',
    time: '2 hours ago',
    detail: 'Increased by 0.5kg',
    tag: 'Consistent Trend',
    tagStyle: 'bg-primary-lavender/10 text-deep-lavender border-primary-lavender/20',
    iconBg: 'bg-primary-lavender/10 text-primary-lavender',
  },
  {
    icon: Droplets,
    name: 'Chloe V.',
    type: 'Cycle Log',
    time: '5 hours ago',
    detail: 'Heavy Flow Reported',
    tag: 'Alert Trigger',
    tagStyle: 'bg-red-50 text-red-600 border-red-100',
    iconBg: 'bg-red-50 text-red-400',
  },
  {
    icon: SmilePlus,
    name: 'Jasmine T.',
    type: 'Mood',
    time: 'Yesterday',
    detail: 'Reported Anxiety',
    tag: 'Mental Health Log',
    tagStyle: 'bg-orange-50 text-orange-600 border-orange-100',
    iconBg: 'bg-orange-50 text-orange-400',
  },
  {
    icon: Utensils,
    name: 'Sarah P.',
    type: 'Nutrition',
    time: 'Yesterday',
    detail: 'Low Carb Streak: 5 days',
    tag: 'Goal Met',
    tagStyle: 'bg-green-50 text-green-700 border-green-100',
    iconBg: 'bg-green-50 text-green-500',
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6">
      <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Symptom Activity</h3>
      <div className="space-y-4">
        {activities.map((item, index) => (
          <div key={index} className="flex gap-3 group cursor-pointer hover:bg-gray-50 rounded-2xl p-2 transition-colors">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${item.iconBg} group-hover:scale-110 transition-transform`}>
              <item.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-sm font-bold text-gray-900 truncate">{item.name}</span>
                <span className="text-[10px] font-medium text-gray-400 flex-shrink-0">{item.time}</span>
              </div>
              <p className="text-[11px] font-medium text-gray-500 truncate">{item.type} · {item.detail}</p>
              <span className={`mt-1.5 inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${item.tagStyle}`}>
                {item.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
