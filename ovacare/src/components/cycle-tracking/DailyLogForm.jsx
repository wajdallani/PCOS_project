import React, { useState } from 'react';
import {
  Smile, UserRound, ScanFace, UserRoundCheck, HeartPulse, CircleDot, MoveUp, Hand,
  Brain, Scan, Moon, Scale, Trash2, Check, Zap, Info, Droplets, User, Scissors, 
  TrendingUp, Dumbbell, Flower2, Timer, Footprints, Wind, Coffee, PersonStanding,
  X, Upload, Camera, AlertTriangle, Utensils
} from 'lucide-react';
import MoodSelector from './MoodSelector';
import AIFeatureButton from './AIFeatureButton';
import { predictAcneIntegrated, predictPCOSIntegrated } from '../../services/api';

export default function DailyLogForm({ onNavigate }) {
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [periodFlow, setPeriodFlow] = useState('None');
  const [exercise, setExercise] = useState([]);
  const [weight, setWeight] = useState('64.2');
  const [sleep, setSleep] = useState('7.5');
  const [isSkinDarkening, setIsSkinDarkening] = useState('No');
  const [isHairLoss, setIsHairLoss] = useState('No');
  const [fastFood, setFastFood] = useState('No');
  const [isHirsutism, setIsHirsutism] = useState(false);
  
  // New states for Acne Modal
  const [isAcneModalOpen, setIsAcneModalOpen] = useState(false);
  const [isAnalyzingAcne, setIsAnalyzingAcne] = useState(false);
  const [acneResult, setAcneResult] = useState(null);
  
  // New states for PCOS Risk
  const [pcosResult, setPcosResult] = useState(null);
  const [isCalculatingPCOS, setIsCalculatingPCOS] = useState(false);

  const flows = [
    { label: 'None', icon: Coffee, color: 'from-gray-100 to-gray-200' },
    { label: 'Light', icon: Droplets, color: 'from-pink-100 to-soft-pink' },
    { label: 'Medium', icon: Droplets, color: 'from-soft-pink to-pink-400' },
    { label: 'Heavy', icon: Droplets, color: 'from-pink-400 to-red-400' },
    { label: 'Super Heavy', icon: Droplets, color: 'from-red-400 to-red-600' }
  ];

  const exercises = [
    { id: 'Running', icon: Footprints, label: 'Running' },
    { id: 'Swimming', icon: Wind, label: 'Swimming' },
    { id: 'Yoga', icon: Flower2, label: 'Yoga' },
    { id: 'Walk', icon: PersonStanding, label: 'Walk' },
    { id: 'Rest Day', icon: Coffee, label: 'Rest Day' },
    { id: 'Pilates', icon: Timer, label: 'Pilates' }
  ];
  const unwantedHairPlaces = [
    { id: 'Upper Lip', icon: Smile, label: 'Upper Lip' },
    { id: 'Chin', icon: UserRound, label: 'Chin' },
    { id: 'Jawline', icon: ScanFace, label: 'Jawline' },
    { id: 'Neck', icon: UserRoundCheck, label: 'Neck' },
    { id: 'Chest', icon: HeartPulse, label: 'Chest' },
    { id: 'Abdomen', icon: CircleDot, label: 'Abdomen' },
    { id: 'Back', icon: MoveUp, label: 'Back' },
    { id: 'Arms', icon: Hand, label: 'Arms' },
    { id: 'Thighs', icon: Footprints, label: 'Thighs' }
  ];

  const toggleExercise = (exId) => {
    setExercise(prev => prev.includes(exId) ? prev.filter(i => i !== exId) : [...prev, exId]);
  };
  const [selectedHairPlaces, setSelectedHairPlaces] = useState([]);

  const toggleHairPlace = (placeId) => {
    setSelectedHairPlaces((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  const handleAcneUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzingAcne(true);
    setAcneResult(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1];
        const result = await predictAcneIntegrated(base64);
        setAcneResult(result);
        setIsAnalyzingAcne(false);
      };
    } catch (err) {
      console.error("Acne analysis failed:", err);
      setIsAnalyzingAcne(false);
    }
  };

  const handleSaveEntry = async () => {
    setIsCalculatingPCOS(true);
    try {
      // Map current form state to PCOS 10-feature model
      const symptomData = {
        cycle_r_i: ['Heavy', 'Super Heavy'].includes(periodFlow) ? 4 : 2,
        hair_growth_y_n: selectedHairPlaces.length > 0 ? 1 : 0,
        skin_darkening_y_n: isSkinDarkening === 'Yes' ? 1 : 0,
        pimples_y_n: (acneResult && acneResult.severity_level > 1) ? 1 : 0, // Derive from acne if analyzed
        hair_loss_y_n: isHairLoss === 'Yes' ? 1 : 0,
        weight_gain_y_n: parseFloat(weight) > 65 ? 1 : 0, // Simple heuristic for demo
        fast_food_y_n: fastFood === 'Yes' ? 1 : 0,
        'reg.exercise_y_n': (exercise.length > 0 && !exercise.includes('Rest Day')) ? 1 : 0,
        bmi: 22.5, // Should ideally come from profile
        age_yrs: 24 // Should ideally come from profile
      };

      const result = await predictPCOSIntegrated(symptomData);
      setPcosResult(result);
    } catch (err) {
      console.error("PCOS prediction failed:", err);
    } finally {
      setIsCalculatingPCOS(false);
    }
  };
  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-soft">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-heading font-bold text-gray-900">Daily Log: May 13</h3>
        <button className="text-xs font-bold text-red-400 hover:text-red-500 flex items-center gap-1 uppercase tracking-widest transition-colors">
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />

      {/* AI Features Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <AIFeatureButton
          label="Emotional Recognition"
          text="Analyze your mood using voice or facial cues"
          icon={Brain}
          variant="primary"
          onClick={() => onNavigate && onNavigate('emotional-recognition')}
        />
        <AIFeatureButton
          label="Acne Monitoring"
          text="Scan skin changes and track acne patterns"
          icon={Scan}
          variant="secondary"
          onClick={() => setIsAcneModalOpen(true)}
        />
      </div>

      {/* Symptoms Grid */}
      <div className="space-y-8">
        {/* Period Flow */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Period Flow</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {flows.map(flow => {
              const isSelected = periodFlow === flow.label;
              return (
                <button
                  key={flow.label}
                  onClick={() => setPeriodFlow(flow.label)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 border-2 group ${isSelected
                    ? 'border-soft-pink bg-soft-pink/10 shadow-md scale-105'
                    : 'border-gray-50 bg-gray-50/50 hover:border-soft-pink/30 hover:bg-white'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 ${isSelected ? `bg-gradient-to-br ${flow.color} text-white shadow-glow` : 'bg-white text-gray-300'
                    }`}>
                    <flow.icon size={20} className={isSelected ? 'drop-shadow-md' : ''} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-tight ${isSelected ? 'text-soft-pink' : 'text-gray-400'}`}>
                    {flow.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hair & Hirsutism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">Hair Changes</label>
            <div className="flex gap-3">
              {[
                { label: 'None', icon: User },
                { label: 'Loss', icon: Scissors },
                { label: 'Growth', icon: TrendingUp }
              ].map(type => {
                const isSelected = hairType === type.label;
                return (
                  <button
                    key={type.label}
                    onClick={() => setHairType(type.label)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 group ${
                      isSelected 
                        ? 'border-primary-lavender bg-primary-lavender/10 shadow-md scale-105' 
                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-primary-lavender/30 hover:bg-white'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isSelected ? 'bg-primary-lavender text-white shadow-glow' : 'bg-white text-gray-200'
                    }`}>
                      <type.icon size={18} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-deep-lavender' : 'text-gray-400'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary-lavender transition-transform duration-300 group-hover:rotate-6">
                <Scissors size={24} />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-700">Excess Hair Growth</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-tight">Track hirsutism patterns</span>
              </div>
            </div>
            <button 
              onClick={() => setIsHirsutism(!isHirsutism)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isHirsutism ? 'bg-primary-lavender shadow-glow' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isHirsutism ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div> */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender">
                <Zap size={18} />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-700">Skin Darkening</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-tight">Acanthosis nigricans detection</span>
              </div>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['No', 'Yes'].map(choice => (
                <button
                  key={choice}
                  onClick={() => setIsSkinDarkening(choice)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isSkinDarkening === choice
                    ? 'bg-white text-primary-lavender shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender">
                <Scissors size={24} />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-700">Hair Loss</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-tight">Hair is falling out faster than usual</span>
              </div>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['No', 'Yes'].map(choice => (
                <button
                  key={choice}
                  onClick={() => setIsHairLoss(choice)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isHairLoss === choice
                    ? 'bg-white text-primary-lavender shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender">
                <Utensils size={18} />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-700">Frequent Fast Food</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-tight">Oily food impact on hormones</span>
              </div>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['No', 'Yes'].map(choice => (
                <button
                  key={choice}
                  onClick={() => setFastFood(choice)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${fastFood === choice
                    ? 'bg-white text-primary-lavender shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Body hair growth */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Body hair growth</label>
          <div className="flex flex-wrap gap-4">
            {unwantedHairPlaces.map((place) => {
              const isSelected = selectedHairPlaces.includes(place.id);
              const Icon = place.icon;

              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => toggleHairPlace(place.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 border-2 group ${isSelected
                    ? 'border-deep-lavender bg-deep-lavender text-white shadow-lg scale-105'
                    : 'border-gray-100 bg-white text-gray-500 hover:border-primary-lavender/30'
                    }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${isSelected
                      ? 'bg-white/20'
                      : 'bg-gray-50 group-hover:bg-primary-lavender/10 group-hover:text-primary-lavender'
                      }`}
                  >
                    <Icon size={18} />
                  </div>

                  <span className="text-xs font-bold tracking-wide">
                    {place.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Exercise Chips */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Movement & Exercise</label>
          <div className="flex flex-wrap gap-4">
            {exercises.map(ex => {
              const isSelected = exercise.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 border-2 group ${isSelected
                    ? 'border-deep-lavender bg-deep-lavender text-white shadow-lg scale-105'
                    : 'border-gray-100 bg-white text-gray-500 hover:border-primary-lavender/30'
                    }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-primary-lavender/10 group-hover:text-primary-lavender'}`}>
                    <ex.icon size={18} />
                  </div>
                  <span className="text-xs font-bold tracking-wide">{ex.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Sleep Quality</label>
            <div className="relative flex items-center">
              <Moon className="absolute left-4 text-primary-lavender" size={18} />
              <input
                type="text"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-primary-lavender/30"
              />
              <span className="absolute right-4 text-xs font-bold text-gray-400 uppercase tracking-tighter">Hrs</span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Weight</label>
            <div className="relative flex items-center">
              <Scale className="absolute left-4 text-primary-lavender" size={18} />
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-primary-lavender/30"
              />
              <span className="absolute right-4 text-xs font-bold text-gray-400 uppercase tracking-tighter">Kg</span>
            </div>
          </div>
        </div>



        {/* Save Button */}
        <button 
          onClick={handleSaveEntry}
          disabled={isCalculatingPCOS}
          className="w-full py-4 rounded-[20px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold tracking-widest uppercase text-sm shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isCalculatingPCOS ? 'Syncing with AI...' : 'Save Daily Entry'} <Check size={20} />
        </button>

        {/* PCOS Result Display */}
        {pcosResult && (
          <div className="mt-8 p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-primary-lavender/20 shadow-glow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-lavender/10 text-primary-lavender rounded-lg">
                  <TrendingUp size={16} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">PCOS Risk Assessment</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                pcosResult.risk_level === 'HIGH' ? 'bg-red-50 text-red-600' :
                pcosResult.risk_level === 'MEDIUM' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
              }`}>
                {pcosResult.risk_level} Risk
              </span>
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-heading font-bold text-gray-900">{Math.round(pcosResult.risk_probability * 100)}%</span>
              <span className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-widest">Probability</span>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Insights</p>
              <div className="flex flex-wrap gap-2">
                {pcosResult.top_shap_features?.map((feat, i) => (
                  <div key={i} className="px-3 py-1.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600 flex items-center gap-1.5 shadow-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${feat.shap_value > 0 ? 'bg-red-400' : 'bg-green-400'}`} />
                    {feat.feature.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acne Monitoring Modal */}
      {isAcneModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsAcneModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-lavender/10 flex items-center justify-center text-primary-lavender">
                  <Scan size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-gray-900">Acne Analysis</h3>
                  <p className="text-xs font-medium text-gray-400">AI-powered skin scan</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAcneModalOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 pt-4">
              {!acneResult ? (
                <div className="space-y-6">
                  <div className="aspect-video bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 group hover:border-primary-lavender/50 transition-all relative overflow-hidden">
                    {isAnalyzingAcne ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-4 border-primary-lavender/20 border-t-primary-lavender animate-spin" />
                        <p className="text-sm font-bold text-primary-lavender animate-pulse uppercase tracking-widest">Scanning Skin...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-300 group-hover:text-primary-lavender transition-all">
                          <Upload size={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-700">Upload Facial Photo</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-1">PNG or JPG, max 5MB</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAcneUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex gap-3">
                      <AlertTriangle className="text-orange-400 shrink-0" size={18} />
                      <p className="text-[10px] font-medium text-orange-700 leading-relaxed">
                        Ensure bright, direct lighting and avoid wearing makeup for the most accurate results.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="bg-gray-50 rounded-[32px] p-8 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Severity Score</p>
                    <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200" />
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                          strokeDasharray={251} strokeDashoffset={251 - (251 * (acneResult.severity_level + 1)) / 4}
                          className="text-primary-lavender transition-all duration-1000" 
                        />
                      </svg>
                      <span className="absolute text-2xl font-heading font-bold text-gray-900">{acneResult.severity_level}</span>
                    </div>
                    <h4 className="text-2xl font-heading font-bold text-gray-900">{acneResult.severity_name}</h4>
                    <p className="text-xs font-bold text-primary-lavender mt-2 uppercase tracking-widest">
                      {Math.round(acneResult.confidence * 100)}% Confidence
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-primary-lavender rounded-full" />
                      <h5 className="text-sm font-bold text-gray-900">AI Recommendations</h5>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {acneResult.recommendations?.map((rec, i) => (
                        <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-start gap-3 shadow-sm">
                          <div className="w-6 h-6 rounded-lg bg-green-50 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={14} />
                          </div>
                          <p className="text-xs font-medium text-gray-600 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => { setAcneResult(null); setIsAcneModalOpen(false); }}
                    className="w-full py-4 rounded-[20px] bg-gray-900 text-white font-bold tracking-widest uppercase text-sm shadow-lg hover:bg-gray-800 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
