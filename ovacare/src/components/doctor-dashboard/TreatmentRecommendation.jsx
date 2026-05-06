import React, { useState, useEffect } from 'react';
import SidebarDoctor from './SidebarDoctor';
import HeaderActions from './HeaderActions';
import TreatmentPredictionCard from './TreatmentPredictionCard';
import MedicationProtocolCard from './MedicationProtocolCard';
import AIAnalysisCard from './AIAnalysisCard';
import PatientSafetyCard from './PatientSafetyCard';
import FloatingChatButton from '../dashboard/FloatingChatButton';
import { ArrowLeft, Bell, Settings, Search, ChevronRight } from 'lucide-react';

import { getTreatmentInputs, saveTreatmentResponseRun } from '../../services/api';

export default function TreatmentRecommendation({ onNavigate, patientId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState('METFORMIN');
  const [isPredicting, setIsPredicting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState(null);
  const [featureValues, setFeatureValues] = useState({
    'FSH/LH': '',
    'FSHmIU/mL': '',
    'LHmIU/mL': '',
    'AMHng/mL': '',
    'BMI': '',
    'RBSmg/dl': '',
    'Follicle_No._L': '',
    'Follicle_No._R': ''
  });
  const [predictionSaved, setPredictionSaved] = useState(false);
  const [treatmentPrediction, setTreatmentPrediction] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchInputs();
  }, [patientId]);

  const fetchInputs = async () => {
    try {
      setLoading(true);
      const res = await getTreatmentInputs(patientId);
      setPatientInfo(res);
      setFeatureValues({
        'FSH/LH': res['FSH/LH'] || '',
        'FSHmIU/mL': res['FSHmIU/mL'] || '',
        'LHmIU/mL': res['LHmIU/mL'] || '',
        'AMHng/mL': res['AMHng/mL'] || '',
        'BMI': res['BMI'] || '',
        'RBSmg/dl': res['RBSmg/dl'] || '',
        'Follicle_No._L': res['Follicle_No._L'] || '',
        'Follicle_No._R': res['Follicle_No._R'] || ''
      });
    } catch (err) {
      console.error("Error fetching treatment inputs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (key, value) => {
    setFeatureValues(prev => ({ ...prev, [key]: value }));
  };

  const handlePredictTreatmentResponse = async () => {
    setIsPredicting(true);
    try {
      const payload = {
        patient_id: parseInt(patientId),
        ...featureValues
      };
      // Convert numeric fields
      Object.keys(featureValues).forEach(key => {
        if (payload[key] !== '') {
          payload[key] = parseFloat(payload[key]);
        } else {
          payload[key] = null;
        }
      });

      const result = await saveTreatmentResponseRun(payload);
      setPredictionSaved(true);
      setTreatmentPrediction(result.prediction || result.output_data || result);

      // Artificial delay to show animation
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err) {
      console.error("Error saving treatment response run:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSaveDraft = () => {
    console.log("Saving draft for", patientId);
  };

  const handleFinalizeAndSend = () => {
    console.log("Finalizing and sending treatment plan for", patientId);
    onNavigate('patient-detail', { patientId });
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-bg-color">
      <div className="w-12 h-12 border-4 border-primary-lavender border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <SidebarDoctor onNavigate={onNavigate} activePage="patients" />

      <div className="flex-1 ml-[230px] flex flex-col">
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-30 bg-bg-color/80 backdrop-blur-lg border-b border-gray-100 px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('patient-detail', { patientId })}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary-lavender transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>Patients</span>
              <ChevronRight size={10} />
              <span className="text-primary-lavender">{patientInfo?.username || "Patient"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center group">
              <Search className="absolute left-3.5 text-gray-400 group-hover:text-primary-lavender transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search protocols..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 w-48 shadow-sm transition-all"
              />
            </div>
            <button className="relative p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-500">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 border-2 border-white rounded-full"></span>
            </button>
            <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-500">
              <Settings size={18} />
            </button>
            <div className="w-9 h-9 rounded-full border-2 border-primary-lavender/20 overflow-hidden cursor-pointer shadow-sm">
              <img src="/avatars/doctor.png" alt="Dr. Lina" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 sm:p-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 animate-fade-in">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">Recommend Treatment Plan for {patientInfo?.username || "Patient"}</h1>
              <p className="text-gray-500 font-medium mt-2 leading-relaxed">
                Tailor a comprehensive management plan including medical intervention, lifestyle shifts, and nutritional guidance based on her latest hormonal profile.
              </p>
            </div>
            <HeaderActions onSaveDraft={handleSaveDraft} onFinalize={handleFinalizeAndSend} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - AI Prediction & Medication */}
            <div className="xl:col-span-7 space-y-8">
              <TreatmentPredictionCard
                selectedTreatment={selectedTreatment}
                onTreatmentSelect={setSelectedTreatment}
                onPredict={handlePredictTreatmentResponse}
                isPredicting={isPredicting}
                values={featureValues}
                onChange={handleFeatureChange}
              />
              <MedicationProtocolCard prediction={treatmentPrediction} />
            </div>

            {/* Right Column - Analysis & Safety */}
            <div className="xl:col-span-5 space-y-8">
              <AIAnalysisCard isPredicting={isPredicting} predictionSaved={predictionSaved} prediction={treatmentPrediction} />
              <PatientSafetyCard />

              {/* Optional: Add a clinical note area */}
              <div className="bg-white rounded-[28px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Clinical Notes (Internal Only)</h4>
                <textarea
                  rows="3"
                  placeholder="Add private notes about this recommendation..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="h-20" />
        </main>
      </div>
      <FloatingChatButton />
    </div>
  );
}
