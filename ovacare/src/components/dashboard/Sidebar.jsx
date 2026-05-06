import React from 'react';
import { LayoutDashboard, Calendar, Utensils, Heart, MessageSquare, Settings, LogOut, Pill, TrendingUp } from 'lucide-react';

const navItems = [
  { id: 'patient-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'cycle-tracking', icon: Calendar, label: 'Cycle' },
  { id: 'pcos-prediction', icon: Heart, label: 'PCOS Assessment' },
  { id: 'progression', icon: TrendingUp, label: 'Progression' },
  { id: 'treatments', icon: Pill, label: 'Treatments' },
  { id: 'nutrition', icon: Utensils, label: 'Nutrition' },
  { id: 'emotional-recognition', icon: Heart, label: 'Emotions' },
  { id: 'chatbot', icon: MessageSquare, label: 'Chatbot' },
];

export default function Sidebar({ onNavigate, activePage, patient }) {
  const patientName = patient?.user?.username || "Sarah J.";
  const avatar = patient?.user?.profile_image_url || "/avatars/avatar1.jpg";
  return (
    <aside className="w-[230px] h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-4 mb-2 flex justify-center">
        <img src="/brand/logo.png" alt="OvaCare Logo" className="h-24 w-auto object-contain" />
      </div>

      {/* User Card */}
      <div className="px-4 mb-8">
        <div className="bg-gray-50/50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
          <div className="w-10 h-10 rounded-full border-2 border-primary-lavender/30 overflow-hidden bg-white flex-shrink-0">
            <img src={avatar} alt={patientName} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-gray-900 leading-none truncate">{patientName}</span>
            <span className="text-[10px] font-bold text-primary-lavender uppercase tracking-wider mt-1">Premium Member</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={index}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary-lavender/10 text-deep-lavender shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive ? 'text-deep-lavender' : 'text-gray-400 group-hover:text-primary-lavender'} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-lavender" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="p-4 space-y-1 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
