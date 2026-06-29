'use client';

import React from 'react';
import { Inbox, Clock, Trash2 } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { SidebarEnum } from '../../constants/DashboardEnum';

// Custom Completed SVG Icon (Checkmark inside checkbox)
function CompletedIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function LeftSidebar() {
  const [mounted, setMounted] = React.useState(false);
  const { activeFilter, setActiveFilter, isSidebarOpen, setSidebarOpen } = useDashboardStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="hidden md:flex flex-col w-60 bg-[#1C1C1C] border-r border-[#2d2d2d] h-screen shrink-0" />
    );
  }

  function handleFilterChange(filter) {
    const params = new URLSearchParams(window.location.search);
    params.set('filter', filter);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
    setActiveFilter(filter);
    setSidebarOpen(false); // Close sidebar on mobile
  }

  const topItems = [
    {
      key: SidebarEnum.ALL,
      label: 'All Tasks',
      icon: <Inbox size={21} />,
      color: 'text-blue-400',
    },
    {
      key: SidebarEnum.PENDING,
      label: 'Pending Tasks',
      icon: <Clock size={21} />,
      color: 'text-amber-500',
    },
  ];

  const bottomItems = [
    {
      key: SidebarEnum.COMPLETED,
      label: 'Completed',
      icon: <CompletedIcon />,
      color: 'text-emerald-500',
    },
    {
      key: SidebarEnum.TRASH,
      label: 'Trash',
      icon: <Trash2 size={21} />,
      color: 'text-rose-500',
    },
  ];

  return (
    <>
      {/* Sidebar Overlay Backdrop (mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed md:relative z-40 h-screen shrink-0
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-16' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="flex flex-col w-60 bg-[#1C1C1C] border-r border-[#2d2d2d] h-screen text-zinc-300 py-6 px-3 select-none justify-between overflow-y-auto">
          {/* Top half: main navigation */}
          <div className="flex flex-col gap-5">
            
            {/* Section 1: Main Tabs */}
            <nav className="flex flex-col gap-0.5">
              {topItems.map((item) => {
                const isActive = activeFilter === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleFilterChange(item.key)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
                    }`}
                  >
                    <span className={isActive ? 'text-zinc-100' : 'text-zinc-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Bottom half: completed & trash */}
          <div className="flex flex-col gap-4 mt-auto">
            <hr className="border-zinc-800/60 mx-1" />

            <nav className="flex flex-col gap-0.5">
              {bottomItems.map((item) => {
                const isActive = activeFilter === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleFilterChange(item.key)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
                    }`}
                  >
                    <span className={isActive ? 'text-zinc-100' : 'text-zinc-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

        </div>
      </div>
    </>
  );
}
