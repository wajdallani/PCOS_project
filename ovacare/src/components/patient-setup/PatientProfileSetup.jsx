import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowLeft, Check, Activity, Scale, Ruler } from 'lucide-react';
import StepProgress from '../shared/StepProgress';
import FormInput from '../shared/FormInput';
import SelectInput from '../shared/SelectInput';
import MetricResultCard from './MetricResultCard';
import AssistantInsightCard from '../shared/AssistantInsightCard';
import ReviewCard from '../shared/ReviewCard';
import ProfileImageUpload from '../shared/ProfileImageUpload';

import { setupPatientProfile, getMe } from '../../services/api';

export default function PatientProfileSetup({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    age_yrs: '',
    weight_kg: '',
    height_cm: '',
    bmi: '',
    hip_inch: '',
    waist_inch: '',
    waist_hip_ratio: '',
    marriage_status_yrs: '',
    pregnant_y_n: '',
    no_of_abortions: ''
  });

  useEffect(() => {
    setIsVisible(true);
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await getMe();
      setFormData(prev => ({
        ...prev,
        username: user.username,
        email: user.email
      }));
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Live Calculations
  useEffect(() => {
    const { weight_kg, height_cm, waist_inch, hip_inch } = formData;

    let updates = {};

    // BMI Calculation
    if (weight_kg && height_cm) {
      const w = parseFloat(weight_kg);
      const h = parseFloat(height_cm) / 100;
      if (h > 0) {
        const bmi = (w / (h * h)).toFixed(1);
        updates.bmi = bmi;
      }
    } else {
      updates.bmi = '';
    }

    // Waist-Hip Ratio Calculation
    if (waist_inch && hip_inch) {
      const waist = parseFloat(waist_inch);
      const hip = parseFloat(hip_inch);
      if (hip > 0) {
        const whr = (waist / hip).toFixed(2);
        updates.waist_hip_ratio = whr;
      }
    } else {
      updates.waist_hip_ratio = '';
    }

    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({ ...prev, ...updates }));
    }
  }, [formData.weight_kg, formData.height_cm, formData.waist_inch, formData.hip_inch]);

  const getBmiCategory = (bmiStr) => {
    if (!bmiStr) return null;
    const bmi = parseFloat(bmiStr);
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi <= 24.9) return "Normal";
    if (bmi >= 25 && bmi <= 29.9) return "Overweight";
    return "Obese";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.username) newErrors.username = "Username is required";
      if (!formData.email) newErrors.email = "Email is required";
      // if (!formData.password) newErrors.password = "Password is required";
      // if (formData.password !== formData.confirm_password) {
      //   newErrors.confirm_password = "Passwords do not match";
      // }
    }
    if (step === 2) {
      if (!formData.age_yrs) newErrors.age_yrs = "Age is required";
      if (!formData.weight_kg) newErrors.weight_kg = "Weight is required";
      if (!formData.height_cm) newErrors.height_cm = "Height is required";
      // Additional validations can be added here
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await setupPatientProfile({
        age_yrs: parseInt(formData.age_yrs) || 0,
        height_cm: parseFloat(formData.height_cm) || 0,
        weight_kg: parseFloat(formData.weight_kg) || 0,
        bmi: parseFloat(formData.bmi) || 0,
        marriage_status_yrs: parseInt(formData.marriage_status_yrs) || 0,
        pregnant_y_n: formData.pregnant_y_n === 'Y' ? 1 : 0,
        no_of_abortions: parseInt(formData.no_of_abortions) || 0,
        hip_inch: parseFloat(formData.hip_inch) || 0,
        waist_inch: parseFloat(formData.waist_inch) || 0,
        waist_hip_ratio: parseFloat(formData.waist_hip_ratio) || 0
      });
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    1: "Account Setup",
    2: "Physical Metrics",
    3: "Review Profile"
  };

  return (
    <div className={`min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-soft-pink/30 via-bg-color to-white py-12 px-4 sm:px-6 flex flex-col items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-primary-lavender/20 to-soft-pink/20 blur-3xl opacity-60 animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] rounded-full bg-gradient-to-tl from-soft-pink/20 to-deep-lavender/10 blur-3xl opacity-50 animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Header */}
      <div className="relative z-10 text-center mb-8 max-w-2xl mx-auto flex flex-col items-center">
        <img src="/brand/logo.png" alt="OvaCare Logo" className="h-28 w-auto object-contain mb-2" />
        <p className="text-gray-500 text-sm sm:text-base font-medium mt-2">
          Personalizing your wellness journey with gentle intelligence.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[900px] bg-white/90 backdrop-blur-xl border border-white rounded-[24px] shadow-soft p-6 sm:p-10 relative z-10 transition-all duration-500 ease-out transform translate-y-0">

        {/* Step Header */}
        <StepProgress currentStep={currentStep} totalSteps={3} />

        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <span className="text-xs font-bold text-primary-lavender tracking-widest uppercase">
            Step {currentStep} of 3
          </span>
          <h2 className="text-2xl font-heading font-bold text-gray-900">
            {stepTitles[currentStep]}
          </h2>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="flex flex-col lg:flex-row gap-10 animate-fade-in">
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4 text-center sm:text-left">Profile Avatar</h3>
                  <ProfileImageUpload image={profileImage} setImage={setProfileImage} editable={true} />
                </div>

                <div className="space-y-2">
                  <FormInput label="Username" id="username" icon={User} placeholder="Choose a username" value={formData.username} onChange={handleInputChange} error={errors.username} required />
                  <FormInput label="Email address" id="email" type="email" icon={Mail} placeholder="your@email.com" value={formData.email} onChange={handleInputChange} error={errors.email} required />
                  {/* <FormInput label="Password" id="password" type="password" icon={Lock} placeholder="••••••••" value={formData.password} onChange={handleInputChange} error={errors.password} required />
                <FormInput label="Confirm password" id="confirm_password" type="password" icon={Lock} placeholder="••••••••" value={formData.confirm_password} onChange={handleInputChange} error={errors.confirm_password} required /> */}
                </div>
              </div>
              <div className="w-full lg:w-[320px] flex-shrink-0">
                <AssistantInsightCard
                  title="Secure Profile"
                  text="Your account helps us personalize your PCOS journey while keeping your health information completely protected and private."
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="flex flex-col lg:flex-row gap-10 animate-fade-in">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div className="sm:col-span-2">
                  <FormInput label="Age (Years)" id="age_yrs" type="number" placeholder="e.g. 28" value={formData.age_yrs} onChange={handleInputChange} error={errors.age_yrs} required />
                </div>
                <FormInput label="Weight (kg)" id="weight_kg" type="number" icon={Scale} placeholder="e.g. 65" value={formData.weight_kg} onChange={handleInputChange} error={errors.weight_kg} required />
                <FormInput label="Height (cm)" id="height_cm" type="number" icon={Ruler} placeholder="e.g. 165" value={formData.height_cm} onChange={handleInputChange} error={errors.height_cm} required />
                <FormInput label="Waist Circumference (inch)" id="waist_inch" type="number" placeholder="e.g. 30" value={formData.waist_inch} onChange={handleInputChange} />
                <FormInput label="Hip Circumference (inch)" id="hip_inch" type="number" placeholder="e.g. 40" value={formData.hip_inch} onChange={handleInputChange} />
                <FormInput label="Marriage Status (Years)" id="marriage_status_yrs" type="number" placeholder="0 if single" value={formData.marriage_status_yrs} onChange={handleInputChange} />
                <SelectInput label="Are you pregnant?" id="pregnant_y_n" options={[{ label: 'Yes', value: 'Y' }, { label: 'No', value: 'N' }]} value={formData.pregnant_y_n} onChange={handleInputChange} />
                <div className="sm:col-span-2">
                  <FormInput label="Number of Abortions/Miscarriages" id="no_of_abortions" type="number" placeholder="e.g. 0" value={formData.no_of_abortions} onChange={handleInputChange} />
                </div>
              </div>

              <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1">
                  <MetricResultCard
                    title="BMI Score"
                    value={formData.bmi}
                    category={getBmiCategory(formData.bmi)}
                  />
                  <MetricResultCard
                    title="Waist-Hip Ratio"
                    value={formData.waist_hip_ratio}
                  />
                </div>
                <AssistantInsightCard
                  title="Why we ask"
                  text="These measurements help OvaCare understand metabolic and hormonal risk patterns often associated with PCOS."
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="flex flex-col lg:flex-row gap-10 animate-fade-in">
              <div className="flex-1">
                {/* Profile Summary Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="flex-shrink-0">
                    <ProfileImageUpload image={profileImage} setImage={setProfileImage} editable={true} />
                  </div>
                  <div className="flex flex-col justify-center h-full pt-2 sm:pt-4 text-center sm:text-left">
                    <h3 className="text-xl font-heading font-bold text-gray-900">{formData.username || 'Username'}</h3>
                    <p className="text-sm text-gray-500 mt-1">{formData.email || 'Email not provided'}</p>
                  </div>
                </div>

                <ReviewCard
                  title="Account Information"
                  data={formData}
                  fields={[
                    { key: 'password', label: 'Password' }
                  ]}
                />

                <ReviewCard
                  title="Physical Metrics"
                  data={formData}
                  fields={[
                    { key: 'age_yrs', label: 'Age (Years)' },
                    { key: 'marriage_status_yrs', label: 'Marriage (Years)' },
                    { key: 'weight_kg', label: 'Weight (kg)' },
                    { key: 'height_cm', label: 'Height (cm)' },
                    { key: 'bmi', label: 'BMI' },
                    { key: 'pregnant_y_n', label: 'Pregnant' },
                    { key: 'waist_inch', label: 'Waist (inch)' },
                    { key: 'hip_inch', label: 'Hip (inch)' },
                    { key: 'waist_hip_ratio', label: 'Waist-Hip Ratio' },
                    { key: 'no_of_abortions', label: 'Abortions' }
                  ]}
                />

                <div className="mt-6 p-4 bg-primary-lavender/10 rounded-xl border border-primary-lavender/20 flex items-start gap-3">
                  <div className="mt-0.5 text-primary-lavender">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">I confirm that the information provided is accurate.</p>
                    <p className="text-xs text-gray-500 mt-1">Your health data is stored securely and used only to personalize your OvaCare experience.</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[320px] flex-shrink-0">
                <AssistantInsightCard
                  title="AI Readiness"
                  text="Your profile is ready to support personalized PCOS risk insights and wellness recommendations based on your unique data."
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors duration-200 ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <ArrowLeft size={18} />
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 rounded-full text-white font-medium bg-gradient-to-r from-primary-lavender to-ai-accent hover:from-ai-accent hover:to-deep-lavender shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-lavender/50"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 rounded-full text-white font-medium bg-gradient-to-r from-[#F4C3D4] to-[#B5A1E5] hover:to-deep-lavender shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-soft-pink/50 flex items-center gap-2"
            >
              Complete Profile <Check size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
