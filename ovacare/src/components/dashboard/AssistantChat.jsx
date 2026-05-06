import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Image as ImageIcon, Loader2, Sparkles, Paperclip } from 'lucide-react';
import { chatWithAssistant } from '../../services/api';

export default function AssistantChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm OvaCare, your AI-powered women's health assistant. I can help you with PCOS Risk Assessment, Acne Analysis, and Progression Tracking. What would you like to know today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let imageB64 = null;
      if (selectedImage) {
        // Simple B64 conversion placeholder - in real app would use FileReader
        // imageB64 = selectedImage; 
      }

      const response = await chatWithAssistant(input, imageB64);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.response,
        intent: response.intent,
        agent_results: response.risk_data || response.acne_data || response.progression_data
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-8 w-[400px] max-w-[90vw] h-[600px] max-h-[80vh] bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary-lavender to-deep-lavender text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg leading-none">Ova Assistant</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Online</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-primary-lavender text-white' : 'bg-white border border-gray-100 text-deep-lavender shadow-sm'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-deep-lavender text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 border border-gray-50 rounded-tl-none'
              }`}>
                {msg.content}
                
                {msg.agent_results && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-[10px] font-bold text-primary-lavender uppercase tracking-widest">
                    <Sparkles size={12} />
                    Agent: {msg.intent}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-deep-lavender">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white text-gray-400 text-sm border border-gray-50 rounded-tl-none italic">
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        {selectedImage && (
          <div className="mb-3 p-2 bg-gray-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-primary-lavender" />
              <span className="text-xs font-medium text-gray-500">Image attached</span>
            </div>
            <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-500">
              <X size={14} />
            </button>
          </div>
        )}
        <div className="relative flex items-center gap-2">
          <button className="p-3 text-gray-400 hover:text-primary-lavender transition-colors rounded-xl hover:bg-gray-50">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Ask about PCOS, symptoms, or diets..."
            className="flex-1 bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-lavender/30 font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="p-3 bg-deep-lavender text-white rounded-xl shadow-glow-sm hover:shadow-glow hover:bg-ai-accent transition-all disabled:opacity-40"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
