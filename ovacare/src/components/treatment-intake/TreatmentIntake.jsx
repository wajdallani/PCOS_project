import React, { useState, useEffect } from 'react';
import Sidebar from '../dashboard/Sidebar';
import FloatingChatButton from '../dashboard/FloatingChatButton';
import AdherenceCard from './AdherenceCard';
import TreatmentItemCard from './TreatmentItemCard';
import AdherenceCalendar from './AdherenceCalendar';
import SideEffectsLog from './SideEffectsLog';
import { Calendar as CalendarIcon, Pill } from 'lucide-react';

export default function TreatmentIntake({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loggedTreatments, setLoggedTreatments] = useState([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogIntake = (treatmentName) => {
    if (!loggedTreatments.includes(treatmentName)) {
      setLoggedTreatments(prev => [...prev, treatmentName]);
    }
  };

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Sidebar */}
      <Sidebar onNavigate={onNavigate} activePage="treatments" />

      {/* Main Content Area */}
      <main className="flex-1 ml-[230px] p-8 sm:p-10 max-w-[1400px]">
        {/* Page Header */}
        <header className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">My Treatment Plan</h1>
          <p className="text-gray-500 font-medium mt-2 max-w-2xl">
            Personalized hormone management and intake tracking.
          </p>
        </header>

        <div className="space-y-8">
          {/* Top Row: Adherence Score & Medication List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <AdherenceCard />
            </div>
            <div className="lg:col-span-8 flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <TreatmentItemCard 
                icon={CalendarIcon} 
                name="Metformin" 
                details="500mg • Twice daily (With meals)" 
                onLogIntake={handleLogIntake}
                isLogged={loggedTreatments.includes("Metformin")} 
              />
              <TreatmentItemCard 
                icon={Pill} 
                name="Inositol" 
                details="Powder • Daily (Before breakfast)" 
                onLogIntake={handleLogIntake}
                isLogged={loggedTreatments.includes("Inositol")} 
              />
            </div>
          </div>

          {/* Bottom Row: Calendar & Side Effects */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <AdherenceCalendar />
            </div>
            <div className="lg:col-span-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <SideEffectsLog />
            </div>
          </div>
        </div>

        {/* Space for bottom padding */}
        <div className="h-20" />
      </main>

      {/* Shared Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
}
