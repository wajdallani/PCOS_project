import React, { useEffect, useState } from 'react';
import { User, Stethoscope, Lock } from 'lucide-react';
import RoleCard from './RoleCard';

export default function RoleSelectionPage({ onBackToLogin, onSelectRole }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    setIsVisible(true);
  }, []);

  const handleSelectRole = (role) => {
    console.log(`Selected role: ${role}`);
    if (onSelectRole) onSelectRole(role);
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-soft-pink/30 via-bg-color to-white flex flex-col items-center py-10 px-4 sm:px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Background Shapes & Particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Soft lavender wave/blob top left */}
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-primary-lavender/30 to-soft-pink/20 blur-3xl opacity-60 animate-blob" />

        {/* Soft pink blob bottom right */}
        <div className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-soft-pink/20 to-deep-lavender/10 blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }} />

        {/* Glowing particles */}
        <div className="absolute top-[20%] left-[20%] w-2 h-2 rounded-full bg-soft-pink opacity-80 shadow-glow animate-pulse"></div>
        <div className="absolute top-[30%] right-[25%] w-3 h-3 rounded-full bg-primary-lavender opacity-60 shadow-glow animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[25%] left-[30%] w-2 h-2 rounded-full bg-soft-pink opacity-70 shadow-glow animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[40%] right-[15%] w-2 h-2 rounded-full bg-primary-lavender opacity-80 shadow-glow animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-10 mt-4 max-w-2xl mx-auto flex flex-col items-center">
        {/* Minimal Logo */}
        <div className="flex items-center justify-center mb-6" onClick={onBackToLogin} style={{ cursor: 'pointer' }}>
          <img src="/brand/logo.png" alt="OvaCare Logo" className="h-32 w-auto object-contain" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 mb-4 tracking-tight">
          Who are you?
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
          Select your profile type to personalize your experience and access the right tools for your journey.
        </p>
      </div>

      {/* Cards Container */}
      <div className={`relative z-10 flex flex-col md:flex-row gap-6 lg:gap-10 items-stretch justify-center w-full max-w-5xl transition-transform duration-1000 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>

        {/* Patient Card */}
        <RoleCard
          type="patient"
          title="I am a Patient"
          description="Track your hormonal health, receive personalized AI-driven insights, and manage your PCOS journey with empathy and data."
          icon={User}
          buttonText="Proceed as Patient "
          buttonGradient="from-[#F4C3D4] to-[#B5A1E5]"
          avatarSrc="/avatars/patient.png"
          avatarBgColor="bg-soft-pink"
          iconBgColor="bg-soft-pink/20"
          onSelect={handleSelectRole}
        />

        {/* Doctor Card */}
        <RoleCard
          type="doctor"
          title="I am a Doctor"
          description="Access comprehensive patient analytics, risk assessments, and clinical monitoring tools designed for endocrinology excellence."
          icon={Stethoscope}
          buttonText="Proceed as Doctor"
          buttonGradient="from-[#B5A1E5] to-[#7B5FA5]"
          avatarSrc="/avatars/doctor.png"
          avatarBgColor="bg-primary-lavender"
          iconBgColor="bg-primary-lavender/20"
          onSelect={handleSelectRole}
        />

      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto pt-16 flex flex-col items-center">
        <div className="flex gap-6 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          <a href="#" className="hover:text-primary-lavender transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-lavender transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary-lavender transition-colors">Help Center</a>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-2">
          <Lock size={12} />
          <span>Secure Health Data Platform</span>
        </div>
      </div>

    </div>
  );
}
