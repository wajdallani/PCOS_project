import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SelectInput({
  label,
  id,
  options,
  required,
  value,
  onChange,
  error
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4 w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div 
        className={`relative flex items-center transition-all duration-200 rounded-xl border bg-white ${
          isFocused 
            ? 'border-primary-lavender ring-4 ring-primary-lavender/20 shadow-glow' 
            : error 
              ? 'border-red-300 ring-4 ring-red-100' 
              : 'border-gray-200 hover:border-primary-lavender/50'
        }`}
      >
        <select
          id={id}
          name={id}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-2.5 px-4 bg-transparent outline-none text-gray-800 text-sm appearance-none cursor-pointer"
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3.5 text-gray-400 pointer-events-none">
          <ChevronDown size={18} className={isFocused ? 'text-primary-lavender' : ''} />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
