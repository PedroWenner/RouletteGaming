import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-colors duration-500">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg glass-panel rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none opacity-50" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--card-border)] relative">
          <h2 className="text-xl font-black italic tracking-tighter text-[var(--app-text)] uppercase">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-[var(--app-text-dim)] hover:text-[var(--app-text)] hover:bg-[var(--app-text)]/5 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 relative text-[var(--app-text)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
