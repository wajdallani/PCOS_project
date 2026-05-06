import React, { useState } from 'react';
import LoginCard from './components/LoginCard';
import SignupCard from './components/SignupCard';
import InfoCard from './components/InfoCard';
import RoleSelectionPage from './components/RoleSelectionPage';

import PatientProfileSetup from './components/patient-setup/PatientProfileSetup';
import DoctorProfileSetup from './components/doctor-setup/DoctorProfileSetup';
import PatientDashboard from './components/dashboard/PatientDashboard';
import CycleSymptomTracking from './components/cycle-tracking/CycleSymptomTracking';
import AcneAnalysis from './components/acne-analysis/AcneAnalysis';
import AcneAnalysisResults from './components/acne-analysis/AcneAnalysisResults';
import EmotionalRecognition from './components/emotional-recognition/EmotionalRecognition';
import TreatmentIntake from './components/treatment-intake/TreatmentIntake';
import MealScan from './components/nutrition/MealScan';
import DoctorDashboard from './components/doctor-dashboard/DoctorDashboard';
import PatientsList from './components/doctor-dashboard/PatientsList';
import PatientMedicalDetails from './components/doctor-dashboard/PatientMedicalDetails';
import PCOSRiskPrediction from './components/doctor-dashboard/PCOSRiskPrediction';
import TreatmentRecommendation from './components/doctor-dashboard/TreatmentRecommendation';
import PCOSPrediction from './components/pcos/PCOSPrediction';
import ProgressionPrediction from './components/pcos/ProgressionPrediction';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [analysisImage, setAnalysisImage] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleNavigate = (page, meta) => {
    if (page === 'patient-detail') {
      setSelectedPatientId(meta?.patientId ?? null);
    }
    setCurrentPage(page);
  };

  const handleLoginSuccess = (role, hasProfile) => {
    if (role === 'DOCTOR') {
      handleNavigate(hasProfile ? 'doctor-dashboard' : 'doctor-setup');
    } else {
      handleNavigate(hasProfile ? 'patient-dashboard' : 'patient-setup');
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    handleNavigate('signup');
  };

  const handleSignupSuccess = (role) => {
    if (role === 'doctor') handleNavigate('doctor-setup');
    else handleNavigate('patient-setup');
  };

  if (currentPage === 'role-selection') {
    return <RoleSelectionPage onBackToLogin={() => handleNavigate('login')} onSelectRole={handleRoleSelect} />;
  }

  if (currentPage === 'signup') {
    return (
      <div className="min-h-screen w-full bg-bg-color flex items-center justify-center p-4">
        <SignupCard 
          selectedRole={selectedRole} 
          onBackToLogin={() => handleNavigate('login')}
          onSignupSuccess={handleSignupSuccess}
        />
      </div>
    );
  }

  if (currentPage === 'patient-setup') {
    return <PatientProfileSetup onComplete={() => handleNavigate('patient-dashboard')} />;
  }

  if (currentPage === 'doctor-setup') {
    return <DoctorProfileSetup onComplete={() => handleNavigate('doctor-dashboard')} />;
  }

  if (currentPage === 'doctor-dashboard') {
    return <DoctorDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === 'patients') {
    return <PatientsList onNavigate={handleNavigate} />;
  }

  if (currentPage === 'patient-detail') {
    return <PatientMedicalDetails onNavigate={handleNavigate} patientId={selectedPatientId} />;
  }

  if (currentPage === 'risk-prediction' || currentPage === 'risk-analysis') {
    return <PCOSRiskPrediction onNavigate={handleNavigate} patientId={selectedPatientId} />;
  }

  if (currentPage === 'treatment-plan' || currentPage === 'doctor-treatments') {
    return <TreatmentRecommendation onNavigate={handleNavigate} patientId={selectedPatientId} />;
  }

  if (currentPage === 'monitoring') {
    return <PatientsList onNavigate={handleNavigate} />;
  }

  if (currentPage === 'patient-dashboard') {
    return <PatientDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === 'cycle-tracking') {
    return <CycleSymptomTracking onNavigate={handleNavigate} />;
  }

  if (currentPage === 'acne-analysis') {
    return <AcneAnalysis onNavigate={handleNavigate} onAnalysisComplete={(img) => {
      setAnalysisImage(img);
      handleNavigate('acne-analysis-results');
    }} />;
  }

  if (currentPage === 'acne-analysis-results') {
    const img = typeof analysisImage === 'string' ? analysisImage : analysisImage?.image;
    const results = typeof analysisImage === 'object' ? analysisImage?.results : null;
    const faceImg = results?.face_image;

    const severityMap = { 0: 10, 1: 35, 2: 75, 3: 95 };
    const sev = faceImg ? severityMap[faceImg.acne_level] : undefined;

    return (
      <AcneAnalysisResults 
        onNavigate={handleNavigate} 
        image={img} 
        severity={sev}
        label={faceImg?.acne_label || undefined}
      />
    );
  }

  if (currentPage === 'emotional-recognition') {
    return <EmotionalRecognition onNavigate={handleNavigate} />;
  }

  if (currentPage === 'pcos-prediction') {
    return <PCOSPrediction onNavigate={handleNavigate} />;
  }

  if (currentPage === 'progression') {
    return <ProgressionPrediction onNavigate={handleNavigate} />;
  }

  if (currentPage === 'treatments') {
    return <TreatmentIntake onNavigate={handleNavigate} />;
  }

  if (currentPage === 'nutrition') {
    return <MealScan onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-bg-color flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* Background Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-soft-pink/40 to-primary-lavender/30 blur-3xl opacity-60 animate-blob pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-primary-lavender/30 to-deep-lavender/20 blur-3xl opacity-50 animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Main Content Area */}
      <div className="w-full max-w-md relative z-30 flex flex-col justify-center min-h-[80vh]">
        <LoginCard onCreateAccount={() => handleNavigate('role-selection')} onLoginSuccess={handleLoginSuccess} />
        <InfoCard />
      </div>

    </div>
  );
}

export default App;
