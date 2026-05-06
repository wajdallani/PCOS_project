import React, { useState, useEffect } from 'react';
import SidebarDoctor from './SidebarDoctor';
import PatientCard from './PatientCard';
import { PatientsAIInsightCard, ClinicOverviewCard } from './PatientsBottomCards';
import { Search, SlidersHorizontal, UserPlus, Bell, Settings, Loader2, AlertCircle } from 'lucide-react';
import { getDoctorPatients } from '../../services/api';

const FILTER_TABS = [
  { id: 'all', label: 'All Patients' },
  { id: 'high', label: 'High Risk' },
  { id: 'medium', label: 'Medium Risk' },
  { id: 'low', label: 'Low Risk' },
];

export default function PatientsList({ onNavigate }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getDoctorPatients();
      // Map API data to match UI expected structure
      const mappedData = data.map(p => ({
        ...p,
        id: `#P-${p.id}`,
        name: p.user?.username || `Patient ${p.id}`,
        email: p.user?.email || '',
        phone: p.user?.phone || '',
        profile_image: p.user?.profile_image_url || null,
        age: p.age_yrs || 0,
        risk: 'low', // Defaulting for UI (can be derived from model_runs later)
        adherence: '90%', // Placeholder
        lastLog: 'Recent', // Placeholder
        trend: [5, 5, 5, 5, 5], // Placeholder
        trendLabel: 'Stable' // Placeholder
      }));
      setPatients(mappedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.risk === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleAddPatient = () => console.log("Opening add patient dialog...");
  const handleViewProfile = (id) => onNavigate('patient-detail', { patientId: id.replace('#P-', '') });

  return (
    <div className="flex min-h-screen bg-bg-color">
      <SidebarDoctor onNavigate={onNavigate} activePage="patients" />

      <div className="flex-1 ml-[230px] flex flex-col">
        {/* Sticky Top Header Bar */}
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
            <img src="/avatars/doctor.png" alt="Dr. Lina" className="w-full h-full object-cover" />
          </div>
        </header>

        <main className="flex-1 p-8 sm:p-10">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900">My Patients</h1>
              <p className="text-gray-500 font-medium mt-1">Manage and monitor patient health metrics and risk factors.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Search */}
              <div className="relative flex items-center group">
                <Search className="absolute left-3.5 text-gray-400 group-hover:text-primary-lavender transition-colors" size={16} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search patients…"
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-lavender/10 focus:border-primary-lavender/50 w-48 shadow-sm transition-all"
                />
              </div>
              {/* Filter */}
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-500 text-xs font-bold hover:bg-gray-50 hover:border-primary-lavender/30 transition-all shadow-sm">
                <SlidersHorizontal size={14} /> Filter
              </button>
              {/* Add Patient */}
              <button
                onClick={handleAddPatient}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-glow hover:-translate-y-0.5 transition-all"
              >
                <UserPlus size={14} /> Add Patient
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-8 flex-wrap animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                  activeFilter === tab.id
                    ? 'bg-primary-lavender border-primary-lavender text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-primary-lavender/30 hover:text-primary-lavender'
                }`}
              >
                {tab.label}
                <span className={`ml-2 text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeFilter === tab.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
                  {tab.id === 'all' ? patients.length : patients.filter(p => p.risk === tab.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Patient Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {loading ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-primary-lavender">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="font-bold tracking-widest uppercase text-xs">Fetching Clinical Data...</p>
              </div>
            ) : error ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-red-400">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-bold tracking-widest uppercase text-xs">{error}</p>
                <button 
                  onClick={fetchPatients}
                  className="mt-4 px-6 py-2 rounded-full border border-red-200 text-xs font-bold hover:bg-red-50 transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <PatientCard key={patient.id} patient={patient} onViewProfile={handleViewProfile} />
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-gray-400">
                <p className="text-lg font-medium">No patients match your search.</p>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <PatientsAIInsightCard />
            <ClinicOverviewCard />
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
