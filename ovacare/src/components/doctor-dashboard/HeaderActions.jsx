import React from 'react';
import { Save, Send } from 'lucide-react';

export default function HeaderActions({ onSaveDraft, onFinalize }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onSaveDraft}
        className="px-5 py-2.5 rounded-full border border-primary-lavender/30 bg-white text-deep-lavender text-xs font-bold uppercase tracking-widest hover:bg-primary-lavender/5 transition-all shadow-sm flex items-center gap-2"
      >
        <Save size={14} /> Save Draft
      </button>
      <button
        onClick={onFinalize}
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-lavender to-deep-lavender text-white text-xs font-bold uppercase tracking-widest hover:shadow-glow hover:-translate-y-0.5 transition-all shadow-md flex items-center gap-2"
      >
        <Send size={14} /> Finalize & Send to Patient
      </button>
    </div>
  );
}
