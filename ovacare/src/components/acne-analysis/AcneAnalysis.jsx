import React, { useEffect, useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import CameraPreviewCard from './CameraPreviewCard';
import AICaptureButtons from './AICaptureButtons';
import { InstructionCard, PrivacyCard, ProTipCard } from './GuidanceCards';
import FloatingChatButton from '../dashboard/FloatingChatButton';
import { uploadFaceImage, analyzeAcne, predictAcneIntegrated } from '../../services/api';

export default function AcneAnalysis({ onNavigate, onAnalysisComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTakePhoto = () => {
    console.log("Opening camera...");
    // Future integration
  };

  const handleFileSelect = async (file) => {
      // 2. Prepare base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fullBase64 = e.target.result;
        setUploadedImage(fullBase64);
        const imageB64 = fullBase64.split(',')[1]; // Strip data:image/... prefix

        setIsAnalyzing(true);
        try {
          // 3. Analyze using integrated API
          const analysisRes = await predictAcneIntegrated(imageB64);
          console.log("Analysis Complete:", analysisRes);

          // 4. Complete
          setIsAnalyzing(false);
          if (onAnalysisComplete) onAnalysisComplete({
            image: fullBase64,
            results: analysisRes
          });
        } catch (err) {
          console.error("Acne analysis failed:", err);
          setIsAnalyzing(false);
          alert("Failed to analyze skin image. Please try again.");
        }
      };
      reader.readAsDataURL(file);
  };

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Sidebar */}
      <Sidebar onNavigate={onNavigate} activePage="cycle-tracking" />

      {/* Main Content Area */}
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        {/* Page Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">AI Skin Analysis</h1>
          <p className="text-gray-500 font-medium mt-1 max-w-2xl">
            Track your skin health and hormonal changes with clinical precision using OvaCare's proprietary AI analysis.
          </p>
        </header>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main AI Capture */}
          <div className="lg:col-span-7 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft h-full flex flex-col">
               <CameraPreviewCard 
                 previewImage={uploadedImage} 
                 isAnalyzing={isAnalyzing} 
               />
               <AICaptureButtons 
                 onTakePhoto={handleTakePhoto} 
                 onFileSelect={handleFileSelect} 
               />
               <div className="mt-8 p-4 bg-primary-lavender/5 rounded-2xl border border-primary-lavender/10 text-center">
                  <p className="text-xs text-gray-500 font-medium">
                     Analysis takes approximately <span className="text-deep-lavender font-bold">15-30 seconds</span> depending on image quality.
                  </p>
               </div>
            </div>
          </div>

          {/* Right Column - AI Guidance Panels */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <InstructionCard />
            <PrivacyCard />
            <ProTipCard />
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
