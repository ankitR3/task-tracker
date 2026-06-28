'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function DeleteConfirmDialog({ isOpen, onClose, onDelete, title, description }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      {/* Click outside backdrop to close */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={onClose}
      />

      {/* Dialog Card Container */}
      <div className="relative w-full max-w-[420px] bg-[#1e1e1e] border border-zinc-800/60 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <h3 className="text-base font-bold text-zinc-100 leading-snug pr-6">
            {title || 'Delete item?'}
          </h3>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer p-0.5 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description Body */}
        {description && (
          <p className="text-[13px] text-zinc-400 leading-relaxed">
            {description}
          </p>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center justify-end gap-2.5 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800/40 text-zinc-300 font-semibold cursor-pointer text-xs transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer text-xs transition-colors"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
