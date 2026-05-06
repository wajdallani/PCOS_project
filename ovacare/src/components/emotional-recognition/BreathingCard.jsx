import React, { useState, useEffect } from 'react';
import { Wind } from 'lucide-react';

export default function BreathingCard() {
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [isActive, setIsActive] = useState(true);

  // Simple 4-7-8 breathing simulation for visual effect
  useEffect(() => {
    if (!isActive) return;

    let timeoutId;
    if (phase === 'inhale') {
      timeoutId = setTimeout(() => setPhase('hold'), 4000);
    } else if (phase === 'hold') {
      timeoutId = setTimeout(() => setPhase('exhale'), 7000);
    } else if (phase === 'exhale') {
      timeoutId = setTimeout(() => setPhase('inhale'), 8000);
    }

    return () => clearTimeout(timeoutId);
  }, [phase, isActive]);

  const circleScale = phase === 'inhale' ? 'scale-150' : phase === 'hold' ? 'scale-150' : 'scale-100';
  const circleText = phase === 'inhale' ? 'INHALE' : phase === 'hold' ? 'HOLD' : 'EXHALE';
  const opacity = phase === 'hold' ? 'opacity-70' : 'opacity-100';

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden group h-[300px]">
      <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
        <Wind size={18} className="text-gray-400" />
        <h3 className="text-sm font-heading font-bold text-gray-900">Guided Breathing</h3>
      </div>

      <div className="relative w-32 h-32 flex items-center justify-center mt-4">
        {/* Animated breathing circles */}
        <div className={`absolute inset-0 rounded-full bg-soft-pink/20 transition-all duration-[4000ms] ease-in-out ${circleScale} ${opacity}`}></div>
        <div className={`absolute inset-4 rounded-full bg-soft-pink/40 transition-all duration-[4000ms] ease-in-out ${circleScale} ${opacity}`}></div>
        <div className={`absolute inset-8 rounded-full bg-soft-pink text-white flex items-center justify-center font-bold tracking-widest text-xs z-10 transition-all duration-[4000ms] ease-in-out shadow-glow`}>
          {circleText}
        </div>
      </div>

      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-10">4-7-8 Technique Active</p>
    </div>
  );
}
