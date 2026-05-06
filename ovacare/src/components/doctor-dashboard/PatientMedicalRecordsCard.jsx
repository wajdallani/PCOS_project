import React, { useState } from 'react';
import { FileText, Image as ImageIcon, CheckCircle2, ChevronRight } from 'lucide-react';

const records = {
  labs: [
    { id: 1, title: 'Comprehensive Metabolic', date: 'Oct 12, 2023', validated: true },
    { id: 2, title: 'Hormone Panel (Day 3)', date: 'Aug 08, 2023', validated: false },
    { id: 3, title: 'Lipid Profile', date: 'Jun 22, 2023', validated: true },
  ],
  ultrasounds: [
    { id: 1, title: 'Pelvic Ultrasound (Transvaginal)', date: 'Oct 14, 2023', validated: true },
    { id: 2, title: 'Abdominal Scan', date: 'Jul 10, 2023', validated: true },
  ]
};

export default function PatientMedicalRecordsCard({ onUseRecord }) {
  const [activeTab, setActiveTab] = useState('labs');

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">Patient Medical Records</h3>
      
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('labs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'labs' 
              ? 'bg-white text-primary-lavender shadow-sm' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText size={14} /> Lab Tests
        </button>
        <button 
          onClick={() => setActiveTab('ultrasounds')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ultrasounds' 
              ? 'bg-white text-primary-lavender shadow-sm' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <ImageIcon size={14} /> Ultrasounds
        </button>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent">
        {records[activeTab].map((record) => (
          <div key={record.id} className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-primary-lavender/30 hover:bg-primary-lavender/5 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{record.title}</h4>
                  {record.validated && <CheckCircle2 size={12} className="text-green-500" />}
                </div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{record.date}</p>
              </div>
              {record.validated && (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-[8px] font-black text-green-700 uppercase tracking-widest border border-green-200">
                  Validated
                </span>
              )}
            </div>
            <button 
              onClick={() => onUseRecord(record)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-primary-lavender/50 hover:text-primary-lavender transition-all"
            >
              Use this test <ChevronRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
