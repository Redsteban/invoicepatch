import React from 'react';

interface FreemiumModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function FreemiumModal({ open, onClose, children }: FreemiumModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
} 