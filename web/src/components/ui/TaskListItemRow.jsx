import React from 'react';
import { Square, CheckSquare, Trash2 } from 'lucide-react';

export default function TaskListItemRow({ task, toggleTaskStatus, onDeleteClick }) {
  const id = task._id || task.id;
  return (
    <div 
      className="group flex items-center justify-between bg-[#242424]/30 hover:bg-[#242424]/60 border border-zinc-800/30 rounded-xl px-4 py-3.5 transition-colors"
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-4">
        <button 
          onClick={() => toggleTaskStatus(id)}
          className="text-zinc-500 hover:text-blue-500 cursor-pointer shrink-0 transition-colors"
        >
          {task.status === 'completed' ? (
            <CheckSquare size={19} className="text-blue-500" />
          ) : (
            <Square size={19} />
          )}
        </button>
        <span className={`text-[14.5px] truncate ${
          task.status === 'completed' ? 'line-through text-zinc-600' : 'text-zinc-200'
        }`}>
          {task.title}
        </span>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        {/* Priority & Status Badges */}
        <div className="hidden sm:flex items-center gap-2">
          {task.priority && (
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
              task.priority.toLowerCase() === 'high' 
                ? 'bg-rose-950/20 text-rose-400 border-rose-900/30' 
                : task.priority.toLowerCase() === 'medium'
                ? 'bg-amber-950/20 text-amber-400 border-amber-900/30'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700/40'
            }`}>
              {task.priority}
            </span>
          )}
          {task.status && (
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
              task.status.toLowerCase() === 'completed' 
                ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' 
                : task.status.toLowerCase() === 'in-progress'
                ? 'bg-blue-950/20 text-blue-400 border-blue-900/30'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700/40'
            }`}>
              {task.status}
            </span>
          )}
        </div>

        {/* Delete button (shows on hover) */}
        <button 
          onClick={() => onDeleteClick(task)}
          className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer transition-all duration-150 shrink-0"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
