import React from 'react';

export default function StepProgress({ currentStep, totalSteps }) {
  return (
    <div className="w-full flex gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum <= currentStep;
        
        return (
          <div 
            key={index} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              isActive ? 'bg-primary-lavender shadow-[0_0_8px_rgba(181,161,229,0.5)]' : 'bg-gray-100'
            }`}
          />
        );
      })}
    </div>
  );
}
