'use client';

import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export default function SearchDialog() {
  const { isSearchOpen, setSearchOpen, searchQuery, setSearchQuery, tasks } = useDashboardStore();
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSearchQuery('');
        setSearchOpen(false);
      }
    }
    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen, setSearchQuery]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      {/* Click outside backdrop to close */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={() => {
          setSearchQuery('');
          setSearchOpen(false);
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[520px] bg-[#1e1e1e] border border-zinc-800/80 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Search Input Row */}
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-3">
          <Search size={22} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none text-base w-full"
          />
          <button 
            onClick={() => {
              setSearchQuery('');
              setSearchOpen(false);
            }}
            className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2">
          <button className="bg-zinc-800 hover:bg-zinc-700/80 text-zinc-400 hover:text-zinc-200 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer">
            task
          </button>
          <button className="bg-zinc-800 hover:bg-zinc-700/80 text-zinc-400 hover:text-zinc-200 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer">
            List
          </button>
        </div>

        {/* Results Container */}
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
          {searchQuery.trim() === '' ? (
            /* Center Illustration when query is empty */
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4 select-none">
              <div className="w-48 h-32 flex items-center justify-center">
                <svg viewBox="0 0 200 120" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Blob */}
                  <path 
                    d="M30,60 C25,25 60,15 100,20 C140,25 175,30 170,65 C165,100 130,110 95,105 C60,100 35,95 30,60 Z" 
                    fill="#252525" 
                    opacity="0.6"
                  />
                  <circle cx="100" cy="55" r="45" stroke="#444" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="100" cy="55" r="28" stroke="#444" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Left hand */}
                  <path d="M40,110 L80,85 C84,82 89,84 91,89 L93,94 C95,99 92,104 87,106 L55,120 Z" fill="#3b82f6" />
                  <path d="M78,86 C74,80 82,72 87,77 L92,83 C94,86 93,90 90,92 L84,95 C81,96 79,90 78,86 Z" fill="#e4e4e7" />
                  {/* Right hand */}
                  <path d="M160,110 L120,85 C116,82 111,84 109,89 L107,94 C105,99 108,104 113,106 L145,120 Z" fill="#3b82f6" />
                  <path d="M122,86 C126,80 118,72 113,77 L108,83 C106,86 107,90 110,92 L116,95 C119,96 121,90 122,86 Z" fill="#e4e4e7" />
                  {/* Binoculars */}
                  <g transform="rotate(-5 90 55)">
                    <rect x="73" y="38" width="22" height="34" rx="4" fill="#3f3f46" stroke="#27272a" strokeWidth="1.5" />
                    <rect x="71" y="66" width="26" height="8" rx="2" fill="#52525b" />
                    <ellipse cx="84" cy="70" rx="9" ry="3.5" fill="#2563eb" stroke="#93c5fd" strokeWidth="1" />
                  </g>
                  <g transform="rotate(5 110 55)">
                    <rect x="105" y="38" width="22" height="34" rx="4" fill="#3f3f46" stroke="#27272a" strokeWidth="1.5" />
                    <rect x="103" y="66" width="26" height="8" rx="2" fill="#52525b" />
                    <ellipse cx="116" cy="70" rx="9" ry="3.5" fill="#2563eb" stroke="#93c5fd" strokeWidth="1" />
                  </g>
                  <rect x="94" y="46" width="12" height="5" fill="#27272a" />
                </svg>
              </div>
              <span className="text-zinc-500 text-sm tracking-wide">
                Enter keywords to search
              </span>
            </div>
          ) : tasks.length === 0 ? (
            /* Empty Search Results */
            <div className="flex flex-col items-center justify-center py-10 text-center select-none">
              <span className="text-zinc-500 text-sm">
                No tasks found matching &ldquo;{searchQuery}&rdquo;
              </span>
            </div>
          ) : (
            /* Render Matched Tasks */
            <div className="flex flex-col gap-1.5">
              {tasks.map((task) => (
                <div 
                  key={task._id || task.id}
                  className="flex items-center justify-between bg-zinc-800/20 border border-zinc-800/60 rounded-xl px-4 py-3 hover:bg-zinc-800/40 transition-colors select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className={`text-[13.5px] font-medium text-zinc-200 truncate ${task.status === 'completed' ? 'line-through text-zinc-500' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.priority && (
                    <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider shrink-0">
                      {task.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
