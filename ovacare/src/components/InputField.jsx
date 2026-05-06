import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function InputField({ 
  label, 
  type = 'text', 
  id, 
  name,
  value,
  onChange,
  placeholder, 
  icon: Icon,
  required = false
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false); // Can be controlled by props in a real app

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div 
        className={`relative flex items-center transition-all duration-200 rounded-xl border bg-white ${
          isFocused 
            ? 'border-primary-lavender ring-4 ring-primary-lavender/20 shadow-glow' 
            : hasError 
              ? 'border-red-300 ring-4 ring-red-100' 
              : 'border-gray-200 hover:border-primary-lavender/50'
        }`}
      >
        {Icon && (
          <div className="absolute left-3 text-gray-400">
            <Icon size={18} className={isFocused ? 'text-primary-lavender' : ''} />
          </div>
        )}
        
        <input
          id={id}
          name={name || id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full py-2.5 bg-transparent outline-none text-gray-800 placeholder-gray-400 ${
            Icon ? 'pl-10' : 'pl-4'
          } ${isPassword ? 'pr-10' : 'pr-4'}`}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 hover:text-primary-lavender transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
