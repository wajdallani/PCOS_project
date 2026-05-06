import React, { useState, useEffect } from 'react';
import SidebarDoctor from './SidebarDoctor';
import PatientHeader from './PatientHeader';
import {
  RiskScoreHistoryCard,
  LastLabsCard,
  UltrasoundHistoryCard,
  TreatmentAdherenceCard,
} from './PatientClinicalCards';
import {
  DoctorActionsCard,
  PatientDailyLogsCard,
  PredictiveAITipCard,
} from './PatientSideCards';
import { ArrowLeft, Bell, Settings, Search } from 'lucide-react';

import { getPatientFullDetails } from '../../services/api';

export default function PatientMedicalDetails({ onNavigate, patientId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getPatientFullDetails(patientId);
      setData(res);
      setError(null);
    } catch (err) {
      console.error("Error fetching patient details:", err);
      setError("Failed to load patient information.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => console.log("Exporting PDF for", patientId);
  const handleStartTelehealth = () => console.log("Starting Telehealth for", patientId);
  const handlePredictRiskTrend = () => onNavigate('risk-prediction', { patientId });
  const handleAddTreatment = () => onNavigate('treatment-plan', { patientId });
  const handleSendRecommendation = () => console.log("Sending recommendation for", patientId);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-bg-color">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-lavender border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Patient Records...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-bg-color">
      <div className="bg-white p-8 rounded-[28px] border border-gray-100 shadow-soft text-center max-w-sm">
        <div className="w-16 h-16 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Settings size={32} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Error Occurred</h3>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button onClick={fetchData} className="px-6 py-2 bg-primary-lavender text-white rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-glow transition-all">Retry</button>
      </div>
    </div>
  );

  const { patient, lab_tests, ultrasounds, daily_logs, meal_logs, treatment_plans, model_runs } = data;

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <SidebarDoctor onNavigate={onNavigate} activePage="patients" />

      <div className="flex-1 ml-[230px] flex flex-col">
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-30 bg-bg-color/80 backdrop-blur-lg border-b border-gray-100 px-8 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('patients')}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary-lavender transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Patients
          </button>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center group">
              <Search className="absolute left-3.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 w-48 shadow-sm transition-all"
              />
            </div>
            <button className="relative p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm text-gray-500">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 border-2 border-white rounded-full"></span>
            </button>
            <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm text-gray-500">
              <Settings size={18} />
            </button>
            <div className="w-9 h-9 rounded-full border-2 border-primary-lavender/20 overflow-hidden cursor-pointer shadow-sm">
              <img src="/avatars/doctor.png" alt="Dr. Lina" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-8 sm:p-10">
          {/* Patient Header */}
          <PatientHeader
            patient={patient}
            onExportPDF={handleExportPDF}
            onStartTelehealth={handleStartTelehealth}
          />

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

            {/* Left / Main Column — 8/12 */}
            <div className="xl:col-span-8 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <RiskScoreHistoryCard modelRuns={model_runs} />
              <LastLabsCard labTests={lab_tests} />
              <UltrasoundHistoryCard ultrasounds={ultrasounds} />
              <TreatmentAdherenceCard dailyLogs={daily_logs} />
            </div>

            {/* Right Column — 4/12 */}
            <div className="xl:col-span-4 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <DoctorActionsCard
                onPredictRisk={handlePredictRiskTrend}
                onAddTreatment={handleAddTreatment}
                onSendRecommendation={handleSendRecommendation}
              />
              <PatientDailyLogsCard mealLogs={meal_logs} dailyLogs={daily_logs} />

            </div>
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
