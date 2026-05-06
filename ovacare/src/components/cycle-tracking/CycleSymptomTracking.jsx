import React, { useEffect, useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import CycleCalendar from './CycleCalendar';
import DailyLogForm from './DailyLogForm';
import SymptomTrendsCard from './SymptomTrendsCard';
import PreviousLogsCard from './PreviousLogsCard';
import FloatingChatButton from '../dashboard/FloatingChatButton';

export default function CycleSymptomTracking({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Sidebar - Same as Dashboard */}
      <Sidebar onNavigate={onNavigate} activePage="cycle-tracking" />

      {/* Main Content Area */}
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        {/* Page Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">Cycle & Symptom Tracking</h1>
          <p className="text-gray-500 font-medium mt-1 max-w-2xl">
            Logging your daily symptoms helps the AI detect patterns in your PCOS journey and personalizes your treatment recommendations.
          </p>
        </header>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - 7/12 width on LG */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CycleCalendar />
            <DailyLogForm onNavigate={onNavigate} />
          </div>

          {/* Right Column - 5/12 width on LG */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SymptomTrendsCard />
            <PreviousLogsCard />
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
