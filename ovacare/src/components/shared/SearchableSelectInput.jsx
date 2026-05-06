import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export default function SearchableSelectInput({
  label,
  id,
  options,
  required,
  value,
  onChange,
  error,
  placeholder = "Select an option"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    onChange({ target: { name: id, value: opt.value } });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="mb-4 w-full relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-4 py-2.5 bg-white border rounded-xl cursor-pointer transition-all duration-200 ${
          isOpen 
            ? 'border-primary-lavender ring-4 ring-primary-lavender/20 shadow-glow' 
            : error 
              ? 'border-red-300 ring-4 ring-red-100' 
              : 'border-gray-200 hover:border-primary-lavender/50'
        }`}
      >
        <span className={`text-sm ${selectedOption ? 'text-gray-800' : 'text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl animate-fade-in overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400" size={14} />
              <input
                type="text"
                autoFocus
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-lavender/30 outline-none"
                placeholder="Search specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === opt.value 
                      ? 'bg-primary-lavender/10 text-deep-lavender font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <Check size={14} className="text-primary-lavender" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-xs text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
