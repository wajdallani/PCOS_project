import React, { useState, useEffect } from 'react';
import SidebarDoctor from './SidebarDoctor';
import PredictionStepper from './PredictionStepper';
import LabOCRCard from './LabOCRCard';
import HormonalSymptomEntry from './HormonalSymptomEntry';
import UltrasoundAnalysisCard from './UltrasoundAnalysisCard';
import GradCAMPreviewCard from './GradCAMPreviewCard';
import PatientMedicalRecordsCard from './PatientMedicalRecordsCard';
import RiskPredictionCard from './RiskPredictionCard';
import InfluencingFactorsCard from './InfluencingFactorsCard';
import FloatingChatButton from '../dashboard/FloatingChatButton';
import {
  getPatientById,
  uploadUltrasoundImage,
  saveLabTestFromRiskPage,
  saveUltrasoundFromRiskPage,
  segmentUltrasound,
  saveSegmentation,
  predictFullPCOS
} from '../../services/api';
import { ArrowLeft, Bell, Settings, Search, Sparkles, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function PCOSRiskPrediction({ onNavigate, patientId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  // Selection IDs
  const [selectedLabTestId, setSelectedLabTestId] = useState(null);
  const [selectedDailyLogId, setSelectedDailyLogId] = useState(null);
  const [currentUltrasoundId, setCurrentUltrasoundId] = useState(null);

  // Results
  const [leftSegmentation, setLeftSegmentation] = useState(null);
  const [rightSegmentation, setRightSegmentation] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  const [formData, setFormData] = useState({
    lh: '',
    fsh: '',
    amh: '',
    vitamin_d3: '',
    insulin: '',
    glucose: '',
    testosterone: '',
    fsh_lh_ratio: '',
    lh_fsh_ratio: ''
  });

  const [symptoms, setSymptoms] = useState(['irregular_cycle', 'acne_oily_skin']);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      if (!patientId) return;
      const data = await getPatientById(patientId);
      setPatient(data);

      // Auto-select latest daily log if available
      if (data.daily_logs && data.daily_logs.length > 0) {
        setSelectedDailyLogId(data.daily_logs[0].id);
      }
    } catch (err) {
      console.error("Error fetching patient:", err);
    }
  };

  const handleInputChange = async (field, value) => {
    if (field === 'save_lab') {
      await handleSaveLab();
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveLab = async () => {
    try {
      setStatusMessage("Saving lab test...");
      const payload = {
        patient_id: parseInt(patientId),
        test_date: new Date().toISOString().split('T')[0],
        fsh: parseFloat(formData.fsh) || null,
        lh: parseFloat(formData.lh) || null,
        fsh_lh_ratio: parseFloat(formData.fsh_lh_ratio) || null,
        lh_fsh_ratio: parseFloat(formData.lh_fsh_ratio) || null,
        amh: parseFloat(formData.amh) || null,
        vitamin_d3: parseFloat(formData.vitamin_d3) || null,
        fasting_glucose: parseFloat(formData.glucose) || null,
        insulin: parseFloat(formData.insulin) || null
      };
      const result = await saveLabTestFromRiskPage(payload);
      setSelectedLabTestId(result.id);
      setStatusMessage("Lab test saved.");
      setActiveStep(2);
    } catch (err) {
      setError("Error saving lab test: " + err.message);
    } finally {
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleSaveUltrasound = async (urls, files) => {
    try {
      setIsSegmenting(true);
      setError(null);
      setStatusMessage("Initializing ultrasound record...");

      // 1. Create Ultrasound Record
      const usRecord = await saveUltrasoundFromRiskPage({
        patient_id: parseInt(patientId),
        ultrasound_date: new Date().toISOString().split('T')[0],
        left_image_url: urls.left,
        right_image_url: urls.right
      });
      setCurrentUltrasoundId(usRecord.id);

      // 2. Process Left Image
      if (files.left) {
        setStatusMessage("Segmenting left ovary...");
        const seg = await segmentUltrasound(files.left);
        setLeftSegmentation(seg);

        setStatusMessage("Saving left follicles...");
        await saveSegmentation({
          ultrasound_id: usRecord.id,
          side: 'left',
          mask_url: seg.mask_url,
          overlay_url: seg.overlay_url,
          follicle_count: seg.follicle_count
        });
      }

      // 3. Process Right Image
      if (files.right) {
        setStatusMessage("Segmenting right ovary...");
        const seg = await segmentUltrasound(files.right);
        setRightSegmentation(seg);

        setStatusMessage("Saving right follicles...");
        await saveSegmentation({
          ultrasound_id: usRecord.id,
          side: 'right',
          mask_url: seg.mask_url,
          overlay_url: seg.overlay_url,
          follicle_count: seg.follicle_count
        });
      }

      setStatusMessage("Ultrasound data saved successfully.");
      setActiveStep(3);
    } catch (err) {
      setError("Segmentation failed: " + err.message);
    } finally {
      setIsSegmenting(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const handleStartPrediction = async () => {
    if (!selectedLabTestId || !currentUltrasoundId) {
      setPredictionError("Please save Lab Tests and Ultrasound analysis before predicting.");
      return;
    }

    setIsPredicting(true);
    setPredictionError(null);
    setPredictionResult(null);
    setStatusMessage("Predicting risk...");

    try {
      const data = await predictFullPCOS({
        patient_id: parseInt(patientId),
        lab_test_id: selectedLabTestId,
        daily_log_id: selectedDailyLogId || 1,
        ultrasound_id: currentUltrasoundId
      });

      console.log("PCOS prediction response:", data);
      setPredictionResult(data);
      setShowResults(true);
      setActiveStep(3);
    } catch (err) {
      console.error("Prediction error:", err);
      setPredictionError(err.message || "An unexpected error occurred during prediction.");
    } finally {
      setIsPredicting(false);
      setStatusMessage('');
    }
  };

  const handleSymptomToggle = (id) => {
    setSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAutoFill = (extracted) => {
    if (!extracted) return;
    setFormData(prev => ({
      ...prev,
      lh: extracted.lh?.toString() || prev.lh,
      fsh: extracted.fsh?.toString() || prev.fsh,
      insulin: extracted.insulin?.toString() || prev.insulin,
      glucose: extracted.fasting_glucose?.toString() || prev.glucose,
      fsh_lh_ratio: extracted.fsh_lh_ratio?.toString() || prev.fsh_lh_ratio,
      lh_fsh_ratio: extracted.lh_fsh_ratio?.toString() || prev.lh_fsh_ratio,
      amh: extracted.amh?.toString() || prev.amh,
      vitamin_d3: extracted.vitamin_d3?.toString() || prev.vitamin_d3
    }));
  };

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <SidebarDoctor onNavigate={onNavigate} activePage="patients" />

      <div className="flex-1 ml-[230px] flex flex-col">
        <header className="sticky top-0 z-30 bg-bg-color/80 backdrop-blur-lg border-b border-gray-100 px-8 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('patient-detail', { patientId })}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary-lavender transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Profile
          </button>

          {statusMessage && (
            <div className="flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-primary-lavender/20 shadow-glow-sm animate-fade-in">
              <div className="w-2 h-2 bg-primary-lavender rounded-full animate-ping" />
              <p className="text-[10px] font-black text-primary-lavender uppercase tracking-widest">{statusMessage}</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-500">
              <Bell size={18} />
            </button>
            <div className="w-9 h-9 rounded-full border-2 border-primary-lavender/20 overflow-hidden shadow-sm">
              <img src="/avatars/doctor.png" alt="Doctor" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 animate-fade-in">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">AI Risk Prediction</h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Patient: <span className="text-gray-900">{patient?.user?.username || "Loading..."}</span></p>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: <span className="text-gray-900">#OVA-{patientId}</span></p>
              </div>
            </div>
            <PredictionStepper activeStep={activeStep} />
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7 space-y-8">
              <LabOCRCard onAutoFill={handleAutoFill} />

              <HormonalSymptomEntry
                data={formData}
                symptoms={symptoms}
                onInputChange={handleInputChange}
                onSymptomToggle={handleSymptomToggle}
                isSaved={!!selectedLabTestId}
              />

              <UltrasoundAnalysisCard
                onUpload={async (file) => await uploadUltrasoundImage(file)}
                onSave={handleSaveUltrasound}
                leftResult={leftSegmentation}
                rightResult={rightSegmentation}
                isSegmenting={isSegmenting}
                statusMessage={statusMessage}
              />


              <div className="flex flex-col items-center gap-4 py-6">
                <button
                  onClick={handleStartPrediction}
                  disabled={isPredicting}
                  className="group relative flex items-center gap-4 px-12 py-6 rounded-[24px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold uppercase tracking-widest text-sm shadow-glow hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-500 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
                >
                  {isPredicting ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                      Start AI Prediction
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  <div className="absolute inset-0 rounded-[24px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                </button>

                {predictionError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 animate-shake">
                    <AlertCircle className="text-red-500" size={16} />
                    <p className="text-xs font-bold text-red-700">{predictionError}</p>
                  </div>
                )}

                {predictionResult && predictionResult.predictions && (
                  <div className="w-full mt-8 p-8 bg-white rounded-[32px] border border-primary-lavender/10 shadow-glow-sm animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender">
                          <CheckCircle2 size={18} />
                        </div>
                        <h4 className="text-lg font-heading font-bold text-gray-900">Analysis Complete</h4>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Run ID: {predictionResult.model_run_id}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">PCOS Risk Score</p>
                        <h2 className="text-4xl font-heading font-bold text-gray-900">
                          {((predictionResult.predictions.final_risk || 0) * 100).toFixed(1)}%
                        </h2>
                        <span className={`mt-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${predictionResult.predictions.risk_level === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                          predictionResult.predictions.risk_level === 'Moderate' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            'bg-green-50 text-green-600 border-green-100'
                          }`}>
                          {predictionResult.predictions.risk_level || 'Unknown'} Risk
                        </span>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-inner-soft">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tabular Probability</p>
                            <p className="text-sm font-bold text-blue-600">{Math.round((predictionResult.predictions.p_tabular || 0) * 100)}%</p>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${(predictionResult.predictions.p_tabular || 0) * 100}%` }} />
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-inner-soft">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image Probability</p>
                            <p className="text-sm font-bold text-purple-600">{Math.round((predictionResult.predictions.p_image || 0) * 100)}%</p>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${(predictionResult.predictions.p_image || 0) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!currentUltrasoundId && (
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Complete steps above to unlock prediction</p>
                )}
              </div>
            </div>

            <div className="xl:col-span-5 space-y-8">
              <PatientMedicalRecordsCard
                onUseRecord={(record) => {
                  if (record.type === 'lab') setSelectedLabTestId(record.id);
                  if (record.type === 'ultrasound') setCurrentUltrasoundId(record.id);
                }}
              />

              {showResults && predictionResult && (
                <>
                  <RiskPredictionCard result={predictionResult} />
                  <InfluencingFactorsCard />
                </>
              )}

              {!showResults && !isPredicting && (
                <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-[24px] bg-gray-50 flex items-center justify-center text-gray-200 mb-6 group-hover:bg-primary-lavender/5 transition-colors">
                    <Sparkles size={40} />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-gray-400">Diagnostic Readiness</h4>
                  <p className="text-xs font-medium text-gray-400 mt-3 max-w-[240px] leading-relaxed">
                    Once clinical features and scans are processed, the AI Multimodal engine will generate a full risk profile.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="h-20" />
        </main>
      </div>
      <FloatingChatButton />
    </div>
  );
}
