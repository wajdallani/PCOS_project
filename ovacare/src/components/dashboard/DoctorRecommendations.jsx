import React from 'react';
import { Sparkles, Move, Zap, ChevronRight } from 'lucide-react';
import RecommendationItem from './RecommendationItem';

export default function DoctorRecommendations() {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
          Doctor Recommendations
          <div className="p-1.5 bg-ai-accent/10 rounded-lg">
            <Sparkles size={14} className="text-ai-accent" />
          </div>
        </h2>
        <button className="text-xs font-bold text-primary-lavender hover:text-ai-accent transition-colors flex items-center gap-1 uppercase tracking-wider">
          View History <ChevronRight size={14} />
        </button>
      </div>

      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-soft">
        {/* Doctor Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-primary-lavender/30 p-0.5">
            <img src="/avatars/avatar2.jpg" alt="Dr. Miller" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">Dr. Miller</h3>
            <p className="text-xs text-gray-400 font-medium tracking-wide">Endocrinology Specialist</p>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          <RecommendationItem 
            title="Increase Low-Impact Movement"
            text="Based on your recent cortisol trends, aim for 20 minutes of yoga or walking instead of high-intensity cardio this week."
            icon={Move}
          />
          <RecommendationItem 
            title="Increase Inositol Intake"
            text="Consider adding more fiber-rich vegetables to your breakfast to help stabilize insulin spikes during the luteal phase."
            icon={Zap}
          />
        </div>
      </div>
    </div>
  );
}
