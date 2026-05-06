import React, { useEffect, useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import AnalyzedImageCard from './AnalyzedImageCard';
import SkinConditionCard from './SkinConditionCard';
import { InsightCard, TipsCard, PCOSConnectionCard } from './ResultInsights';
import ProgressTracker from './ProgressTracker';
import ResultActions from './ResultActions';
import FloatingChatButton from '../dashboard/FloatingChatButton';

import { getAcneHistory, getLatestAcneAnalysis } from '../../services/api';

export default function AcneAnalysisResults({ onNavigate, image, severity: initialSeverity, label: initialLabel }) {
  const [isVisible, setIsVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentDisplay, setCurrentDisplay] = useState({
    image: image,
    severity: initialSeverity || 35,
    label: initialLabel || "MILD_ACNE"
  });

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const hist = await getAcneHistory();
      setHistory(hist);
      
      // If we didn't come from a fresh analysis (i.e. just viewing results), get latest
      if (!image) {
        const latest = await getLatestAcneAnalysis();
        if (latest) {
          setCurrentDisplay({
            image: latest.image_url,
            severity: latest.severity_percent,
            label: latest.acne_label
          });
        }
      }
    } catch (err) {
      console.error("Error fetching acne history:", err);
    }
  };

  const handleSelectHistory = (item) => {
    const severityMap = {
      0: 10,
      1: 35,
      2: 75,
      3: 95
    };
    setCurrentDisplay({
      image: item.image_url,
      severity: severityMap[item.acne_level] || 0,
      label: item.acne_label
    });
  };

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Sidebar */}
      <Sidebar onNavigate={onNavigate} activePage="cycle-tracking" />

      {/* Main Content Area */}
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        {/* Page Header */}
        <header className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">AI Skin Analysis Results</h1>
          <p className="text-gray-500 font-medium mt-1 max-w-2xl">
            Your personalized skin insights based on AI detection and hormonal patterns.
          </p>
        </header>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Image & Condition */}
          <div className="lg:col-span-5 space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <AnalyzedImageCard image={currentDisplay.image} />
            <SkinConditionCard severity={currentDisplay.severity} label={currentDisplay.label} />
          </div>

          {/* Right Column - Insights & Progress */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InsightCard />
              <TipsCard />
            </div>
            <PCOSConnectionCard />
            <ProgressTracker history={history} onSelect={handleSelectHistory} />
          </div>
        </div>

        {/* Action Buttons at the Bottom */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <ResultActions />
        </div>

        {/* Space for bottom padding */}
        <div className="h-20" />
      </main>

      {/* Shared Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
}
