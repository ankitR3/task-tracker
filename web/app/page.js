'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import LeftIconBar from "@/src/components/layout/LeftIconBar";
import LeftSidebar from "@/src/components/layout/LeftSidebar";
import MiddleContentBar from "@/src/components/layout/MiddleContentBar";
import { useDashboardStore } from '@/src/store/useDashboardStore';

export default function Home() {
  const { isSidebarOpen, setSidebarOpen } = useDashboardStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#121212] text-zinc-100 font-sans relative">
      
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-xl bg-[#242424] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer shadow-lg"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Overlay Backdrop (mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Icon Bar - hidden on mobile, visible on md+ */}
      <div className={`
        fixed md:relative z-40 h-screen shrink-0
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <LeftIconBar />
      </div>

      {/* Left Sidebar - hidden on mobile, visible on md+ */}
      <div className={`
        fixed md:relative z-40 h-screen shrink-0
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-16' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <LeftSidebar />
      </div>

      {/* Main Content - always visible, full width on mobile */}
      <MiddleContentBar />
    </div>
  );
}
