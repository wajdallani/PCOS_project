import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  icon: Icon,
  required,
  value,
  onChange,
  error,
  disabled
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="mb-4 w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div 
        className={`relative flex items-center transition-all duration-200 rounded-xl border bg-white ${
          disabled ? 'opacity-60 bg-gray-50' : ''
        } ${
          isFocused 
            ? 'border-primary-lavender ring-4 ring-primary-lavender/20 shadow-glow' 
            : error 
              ? 'border-red-300 ring-4 ring-red-100' 
              : 'border-gray-200 hover:border-primary-lavender/50'
        }`}
      >
        {Icon && (
          <div className="absolute left-3.5 text-gray-400">
            <Icon size={18} className={isFocused ? 'text-primary-lavender' : ''} />
          </div>
        )}
        
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full py-2.5 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm ${
            Icon ? 'pl-10' : 'pl-4'
          } ${isPassword ? 'pr-10' : 'pr-4'}`}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-gray-400 hover:text-primary-lavender transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
