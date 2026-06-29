'use client';

import React from 'react';
import { SquareCheck, Search, User } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { DashboardEnum } from '../../constants/DashboardEnum';

export default function LeftIconBar() {
  const [mounted, setMounted] = React.useState(false);
  const { activeTab, setActiveTab, setSearchOpen, isSidebarOpen } = useDashboardStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="hidden md:flex flex-col items-center w-16 bg-[#242424] border-r border-[#2a2a2a] h-screen shrink-0" />
    );
  }

  function handleTabChange(tab) {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
    setActiveTab(tab);
  }

  return (
    <div className={`
      fixed md:relative z-40 h-screen shrink-0
      transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
    `}>
      <div className="flex flex-col items-center py-6 w-16 bg-[#242424] border-r border-[#2a2a2a] h-screen text-zinc-400 select-none gap-6">
        
        {/* 1. Profile Avatar */}
        <div className="relative cursor-pointer mb-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center text-white font-semibold shadow-md">
            <User size={20} className="text-zinc-300" />
          </div>
          {/* Gold Crown Badge matching the screenshot */}
          <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow border border-[#1a1a1a]">
            👑
          </span>
        </div>

        {/* 2. Tasks Icon */}
        <button
          onClick={() => handleTabChange(DashboardEnum.TASK)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
            activeTab === DashboardEnum.TASK
              ? 'bg-white text-zinc-950 shadow-md scale-105'
              : 'hover:bg-zinc-800 hover:text-zinc-200'
          }`}
          title="Tasks"
        >
          <SquareCheck size={22} strokeWidth={2.2} />
        </button>



        {/* 4. Search Icon */}
        <button
          onClick={() => {
            setSearchOpen(true);
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-zinc-800 hover:text-zinc-200"
          title="Search"
        >
          <Search size={22} strokeWidth={2.2} />
        </button>

      </div>
    </div>
  );
}
