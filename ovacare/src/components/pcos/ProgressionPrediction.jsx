import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import SymptomForm from '../shared/SymptomForm';
import FloatingChatButton from '../dashboard/FloatingChatButton';
import { predictProgressionIntegrated } from '../../services/api';
import { Sparkles, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ProgressionPrediction({ onNavigate }) {
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setIsPredicting(true);
    setError(null);
    try {
      // Progression expects history, but we send 10 fields and backend handles synthetic + current
      const data = await predictProgressionIntegrated(formData);
      setResult(data);
    } catch (err) {
      console.error("Progression prediction failed:", err);
      setError("Analysis failed. Please try again.");
    } finally {
      setIsPredicting(false);
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'WORSENING') return <TrendingUp className="text-red-500" size={24} />;
    if (trend === 'IMPROVING') return <TrendingDown className="text-green-500" size={24} />;
    return <Minus className="text-orange-500" size={24} />;
  };

  return (
    <div className="flex min-h-screen bg-bg-color">
      <Sidebar onNavigate={onNavigate} activePage="progression" />
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        <header className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">Symptom Progression Analysis</h1>
          <p className="text-gray-500 font-medium mt-1">
            Analyze how your PCOS symptoms are evolving over time using our LSTM deep learning model.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <SymptomForm 
              onSubmit={handlePredict} 
              isPredicting={isPredicting}
              title="Current Status"
              subtitle="Providing your latest data helps the AI detect the trend direction"
            />
          </div>

          <div className="lg:col-span-5 space-y-8">
            {result ? (
              <div className="bg-white rounded-[32px] p-8 border border-primary-lavender/10 shadow-glow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-lavender/10 text-primary-lavender rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-900">Trend Analysis</h3>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[24px] mb-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Trend Direction</p>
                  <div className="flex items-center gap-3 mb-2">
                    {getTrendIcon(result.trend_direction)}
                    <h2 className="text-3xl font-heading font-bold text-gray-900">
                      {result.trend_direction}
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Confidence: {Math.round(result.trend_confidence * 100)}%
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-inner-soft">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Risk Trajectory</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        result.risk_trajectory === 'increasing' ? 'bg-red-400' : 
                        result.risk_trajectory === 'decreasing' ? 'bg-green-400' : 'bg-orange-400'
                      }`} />
                      <span className="text-sm font-bold text-gray-700 capitalize">{result.risk_trajectory}</span>
                    </div>
                  </div>

                  {result.pattern_detected && (
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Pattern Detected</p>
                      <p className="text-sm font-bold text-blue-900">{result.pattern_detected.replace(/_/g, ' ')}</p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                      Based on {result.data_points_used || 30} days of historical and current data analyzed by {result.model_used}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center h-full">
                <div className="w-20 h-20 rounded-[24px] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">
                  <TrendingUp size={40} />
                </div>
                <h4 className="text-xl font-heading font-bold text-gray-400">Ready for Trend Analysis</h4>
                <p className="text-xs font-medium text-gray-400 mt-3 max-w-[240px] leading-relaxed">
                  OvaCare tracks your symptom history to predict if your PCOS status is improving or requires medical attention.
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <FloatingChatButton />
    </div>
  );
}
