import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import SymptomForm from '../shared/SymptomForm';
import FloatingChatButton from '../dashboard/FloatingChatButton';
import { predictPCOSIntegrated } from '../../services/api';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PCOSPrediction({ onNavigate }) {
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setIsPredicting(true);
    setError(null);
    try {
      const data = await predictPCOSIntegrated(formData);
      setResult(data);
    } catch (err) {
      console.error("PCOS prediction failed:", err);
      setError("Prediction failed. Please try again.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-color">
      <Sidebar onNavigate={onNavigate} activePage="pcos-prediction" />
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        <header className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">PCOS Risk Assessment</h1>
          <p className="text-gray-500 font-medium mt-1">
            Get an instant preclinical risk assessment using our validated LightGBM model.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <SymptomForm 
              onSubmit={handlePredict} 
              isPredicting={isPredicting}
              title="Symptom Profile"
              subtitle="Fill in your details for a precise AI risk score"
            />
          </div>

          <div className="lg:col-span-5 space-y-8">
            {result ? (
              <div className="bg-white rounded-[32px] p-8 border border-primary-lavender/10 shadow-glow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-900">Assessment Result</h3>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[24px] mb-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Risk Probability</p>
                  <h2 className="text-5xl font-heading font-bold text-gray-900">
                    {Math.round(result.risk_probability * 100)}%
                  </h2>
                  <span className={`mt-4 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                    result.risk_level === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' :
                    result.risk_level === 'MEDIUM' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {result.risk_level} RISK
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">Key Contributing Factors:</h4>
                  <ul className="space-y-2">
                    {result.top_shap_features?.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-lavender" />
                        <span className="font-bold text-gray-800">{feat.feature}</span>: {feat.shap_value > 0 ? 'Increased' : 'Decreased'} risk
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 bg-primary-lavender/5 rounded-2xl border border-primary-lavender/10 mt-6">
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                      {result.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center h-full">
                <div className="w-20 h-20 rounded-[24px] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">
                  <Sparkles size={40} />
                </div>
                <h4 className="text-xl font-heading font-bold text-gray-400">Ready for Assessment</h4>
                <p className="text-xs font-medium text-gray-400 mt-3 max-w-[240px] leading-relaxed">
                  Fill out the form to generate your AI-driven PCOS risk profile and see influencing factors.
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
