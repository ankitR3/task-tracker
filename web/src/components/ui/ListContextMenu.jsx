'use client';

import React, { useEffect, useRef } from 'react';

export default function ListContextMenu({ isOpen, onClose, onDelete }) {
  const containerRef = useRef(null);

  // Close context menu on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 mt-1.5 w-44 bg-[#1e1e1e] border border-zinc-800/30 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-100 z-50"
    >
      <button
        type="button"
        onClick={(e) => { 
          e.stopPropagation(); 
          onClose(); 
        }}
        className="w-full text-left px-5 py-3 text-[13.5px] text-zinc-200 hover:bg-zinc-800/40 hover:text-white rounded-xl transition-colors cursor-pointer font-medium"
      >
        Edit
      </button>
      
      <button
        type="button"
        onClick={(e) => { 
          e.stopPropagation(); 
          onClose(); 
        }}
        className="w-full text-left px-5 py-3 text-[13.5px] text-zinc-200 hover:bg-zinc-800/40 hover:text-white rounded-xl transition-colors cursor-pointer font-medium"
      >
        Pin
      </button>
      
      <button
        type="button"
        onClick={(e) => { 
          e.stopPropagation(); 
          onClose(); 
        }}
        className="w-full text-left px-5 py-3 text-[13.5px] text-zinc-200 hover:bg-zinc-800/40 hover:text-white rounded-xl transition-colors cursor-pointer font-medium"
      >
        Duplicate
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        className="w-full text-left px-5 py-3 text-[13.5px] text-zinc-200 hover:bg-zinc-800/40 hover:text-rose-400 rounded-xl transition-colors cursor-pointer font-medium"
      >
        Delete
      </button>
    </div>
  );
}
