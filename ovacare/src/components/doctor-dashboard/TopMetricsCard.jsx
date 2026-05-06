import React from 'react';

export default function TopMetricsCard({ value, label, icon: Icon, iconBg, iconColor, accent }) {
  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-soft p-6 flex items-center gap-5 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg} group-hover:scale-110 transition-transform`}>
        <Icon size={24} className={iconColor} />
      </div>
      <div>
        <p className="text-3xl font-heading font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5">{label}</p>
      </div>
      {accent && (
        <div className={`ml-auto w-1.5 h-10 rounded-full ${accent} opacity-60`}></div>
      )}
    </div>
  );
}
