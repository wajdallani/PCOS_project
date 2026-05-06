import React, { useState, useEffect } from 'react';
import { Sparkles, Video, Mic, StopCircle } from 'lucide-react';

const questions = [
  "How was your day?",
  "What special moment happened today? Tell us about it.",
  "How did you feel during the most stressful moment today?",
  "What are you looking forward to tomorrow?"
];

export default function VideoCheckInCard() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  useEffect(() => {
    let interval;
    if (isCheckingIn) {
      interval = setInterval(() => {
        setCurrentQuestionIdx((prev) => (prev + 1) % questions.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isCheckingIn]);

  const handleStartCheckIn = () => {
    setIsCheckingIn(true);
    setCurrentQuestionIdx(0);
  };

  const handleStopCheckIn = () => {
    setIsCheckingIn(false);
  };

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 relative overflow-hidden group">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-20">
        <h3 className="text-xl font-heading font-bold text-gray-900">Visual Wellness Scan</h3>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors duration-500 shadow-sm ${
          isCheckingIn ? 'bg-ai-accent text-white shadow-glow animate-pulse' : 'bg-primary-lavender/10 text-primary-lavender border border-primary-lavender/20'
        }`}>
          <Sparkles size={12} /> AI ACTIVE
        </div>
      </div>

      {/* Question Prompt Area */}
      <div className="min-h-[60px] flex items-center justify-center mb-6 relative z-20">
        <p key={currentQuestionIdx} className="text-lg font-medium text-deep-lavender text-center animate-fade-in transition-all">
          {isCheckingIn ? questions[currentQuestionIdx] : "Ready when you are. Take a deep breath."}
        </p>
      </div>

      {/* Video / Camera Preview Area */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900/5 border border-gray-100 flex items-center justify-center mb-8">
        
        {/* Subtle dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent z-10 pointer-events-none"></div>

        {/* Placeholder Face or Camera Feed */}
        <img 
          src="/avatars/avatar1.jpg" 
          alt="Camera Feed" 
          className={`w-full h-full object-cover transition-all duration-1000 ${isCheckingIn ? 'opacity-80 scale-105 blur-[1px]' : 'opacity-30 blur-[4px] grayscale'}`}
        />

        {/* Face Detection Frame */}
        {isCheckingIn && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-[60%] sm:w-[40%] aspect-[3/4] border-2 border-dashed border-white/50 rounded-[40px] animate-pulse-gentle shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>
          </div>
        )}

        {/* Audio Waveform Visualization (Simulated) */}
        {isCheckingIn && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-1 z-20 h-8">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-white/80 rounded-full animate-waveform" 
                style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100 + 20}%` }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Main Action Button */}
      <div className="flex justify-center relative z-20">
        {!isCheckingIn ? (
          <button 
            onClick={handleStartCheckIn}
            className="flex items-center justify-center gap-3 py-4 px-8 rounded-full bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold tracking-widest uppercase text-sm shadow-soft hover:shadow-glow hover:scale-105 transition-all duration-300"
          >
            <Video size={18} />
            <Mic size={18} />
            Start Emotional Check-in
          </button>
        ) : (
          <button 
            onClick={handleStopCheckIn}
            className="flex items-center justify-center gap-3 py-4 px-8 rounded-full bg-white border border-red-100 text-red-500 font-bold tracking-widest uppercase text-sm shadow-sm hover:bg-red-50 hover:scale-105 transition-all duration-300"
          >
            <StopCircle size={18} />
            End Check-in
          </button>
        )}
      </div>
      
      {/* Decorative background glow */}
      {isCheckingIn && (
        <div className="absolute inset-0 bg-primary-lavender/5 pointer-events-none blur-3xl z-0 animate-pulse"></div>
      )}
    </div>
  );
}
