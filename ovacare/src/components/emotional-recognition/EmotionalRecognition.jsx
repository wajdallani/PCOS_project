import React, { useState, useEffect } from 'react';
import Sidebar from '../dashboard/Sidebar';
import FloatingChatButton from '../dashboard/FloatingChatButton';
import VideoCheckInCard from './VideoCheckInCard';
import LastResultCard from './LastResultCard';
import BreathingCard from './BreathingCard';
import RecommendationsCard from './RecommendationsCard';
import WeeklyTrendsCard from './WeeklyTrendsCard';

export default function EmotionalRecognition({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Sidebar */}
      <Sidebar onNavigate={onNavigate} activePage="emotional-recognition" />

      {/* Main Content Area */}
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        {/* Page Header */}
        <header className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">How are you feeling today?</h1>
          <p className="text-gray-500 font-medium mt-2 max-w-2xl">
            Our AI uses gentle visual check-ins to monitor your hormonal emotional baseline and provide personalized support.
          </p>
        </header>

        <div className="space-y-8">
          {/* Top Row: Video Check-In & Last Result */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <VideoCheckInCard />
            </div>
            <div className="lg:col-span-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <LastResultCard />
            </div>
          </div>

          {/* Bottom Row: Supportive Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <BreathingCard />
            <RecommendationsCard />
            <WeeklyTrendsCard />
          </div>
        </div>

        {/* Space for bottom padding */}
        <div className="h-20" />
      </main>

      {/* Shared Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
}
