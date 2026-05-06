import React, { useEffect, useState } from 'react';
import { Bell, Search, Plus, Pill, Smile, Camera } from 'lucide-react';
import Sidebar from './Sidebar';
import WellnessScoreCard from './WellnessScoreCard';
import CyclePhaseCard from './CyclePhaseCard';
import QuickActionCard from './QuickActionCard';
import DoctorRecommendations from './DoctorRecommendations';
import FloatingChatButton from './FloatingChatButton';

import { getCurrentPatient } from '../../services/api';

export default function PatientDashboard({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      const data = await getCurrentPatient();
      setPatient(data);
    } catch (err) {
      console.error("Error fetching patient:", err);
    }
  };

  const patientName = patient?.user?.username || "Sarah";

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Fixed Sidebar */}
      <Sidebar onNavigate={onNavigate} activePage="patient-dashboard" patient={patient} />

      {/* Main Content Area */}
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">Good morning, {patientName}</h1>
            <p className="text-gray-500 font-medium mt-1">Today is a great day to focus on mindful movement.</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar - Desktop Only */}
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3.5 text-gray-400 group-hover:text-primary-lavender transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search health data..." 
                className="pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 w-64 shadow-sm transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-soft-pink border-2 border-white rounded-full"></span>
            </button>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full border-2 border-primary-lavender/20 shadow-sm cursor-pointer overflow-hidden">
              <img src={patient?.user?.profile_image_url || "/avatars/avatar1.jpg"} alt={patientName} className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <WellnessScoreCard />
          <CyclePhaseCard />
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickActionCard 
              icon={Plus} 
              title="Log Symptoms" 
              onClick={() => onNavigate && onNavigate('cycle-tracking')}
            />
            <QuickActionCard 
              icon={Pill} 
              title="Metformin" 
              subtitle="8:00 AM Today"
              badge="NEXT"
              onClick={() => onNavigate && onNavigate('treatments')}
            />
            <QuickActionCard 
              icon={Smile} 
              title="How are you?" 
            />
            <QuickActionCard 
              icon={Camera} 
              title="Scan Meal" 
              variant="dark"
              onClick={() => onNavigate && onNavigate('nutrition')}
            />
          </div>
        </div>

        {/* Recommendations Section */}
        <DoctorRecommendations />

        {/* Space for Floating Chat Button placeholder padding */}
        <div className="h-20" />
      </main>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
}
