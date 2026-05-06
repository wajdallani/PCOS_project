import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import AssistantChat from './AssistantChat';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AssistantChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(123,95,165,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 group z-50 ${
          isOpen ? 'bg-white text-deep-lavender rotate-90' : 'bg-deep-lavender text-white'
        }`}
        aria-label="Chat with AI"
      >
        <div className={`absolute inset-0 rounded-full animate-pulse opacity-20 group-hover:opacity-40 ${
          isOpen ? 'bg-white' : 'bg-deep-lavender'
        }`}></div>
        {isOpen ? <X size={24} className="relative z-10" /> : <MessageSquare size={24} className="relative z-10" />}
      </button>
    </>
  );
}
