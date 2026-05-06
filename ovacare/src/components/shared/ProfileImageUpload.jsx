import React, { useRef, useState } from 'react';
import { Camera, User, AlertCircle } from 'lucide-react';

export default function ProfileImageUpload({ image, setImage, editable = true }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG image.');
      return;
    }

    // Validate size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB.');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setImage({ file, previewUrl: imageUrl });
  };

  const handleButtonClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      {/* Avatar Container */}
      <div className="relative group cursor-pointer mb-4" onClick={handleButtonClick}>
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-primary-lavender/40 shadow-glow p-1 bg-white flex items-center justify-center overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(181,161,229,0.7)]">
          {image?.previewUrl ? (
            <img 
              src={image.previewUrl} 
              alt="Profile preview" 
              className="w-full h-full object-cover rounded-full animate-fade-in"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center text-primary-lavender/40">
              <User size={48} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Floating Camera Button */}
        {editable && (
          <div className="absolute bottom-1 right-1 w-8 h-8 sm:w-9 sm:h-9 bg-deep-lavender rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform duration-200 group-hover:scale-110 group-hover:bg-ai-accent">
            <Camera size={16} className="text-white" />
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/jpg" 
        className="hidden" 
      />

      {/* Helper Text & Error */}
      {editable && (
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-3 max-w-[200px]">
            Upload a high-resolution JPG or PNG. Max size 5MB.
          </p>
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-5 py-2 text-sm font-medium text-deep-lavender border border-primary-lavender rounded-full hover:bg-primary-lavender/10 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary-lavender/30"
          >
            Change Photo
          </button>
          
          {error && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-red-500 bg-red-50 py-1.5 px-3 rounded-lg text-xs font-medium">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
