import React from 'react';

const steps = [
  { id: 1, label: 'History' },
  { id: 2, label: 'Hormonal & Symptoms' },
  { id: 3, label: 'Summary' },
];

export default function PredictionStepper({ activeStep = 2 }) {
  return (
    <div className="flex items-center gap-2 mb-8 animate-fade-in">
      {steps.map((step, idx) => {
        const isActive = step.id === activeStep;
        const isDone = step.id < activeStep;
        return (
          <React.Fragment key={step.id}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              isActive
                ? 'bg-primary-lavender text-white shadow-md'
                : isDone
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-white border border-gray-200 text-gray-400'
            }`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                isActive ? 'bg-white/20' : isDone ? 'bg-green-200' : 'bg-gray-100'
              }`}>
                {isDone ? '✓' : step.id}
              </span>
              {step.label}
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-px max-w-[40px] ${isDone || isActive ? 'bg-primary-lavender/30' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
