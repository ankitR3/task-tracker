'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, AlignLeft, List, Kanban } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export default function AddListDialog() {
  const { isAddListOpen, setAddListOpen, addList } = useDashboardStore();
  
  const [listName, setListName] = useState('');
  const [viewType, setViewType] = useState('list'); // 'list' | 'kanban'
  
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isAddListOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  }, [isAddListOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setAddListOpen(false);
      }
    }
    if (isAddListOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddListOpen, setAddListOpen]);

  if (!isAddListOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!listName.trim()) return;

    const newList = {
      id: listName.toLowerCase().replace(/\s+/g, '-'),
      name: listName,
      color: 'text-zinc-400', // default gray color
      viewType,
      folder: null,
      listType: 'Task List',
      showInSmartList: 'All tasks',
      emoji: '📁'
    };

    addList(newList);
    setListName('');
    setViewType('list');
    setAddListOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0 cursor-default" onClick={() => setAddListOpen(false)} />

      {/* Modal Box */}
      <div className="relative w-full max-w-[800px] h-[340px] bg-[#1e1e1e] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button top-right */}
        <button 
          onClick={() => setAddListOpen(false)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 p-1 rounded-lg transition-colors cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* LEFT PANEL: Form Inputs */}
        <form onSubmit={handleSubmit} className="w-[55%] p-6 flex flex-col justify-between border-r border-zinc-800/80">
          
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-zinc-100">Add List</h2>
            
            {/* 1. List Name Input */}
            <div className="flex items-center gap-3 bg-[#242424] border border-zinc-800 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500/80 transition-colors">
              <AlignLeft size={18} className="text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Name"
                className="bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none text-sm w-full"
                required
              />
            </div>

            {/* 2. View Type (List vs Kanban) */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400 font-medium">View Type</span>
              <div className="flex bg-[#242424] p-0.5 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setViewType('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    viewType === 'list' ? 'bg-[#18181b] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <List size={13} />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    viewType === 'kanban' ? 'bg-[#18181b] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Kanban size={13} />
                  <span>Kanban</span>
                </button>
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => setAddListOpen(false)}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer transition-colors shadow-md"
            >
              Add
            </button>
          </div>

        </form>

        {/* RIGHT PANEL: Live App Mockup Preview */}
        <div className="w-[45%] bg-[#171717] p-6 flex flex-col justify-center items-center relative select-none">
          <div className="w-[280px] h-[260px] bg-[#1e1e1e] rounded-xl border border-zinc-800/60 shadow-xl overflow-hidden flex flex-col text-left">
            {/* Mock Header */}
            <div className="p-4 border-b border-zinc-800/60 flex items-center gap-2">
              <AlignLeft size={14} className="text-zinc-500" />
              <span className="text-sm font-bold truncate max-w-[200px] text-zinc-100">
                {listName || 'Name'}
              </span>
            </div>
            {/* Conditional Mockup Preview based on viewType */}
            {viewType === 'list' ? (
              /* List View Mockup */
              <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Getting Started 2</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded border border-zinc-700 flex items-center justify-center bg-[#252526] shrink-0" />
                    <div className="h-2.5 bg-zinc-800 rounded w-4/5" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded border border-zinc-700 flex items-center justify-center bg-[#252526] shrink-0" />
                    <div className="h-2.5 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ) : (
              /* Kanban View Mockup */
              <div className="p-3 flex gap-2 overflow-x-auto h-full items-start">
                {/* Column 1 */}
                <div className="flex flex-col gap-2 w-[76px] shrink-0">
                  <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 px-1">
                    <div className="h-1.5 w-8 bg-zinc-800 rounded" />
                    <span>5</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-[#252526]/80 border border-zinc-800/80 rounded-md p-1.5 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-sm border border-zinc-700 shrink-0" />
                          <div className="h-1.5 bg-zinc-800 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-2 w-[76px] shrink-0">
                  <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 px-1">
                    <div className="h-1.5 w-6 bg-zinc-800 rounded" />
                    <span>2</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-[#252526]/80 border border-zinc-800/80 rounded-md p-1.5 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-sm border border-zinc-700 shrink-0" />
                          <div className="h-1.5 bg-zinc-800 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-2 w-[76px] shrink-0">
                  <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 px-1">
                    <div className="h-1.5 w-7 bg-zinc-800 rounded" />
                    <span>3</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[1].map((i) => (
                      <div key={i} className="bg-[#252526]/80 border border-zinc-800/80 rounded-md p-1.5 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-sm border border-zinc-700 shrink-0" />
                          <div className="h-1.5 bg-zinc-800 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
