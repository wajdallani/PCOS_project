import React from 'react';

export default function AIFeatureButton({ label, text, icon: Icon, variant = 'primary', onClick }) {
  const isPrimary = variant === 'primary';
  const gradient = isPrimary 
    ? 'from-primary-lavender to-deep-lavender' 
    : 'from-soft-pink to-primary-lavender';
  const shadowGlow = isPrimary
    ? 'shadow-[0_8px_20px_rgba(181,161,229,0.3)]'
    : 'shadow-[0_8px_20px_rgba(244,195,212,0.3)]';

  return (
    <button 
      onClick={onClick}
      className={`w-full relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br ${gradient} ${shadowGlow} transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] group`}
    >
      {/* Animated Glow Background */}
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      <div className="relative flex items-center gap-4 text-white text-left">
        {/* 3D Icon Container */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner group-hover:animate-float">
          <Icon size={24} className="text-white drop-shadow-md" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold tracking-tight">{label}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[8px] font-black uppercase tracking-wider border border-white/20">
              AI
            </span>
          </div>
          <p className="text-[10px] text-white/80 font-medium leading-tight">
            {text}
          </p>
        </div>
      </div>

      {/* Pulse Animation Dot */}
      <div className="absolute top-3 right-3 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white/50"></span>
      </div>
    </button>
  );
}
