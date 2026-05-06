import React from 'react';
import { Plus, Pill, Smile, Camera } from 'lucide-react';

export default function QuickActionCard({ icon: Icon, title, subtitle, badge, variant = 'default', onClick }) {
  const isDark = variant === 'dark';

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-[24px] transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg ${
      isDark 
        ? 'bg-ai-accent text-white shadow-[0_10px_25px_rgba(75,46,131,0.25)]' 
        : 'bg-white text-gray-900 border border-gray-100 shadow-soft'
    }`}>
      <div className={`p-3 rounded-2xl mb-4 ${
        isDark ? 'bg-white/10' : 'bg-primary-lavender/10 text-primary-lavender'
      }`}>
        <Icon size={24} />
      </div>
      
      <div className="text-center flex flex-col items-center">
        <div className="flex items-center gap-2">
          <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
          {badge && (
            <span className="text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded bg-primary-lavender text-white">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-white/60' : 'text-gray-400'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
