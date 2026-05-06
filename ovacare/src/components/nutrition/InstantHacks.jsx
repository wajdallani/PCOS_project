import React from 'react';
import { Footprints, Leaf, Droplets } from 'lucide-react';

const hacks = [
  {
    icon: Footprints,
    title: 'Walk 10 mins',
    text: 'Engage muscles to clear glucose from the bloodstream faster.',
    bg: 'from-primary-lavender/10 to-soft-pink/10',
    iconColor: 'text-deep-lavender',
    iconBg: 'bg-primary-lavender/20',
  },
  {
    icon: Leaf,
    title: 'Add Fiber',
    text: 'Add a handful of greens to buffer any glucose spike.',
    bg: 'from-green-50 to-green-100/50',
    iconColor: 'text-green-700',
    iconBg: 'bg-green-100',
  },
  {
    icon: Droplets,
    title: 'Drink Water',
    text: 'Stay hydrated to help your body flush excess sugar efficiently.',
    bg: 'from-blue-50 to-blue-100/50',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
];

export default function InstantHacks() {
  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">Instant Hacks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {hacks.map((hack) => (
          <div
            key={hack.title}
            className={`bg-gradient-to-br ${hack.bg} rounded-[20px] border border-white p-5 group hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default`}
          >
            <div className={`w-10 h-10 rounded-xl ${hack.iconBg} ${hack.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <hack.icon size={20} />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">{hack.title}</h4>
            <p className="text-xs font-medium text-gray-500 leading-relaxed">{hack.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
