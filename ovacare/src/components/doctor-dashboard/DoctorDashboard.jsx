import React, { useState, useEffect } from 'react';
import SidebarDoctor from './SidebarDoctor';
import TopMetricsCard from './TopMetricsCard';
import PatientRiskCard from './PatientRiskCard';
import AnalyticsChart from './AnalyticsChart';
import ActivityFeed from './ActivityFeed';
import AIInsightCard from './AIInsightCard';
import { Users, AlertTriangle, FileText, Bell, Search, Settings, BrainCircuit, Send, ArrowRight, ChevronRight } from 'lucide-react';
import { getCurrentDoctor } from '../../services/api';

const highRiskPatients = [
  { name: 'Elena Rodriguez', id: '#P-2041', age: 29, riskPercent: 85, trend: 'Elevated Insulin Resistance' },
  { name: 'Sarah Jenkins', id: '#P-1873', age: 34, riskPercent: 78, trend: 'Irregular Cycle Detected' },
];

export default function DoctorDashboard({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const data = await getCurrentDoctor();
      setDoctor(data);
    } catch (err) {
      console.error("Error fetching doctor:", err);
    }
  };

  const handleNewPrediction = () => console.log("New PCOS Risk Prediction...");
  const handleSendRecommendation = () => console.log("Sending recommendation...");

  const doctorName = doctor?.user?.username || "Dr. Lina";

  return (
    <div className={`flex min-h-screen bg-bg-color transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <SidebarDoctor onNavigate={onNavigate} activePage="doctor-dashboard" doctor={doctor} />

      {/* Main Area */}
      <div className="flex-1 ml-[230px] flex flex-col">

        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-bg-color/80 backdrop-blur-lg border-b border-gray-100 px-8 py-4 flex items-center justify-end gap-4">
          <div className="relative flex items-center group">
            <Search className="absolute left-3.5 text-gray-400 group-hover:text-primary-lavender transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 w-56 shadow-sm transition-all"
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
            <img src={doctor?.user?.profile_image_url || "/avatars/doctor.png"} alt={doctorName} className="w-full h-full object-cover" />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-8 sm:p-10">

          {/* Welcome + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 animate-fade-in">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 leading-tight">Welcome back, {doctorName}.</h1>
              <p className="text-gray-500 font-medium mt-1">Here is your practice update for today.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleSendRecommendation}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-primary-lavender/30 transition-all shadow-sm"
              >
                <Send size={14} /> Send Recommendation
              </button>
              <button
                onClick={handleNewPrediction}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-glow hover:-translate-y-0.5 transition-all"
              >
                <BrainCircuit size={14} /> New PCOS Prediction
              </button>
            </div>
          </div>

          {/* 2-column layout: Main + Right Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Main Column */}
            <div className="xl:col-span-8 space-y-8">

              {/* Top Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <TopMetricsCard
                  value="124"
                  label="Monitored Patients"
                  icon={Users}
                  iconBg="bg-primary-lavender/10"
                  iconColor="text-primary-lavender"
                  accent="bg-primary-lavender"
                />
                <TopMetricsCard
                  value="5"
                  label="High Risk Alerts"
                  icon={AlertTriangle}
                  iconBg="bg-red-50"
                  iconColor="text-red-500"
                  accent="bg-red-400"
                />
                <TopMetricsCard
                  value="3"
                  label="Pending Predictions"
                  icon={FileText}
                  iconBg="bg-gray-50"
                  iconColor="text-gray-500"
                  accent="bg-gray-300"
                />
              </div>

              {/* High Risk Patients */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-heading font-bold text-gray-900">High-risk patients needing attention</h2>
                  <button className="text-[10px] font-black text-primary-lavender uppercase tracking-widest flex items-center gap-1 hover:text-deep-lavender transition-colors group">
                    View All <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {highRiskPatients.map((p) => (
                    <PatientRiskCard key={p.name} {...p} />
                  ))}
                </div>
              </div>

              {/* Analytics Chart */}
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <AnalyticsChart />
              </div>

            </div>

            {/* Right Panel */}
            <div className="xl:col-span-4 space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <ActivityFeed />
              <AIInsightCard />
            </div>
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
