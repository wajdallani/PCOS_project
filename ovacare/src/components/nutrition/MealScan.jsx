import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../dashboard/Sidebar';
import FloatingChatButton from '../dashboard/FloatingChatButton';
import ScanHeroCard from './ScanHeroCard';
import MealPredictionCard from './MealPredictionCard';
import NutritionBreakdown from './NutritionBreakdown';
import GlucoseChart from './GlucoseChart';
import InstantHacks from './InstantHacks';
import MealHistory from './MealHistory';
import { Loader2, Sparkles } from 'lucide-react';

export default function MealScan({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mealImage, setMealImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleScanMeal = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setMealImage(ev.target.result);
      setShowResults(false);
      setIsAnalyzing(true);

      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 3500);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Sidebar */}
      <Sidebar onNavigate={onNavigate} activePage="nutrition" />

      {/* Main Content */}
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        {/* Page Header */}
        <header className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">AI Nutrition Scanner</h1>
          <p className="text-gray-500 font-medium mt-1 max-w-2xl">
            Scan your meal and instantly understand its hormonal and metabolic impact.
          </p>
        </header>

        <div className="space-y-8">
          {/* Hero Scan Card */}
          <div className="animate-fade-in">
            <ScanHeroCard onScan={handleScanMeal} />
          </div>

          {/* AI Processing State */}
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-20 gap-6 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary-lavender/10 animate-ping absolute inset-0"></div>
                <div className="relative w-20 h-20 rounded-full bg-primary-lavender/20 border-2 border-primary-lavender/30 flex items-center justify-center">
                  <Loader2 size={32} className="text-primary-lavender animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-heading font-bold text-gray-900">Analyzing your meal...</h3>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5 justify-center">
                  <Sparkles size={14} className="text-primary-lavender" /> AI is detecting ingredients and predicting glucose response
                </p>
              </div>
              <div className="w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-lavender to-deep-lavender rounded-full animate-progress"></div>
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="space-y-8 animate-fade-in">
              {/* 2-Column Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-6">
                  <MealPredictionCard image={mealImage} />
                  <NutritionBreakdown />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-7 space-y-6">
                  <GlucoseChart />
                  <InstantHacks />
                </div>
              </div>

              {/* Meal History */}
              <MealHistory />
            </div>
          )}

          {/* Default State: show history even before scan */}
          {!isAnalyzing && !showResults && (
            <div className="animate-fade-in">
              <MealHistory />
            </div>
          )}
        </div>

        <div className="h-20" />
      </main>

      <FloatingChatButton />
    </div>
  );
}
