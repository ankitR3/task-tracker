import React from 'react';

export default function TaskRowSkeleton() {
  return (
    <div className="flex items-center justify-between bg-[#242424]/20 border border-zinc-800/20 rounded-xl px-4 py-3.5 select-none animate-pulse">
      <div className="flex items-center gap-3.5 flex-1">
        <div className="w-[19px] h-[19px] rounded bg-zinc-800/80 shrink-0"></div>
        <div className="h-4 bg-zinc-800/80 rounded-lg w-1/3 min-w-[120px]"></div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-14 h-5 bg-zinc-800/80 rounded"></div>
          <div className="w-16 h-5 bg-zinc-800/80 rounded"></div>
        </div>
      </div>
    </div>
  );
}
