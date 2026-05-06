import React, { useState } from 'react';

export default function TextAreaInput({
  label,
  id,
  placeholder,
  required,
  value,
  onChange,
  error,
  maxLength = 300
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4 w-full">
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {maxLength && (
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            value.length >= maxLength ? 'text-red-400' : 'text-gray-400'
          }`}>
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      <div 
        className={`relative transition-all duration-200 rounded-xl border bg-white ${
          isFocused 
            ? 'border-primary-lavender ring-4 ring-primary-lavender/20 shadow-glow' 
            : error 
              ? 'border-red-300 ring-4 ring-red-100' 
              : 'border-gray-200 hover:border-primary-lavender/50'
        }`}
      >
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={4}
          className="w-full py-2.5 px-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm resize-none"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
