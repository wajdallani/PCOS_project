import React from 'react';
import Avatar3D from './Avatar3D';

export default function RoleCard({
  type,
  title,
  description,
  icon: Icon,
  buttonText,
  buttonGradient,
  avatarSrc,
  avatarBgColor,
  iconBgColor,
  onSelect
}) {
  return (
    <div className="w-full sm:w-[340px] flex flex-col items-center bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 shadow-soft border border-white/60 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary-lavender/40 group">

      {/* Top Icon Badge */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center self-end mb-2 transition-transform duration-300 group-hover:scale-110 ${iconBgColor}`}>
        <Icon className="text-gray-700" size={18} />
      </div>

      {/* Avatar Section */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6 flex justify-center items-center">
        {/* Background shape */}
        <div className={`absolute inset-0 rounded-full blur-xl opacity-40 transition-opacity duration-300 group-hover:opacity-60 ${avatarBgColor}`}></div>
        <div className={`absolute w-40 h-40 rounded-full opacity-60 ${avatarBgColor}`}></div>

        {/* Avatar Component */}
        <Avatar3D src={avatarSrc} alt={`${type} avatar`} />
      </div>

      {/* Content */}
      <div className="text-center flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-3">{title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {description}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelect(type)}
          className={`w-full py-3.5 px-6 rounded-full text-white font-medium transition-all duration-300 transform shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary-lavender/50 bg-gradient-to-r ${buttonGradient} relative overflow-hidden group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-white/10`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
