import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowLeft, Check, Award, Building2, BookOpen, Search } from 'lucide-react';
import StepProgress from '../shared/StepProgress';
import FormInput from '../shared/FormInput';
import SearchableSelectInput from '../shared/SearchableSelectInput';
import TextAreaInput from '../shared/TextAreaInput';
import AssistantInsightCard from '../shared/AssistantInsightCard';
import ReviewCard from '../shared/ReviewCard';
import ProfileImageUpload from '../shared/ProfileImageUpload';

import { setupDoctorProfile, getMe } from '../../services/api';

export default function DoctorProfileSetup({ onComplete }) {
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
    specialty: '',
    license_number: '',
    cnam: '',
    address: '',
    years_of_experience: '',
    professional_bio: ''
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.username) newErrors.username = "Username is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }
    if (step === 2) {
      if (!formData.specialty) newErrors.specialty = "Specialty is required";
      if (!formData.license_number) newErrors.license_number = "License number is required";
      if (!formData.address) newErrors.address = "Address is required";
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
      await setupDoctorProfile({
        specialty: formData.specialty,
        address: formData.address,
        license_number: formData.license_number,
        cnam: formData.cnam,
        years_exp: parseInt(formData.years_of_experience) || 0,
        bio: formData.professional_bio
      });
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const specialtyOptions = [
    { label: 'Gynecologist', value: 'Gynecologist' },
    { label: 'Obstetrician-Gynecologist', value: 'Obstetrician-Gynecologist' },
    { label: 'Endocrinologist', value: 'Endocrinologist' },
    { label: 'Reproductive Endocrinologist', value: 'Reproductive Endocrinologist' },
    { label: 'Dermatologist', value: 'Dermatologist' },
    { label: 'Nutritionist', value: 'Nutritionist' },
    { label: 'Dietitian', value: 'Dietitian' },
    { label: 'General Practitioner', value: 'General Practitioner' },
    { label: 'Family Medicine Doctor', value: 'Family Medicine Doctor' },
    { label: 'Internal Medicine Doctor', value: 'Internal Medicine Doctor' },
    { label: 'Fertility Specialist', value: 'Fertility Specialist' },
    { label: 'Psychologist', value: 'Psychologist' },
    { label: 'Psychiatrist', value: 'Psychiatrist' },
    { label: 'Women’s Health Specialist', value: 'Women’s Health Specialist' }
  ];

  const stepTitles = {
    1: "Account Setup",
    2: "Professional Profile",
    3: "Review Profile"
  };

  return (
    <div className={`min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-primary-lavender/10 via-bg-color to-white py-12 px-4 sm:px-6 flex flex-col items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-primary-lavender/20 to-soft-pink/20 blur-3xl opacity-60 animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-gradient-to-tr from-soft-pink/20 to-deep-lavender/10 blur-3xl opacity-50 animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Header */}
      <div className="relative z-10 text-center mb-8 max-w-2xl mx-auto flex flex-col items-center">
        <img src="/brand/logo.png" alt="OvaCare Logo" className="h-28 w-auto object-contain mb-2" />
        <p className="text-gray-500 text-sm sm:text-base font-medium mt-2">
          Setting up your clinical workspace with gentle intelligence.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[900px] bg-white/90 backdrop-blur-xl border border-white rounded-[24px] shadow-soft p-6 sm:p-10 relative z-10">
        
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
        <div className="min-h-[450px]">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="flex flex-col lg:flex-row gap-10 animate-fade-in">
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4 text-center sm:text-left">Professional Profile Picture</h3>
                  <ProfileImageUpload image={profileImage} setImage={setProfileImage} editable={true} />
                </div>
                
                <div className="space-y-2">
                  <FormInput label="Username" id="username" icon={User} placeholder="Choose a username" value={formData.username} onChange={handleInputChange} error={errors.username} required />
                  <FormInput label="Email address" id="email" type="email" icon={Mail} placeholder="dr.smith@example.com" value={formData.email} onChange={handleInputChange} error={errors.email} required />
                  <FormInput label="Password" id="password" type="password" icon={Lock} placeholder="••••••••" value={formData.password} onChange={handleInputChange} error={errors.password} required />
                  <FormInput label="Confirm password" id="confirm_password" type="password" icon={Lock} placeholder="••••••••" value={formData.confirm_password} onChange={handleInputChange} error={errors.confirm_password} required />
                </div>
              </div>
              <div className="w-full lg:w-[320px] flex-shrink-0">
                <AssistantInsightCard 
                  title="Secure Clinical Account" 
                  text="Your profile helps OvaCare create a trusted clinical workspace for patient monitoring and AI-assisted PCOS insights while ensuring clinical security."
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="flex flex-col lg:flex-row gap-10 animate-fade-in">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div className="sm:col-span-2">
                  <SearchableSelectInput label="Medical Specialty" id="specialty" options={specialtyOptions} value={formData.specialty} onChange={handleInputChange} error={errors.specialty} required placeholder="Search or select specialty" />
                </div>
                <FormInput label="License Number" id="license_number" icon={Award} placeholder="e.g. LIC12345678" value={formData.license_number} onChange={handleInputChange} error={errors.license_number} required />
                <FormInput label="CNAM / Insurance Registration" id="cnam" icon={Building2} placeholder="Enter CNAM or insurance registration number" value={formData.cnam} onChange={handleInputChange} />
                <div className="sm:col-span-2">
                  <FormInput label="Practice Address" id="address" placeholder="Clinic address or professional practice address" value={formData.address} onChange={handleInputChange} error={errors.address} required />
                </div>
                <div className="sm:col-span-2">
                  <FormInput label="Years of Experience" id="years_of_experience" type="number" placeholder="e.g. 10" value={formData.years_of_experience} onChange={handleInputChange} />
                </div>
                <div className="sm:col-span-2">
                  <TextAreaInput label="Professional Bio" id="professional_bio" placeholder="Write a short professional introduction for your patients..." value={formData.professional_bio} onChange={handleInputChange} maxLength={300} />
                </div>
              </div>

              <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
                <AssistantInsightCard 
                  title="Clinical Trust" 
                  text="Your license and professional information help us create a safe and verified healthcare environment for your patients."
                />
                <AssistantInsightCard 
                  title="Personalized Workspace"
                  text="Specialty and clinical experience allow OvaCare to personalize dashboards, patient analytics, and PCOS risk monitoring tools for your practice."
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
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-lavender/10 text-deep-lavender border border-primary-lavender/30">
                      {formData.specialty || 'General Practitioner'}
                    </div>
                  </div>
                </div>

                <ReviewCard 
                  title="Professional Information"
                  data={formData}
                  fields={[
                    { key: 'license_number', label: 'Medical License' },
                    { key: 'cnam', label: 'CNAM Registration' },
                    { key: 'years_of_experience', label: 'Experience (Years)' },
                    { key: 'address', label: 'Practice Address' },
                    { key: 'professional_bio', label: 'Professional Bio' }
                  ]}
                />

                <div className="mt-6 p-4 bg-primary-lavender/10 rounded-xl border border-primary-lavender/20 flex items-start gap-3">
                  <div className="mt-0.5 text-primary-lavender">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">I confirm that my professional information is accurate.</p>
                    <p className="text-xs text-gray-500 mt-1">Your professional data is used to verify your clinical profile and personalize your OvaCare doctor workspace.</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[320px] flex-shrink-0">
                <AssistantInsightCard 
                  title="Doctor Workspace Ready" 
                  text="Your profile is ready to support patient follow-up, PCOS risk assessment, and AI-assisted clinical monitoring."
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
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
              currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
              className="px-8 py-3 rounded-full text-white font-medium bg-gradient-to-r from-[#B5A1E5] to-[#7B5FA5] hover:to-ai-accent shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-lavender/50 flex items-center gap-2"
            >
              Complete Profile <Check size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
