import React from 'react';
import { Sparkles } from 'lucide-react';

export default function InfoCard() {
  return (
    <div className="mt-8 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-soft text-center max-w-md mx-auto transform transition-transform hover:-translate-y-1 duration-300">
      <div className="flex justify-center mb-2">
        <div className="bg-primary-lavender/20 p-2 rounded-full">
          <Sparkles className="text-ai-accent" size={20} />
        </div>
      </div>
      <h3 className="font-heading font-semibold text-gray-900 mb-1 text-base">
        Empowering Your Journey
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        Log in to access your personalized hormonal balance scores and symptom-tracking insights curated by our medical-grade AI.
      </p>
    </div>
  );
}
