import React from 'react';

export default function Avatar3D({ src, alt }) {
  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center animate-float" style={{ animationDuration: '4s' }}>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain drop-shadow-2xl scale-110 sm:scale-125"
      />
    </div>
  );
}
