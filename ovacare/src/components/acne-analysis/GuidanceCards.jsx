import React from 'react';
import { CheckCircle2, Layout, Lightbulb, Lock } from 'lucide-react';

export function InstructionCard() {
  const instructions = [
    { text: "Make sure your face is clearly visible and centered", icon: Layout },
    { text: "Use natural lighting for the most accurate AI analysis", icon: Lightbulb },
    { text: "Remove makeup if possible for clinical precision", icon: CheckCircle2 }
  ];

  return (
    <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft">
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">Instructions</h3>
      <div className="space-y-6">
        {instructions.map((item, index) => (
          <div key={index} className="flex gap-4 items-start group">
            <div className="mt-1 p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender group-hover:scale-110 transition-transform">
              <item.icon size={18} />
            </div>
            <p className="text-sm font-medium text-gray-600 leading-relaxed pt-1">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PrivacyCard() {
  return (
    <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-green-50 rounded-xl text-green-600">
          <Lock size={18} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900">Privacy Guaranteed</h3>
      </div>
      <p className="text-sm font-medium text-gray-500 leading-relaxed">
        Your photos are encrypted and used only for your private health analysis. Our AI respects your privacy and ensures your data is never shared without consent.
      </p>
    </div>
  );
}

export function ProTipCard() {
  return (
    <div className="bg-gradient-to-br from-primary-lavender to-soft-pink rounded-[28px] p-8 text-white shadow-soft relative overflow-hidden group">
      {/* Decorative Shimmer */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-heading font-bold mb-3 flex items-center gap-2">
           <Sparkles size={20} className="animate-pulse" /> Pro Tip
        </h3>
        <p className="text-sm font-medium text-white/90 leading-relaxed">
          Tracking your skin daily during your <span className="font-bold underline decoration-white/30 underline-offset-4">luteal phase</span> can reveal helpful patterns in hormonal acne and metabolic health.
        </p>
      </div>
    </div>
  );
}

import { Sparkles } from 'lucide-react';
