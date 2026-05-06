import React from 'react';

export default function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-full py-2.5 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 text-sm font-medium text-gray-700"
    >
      <img src={icon} alt={`${label} icon`} className="w-5 h-5 mr-3" />
      {label}
    </button>
  );
}
