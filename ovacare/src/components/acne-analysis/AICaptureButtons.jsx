import React, { useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

export default function AICaptureButtons({ onTakePhoto, onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      
      <button 
        onClick={onTakePhoto}
        className="flex items-center justify-center gap-3 py-4 px-6 rounded-[20px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white font-bold tracking-widest uppercase text-sm shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
      >
        <Camera size={20} />
        Take a photo
      </button>
      
      <button 
        onClick={handleUploadClick}
        className="flex items-center justify-center gap-3 py-4 px-6 rounded-[20px] bg-white border border-gray-100 text-gray-600 font-bold tracking-widest uppercase text-sm shadow-sm hover:bg-gray-50 hover:border-primary-lavender/30 transition-all duration-300"
      >
        <ImageIcon size={20} />
        Upload from gallery
      </button>
    </div>
  );
}
