'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, MoreHorizontal, Plus, Square, CheckSquare, Trash2, List, Kanban, Inbox, Clock, Send, ChevronDown, Menu } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useTaskActions } from '../../hooks/useTaskActions';
import { SidebarEnum } from '../../constants/DashboardEnum';
import DeleteConfirmDialog from '../ui/DeleteConfirmDialog';
import SearchDialog from '../ui/SearchDialog';
import TaskListItemRow from '../ui/TaskListItemRow';
import EmptyIllustration from '../ui/EmptyIllustration';
import TaskRowSkeleton from '../ui/TaskRowSkeleton';
import ListMenuIcon from '../ui/ListMenuIcon';

export default function MiddleContentBar() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── UI state from store ──
  const { 
    activeFilter,
    lists, 
    tasks, 
    listSections, 
    addSection, 
    setListViewType,
    deleteList,
    sortBy,
    setSortBy,
    loading,
    searchQuery,
    setSidebarOpen,
    setActiveFilter,
    setActiveTab
  } = useDashboardStore();

  // ── CRUD operations from hook ──
  const { fetchTasks, addTask, toggleTaskStatus, deleteTask, updateTaskSection } = useTaskActions();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  
  // Sort and Group Popover State
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null); // 'group' | 'sort' | null
  const [groupBy, setGroupBy] = useState('none'); // 'none' | 'priority' | 'date'

  // Delete Confirm Modal State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [taskToDeleteTitle, setTaskToDeleteTitle] = useState(null);

  // New task priority and status
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskStatus, setNewTaskStatus] = useState('pending');
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const optionsRef = useRef(null);
  const sortRef = useRef(null);
  const priorityRef = useRef(null);
  const statusRef = useRef(null);

  // Handle task delete click action
  function handleTaskDeleteClick(task) {
    const id = task._id || task.id;
    if (activeFilter === SidebarEnum.TRASH) {
      setTaskToDeleteId(id);
      setTaskToDeleteTitle(task.title);
      setIsDeleteConfirmOpen(true);
    } else {
      deleteTask(id);
    }
  }

  // Sync tab and filter state from URL parameters on initial client mount to avoid hydration mismatch
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const filter = params.get('filter');
    if (tab) setActiveTab(tab);
    if (filter) setActiveFilter(filter);
  }, [setActiveFilter, setActiveTab]);

  // Fetch tasks on mount and whenever filter, sort, or search changes
  useEffect(() => {
    if (mounted) {
      fetchTasks();
    }
  }, [fetchTasks, activeFilter, sortBy, searchQuery, mounted]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setIsOptionsOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
        setActiveSubmenu(null);
      }
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setIsPriorityOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 bg-[#1C1C1C] h-screen" />
    );
  }

  // Resolve current active list details
  const isCustomList = activeFilter.startsWith('list_');
  const activeListId = isCustomList ? activeFilter.replace('list_', '') : null;
  const currentList = isCustomList ? lists.find((l) => l.id === activeListId) : null;

  // View type of current list (list or kanban)
  const viewType = currentList ? currentList.viewType : 'list';

  // Get active list title and icon
  let title = 'All Tasks';
  let titleIcon = <Inbox size={20} className="text-blue-400" />;

  if (isCustomList && currentList) {
    title = currentList.name;
    titleIcon = <ListMenuIcon className={currentList.color} />;
  } else {
    switch (activeFilter) {
      case SidebarEnum.ALL:
        title = 'All Tasks';
        titleIcon = <Inbox size={20} className="text-blue-400" />;
        break;
      case SidebarEnum.PENDING:
        title = 'Pending Tasks';
        titleIcon = <Clock size={20} className="text-amber-500" />;
        break;
      case SidebarEnum.COMPLETED:
        title = 'Completed';
        titleIcon = <CheckSquare size={20} className="text-emerald-500" />;
        break;
      case SidebarEnum.TRASH:
        title = 'Trash';
        titleIcon = <Trash2 size={20} className="text-rose-500" />;
        break;
      default:
        title = 'All Tasks';
        titleIcon = <Inbox size={20} className="text-blue-400" />;
    }
  }

  // Filter tasks based on activeFilter
  const filteredTasks = tasks.filter((task) => {
    // If task is deleted, it must ONLY show up in the trash view
    if (activeFilter === SidebarEnum.TRASH) {
      return task.isDeleted === true;
    }
    if (task.isDeleted === true) {
      return false;
    }

    // If completed flag is active, hide completed tasks (unless viewing completed list)
    if (hideCompleted && task.status === 'completed' && activeFilter !== SidebarEnum.COMPLETED) {
      return false;
    }

    if (isCustomList) {
      return task.listId === activeListId;
    }
    
    switch (activeFilter) {
      case SidebarEnum.PENDING:
        return task.status === 'pending';
      case SidebarEnum.COMPLETED:
        return task.status === 'completed';
      default:
        // All Tasks shows all tasks
        return true;
    }
  });

  // Sort tasks are already retrieved sorted from the server query
  const sortedTasks = filteredTasks;

  // Group tasks if a group option is active
  let groupedTasks = null;
  if (groupBy === 'priority') {
    groupedTasks = {
      'High Priority': sortedTasks.filter((t) => t.priority?.toLowerCase() === 'high'),
      'Medium Priority': sortedTasks.filter((t) => t.priority?.toLowerCase() === 'medium' || !t.priority),
      'Low Priority': sortedTasks.filter((t) => t.priority?.toLowerCase() === 'low'),
    };
  } else if (groupBy === 'date') {
    const todayStr = new Date().toDateString();
    groupedTasks = {
      'Today': sortedTasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === todayStr),
      'Upcoming': sortedTasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() !== todayStr),
      'No Date': sortedTasks.filter((t) => !t.dueDate),
    };
  }

  // Handle adding new task
  function submitNewTask() {
    if (newTaskTitle.trim()) {
      const newTask = {
        title: newTaskTitle.trim(),
        status: newTaskStatus,
        priority: newTaskPriority,
        listId: activeListId,
        section: 'Not Sectioned',
        dueDate: null,
      };
      addTask(newTask);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setNewTaskStatus('pending');
    }
  }

  function handleAddTask(e) {
    if (e.key === 'Enter') submitNewTask();
  }

  // Handle creating new section in Kanban mode
  function handleCreateSection() {
    if (!activeListId) return;
    const sectionName = prompt('Enter new section name:');
    if (sectionName && sectionName.trim()) {
      addSection(activeListId, sectionName.trim());
    }
  }

  // Sections for Kanban view
  const sections = (activeListId && listSections[activeListId]) || ['Not Sectioned'];

  return (
    <div className="flex-1 bg-[#1C1C1C] flex flex-col h-screen overflow-hidden text-zinc-300 relative select-none">
      
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-xl bg-[#242424] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer shadow-lg"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* 1. Header Bar */}
      <header className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-3 pl-10 md:pl-0">
          {titleIcon}
          <h1 className="text-xl font-bold text-zinc-100 capitalize">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          
          {/* Sort Button and Popover */}
          <div className="relative z-30" ref={sortRef}>
            <button 
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setActiveSubmenu(null);
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isSortOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <ArrowUpDown size={18} />
            </button>

            {/* Sort Popover Menu matching Screenshot 1 */}
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#242424] border border-zinc-800 rounded-xl shadow-2xl p-1.5 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150 text-xs">
                
                {/* Group By Option */}
                <button
                  type="button"
                  onClick={() => setActiveSubmenu(activeSubmenu === 'group' ? null : 'group')}
                  className="w-full text-left px-3 py-2.5 text-zinc-300 hover:bg-[#1C1C1C] hover:text-white rounded-lg flex items-center justify-between transition-colors cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2">
                    <List size={14} className="text-zinc-500" />
                    <span>Group by</span>
                  </div>
                  <span className="text-zinc-500 capitalize">{groupBy} &gt;</span>
                </button>

                {/* Group By Submenu (Screenshot 1) */}
                {activeSubmenu === 'group' && (
                  <div className="bg-[#1C1C1C] border border-zinc-800/80 rounded-xl p-1.5 mt-1 flex flex-col gap-0.5 shadow-inner mx-1">
                    {['custom', 'date', 'priority', 'none'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setGroupBy(opt);
                          setActiveSubmenu(null);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg flex items-center justify-between transition-colors cursor-pointer capitalize font-medium"
                      >
                        <span>{opt}</span>
                        {groupBy === opt && <span className="text-blue-500 font-bold text-sm">✓</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sort By Option */}
                <button
                  type="button"
                  onClick={() => setActiveSubmenu(activeSubmenu === 'sort' ? null : 'sort')}
                  className="w-full text-left px-3 py-2.5 text-zinc-300 hover:bg-[#1C1C1C] hover:text-white rounded-lg flex items-center justify-between transition-colors cursor-pointer font-medium border-t border-zinc-800/40"
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={14} className="text-zinc-500" />
                    <span>Sort by</span>
                  </div>
                  <span className="text-zinc-500 capitalize">{sortBy} &gt;</span>
                </button>

                {/* Sort By Submenu (Screenshot 2) */}
                {activeSubmenu === 'sort' && (
                  <div className="bg-[#1C1C1C] border border-zinc-800/80 rounded-xl p-1.5 mt-1 flex flex-col gap-0.5 shadow-inner mx-1">
                    {['custom', 'date', 'title', 'priority'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSortBy(opt);
                          setActiveSubmenu(null);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg flex items-center justify-between transition-colors cursor-pointer capitalize font-medium"
                      >
                        <span>{opt}</span>
                        {sortBy === opt && <span className="text-blue-500 font-bold text-sm">✓</span>}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* More Actions Dropdown Toggle */}
          <div className="relative z-30" ref={optionsRef}>
            <button 
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isOptionsOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <MoreHorizontal size={18} />
            </button>

            {/* View options Context Menu */}
            {isOptionsOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#1e1e1e] border border-zinc-800/30 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {isCustomList && (
                  <>
                    <div className="px-5 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      View
                    </div>
                    {/* View Switcher Icons */}
                    <div className="flex bg-[#1c1c1c] p-0.5 rounded-lg border border-zinc-850 mx-3">
                      <button
                        type="button"
                        onClick={() => {
                          setListViewType(activeListId, 'list');
                          setIsOptionsOpen(false);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                          viewType === 'list' ? 'bg-[#18181b] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <List size={13} />
                        <span>List</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setListViewType(activeListId, 'kanban');
                          setIsOptionsOpen(false);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                          viewType === 'kanban' ? 'bg-[#18181b] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Kanban size={13} />
                        <span>Kanban</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Filter Completed Tasks */}
                <button
                  type="button"
                  onClick={() => {
                    setHideCompleted(!hideCompleted);
                    setIsOptionsOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 text-[13.5px] text-zinc-200 hover:bg-zinc-800/40 hover:text-white rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                >
                  <input 
                    type="checkbox" 
                    checked={hideCompleted} 
                    readOnly 
                    className="rounded border-zinc-700 text-blue-500 pointer-events-none" 
                  />
                  <span>Hide Completed</span>
                </button>

                {/* Dynamic Actions */}
                {isCustomList && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete list "${title}"?`)) {
                        deleteList(activeListId);
                      }
                      setIsOptionsOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-[13.5px] text-zinc-200 hover:bg-zinc-800/40 hover:text-rose-400 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <Trash2 size={14} />
                    <span>Delete List</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col gap-6">
        
        {/* Task Input (Header task addition) */}
        {viewType === 'list' && 
         activeFilter !== SidebarEnum.COMPLETED && 
         activeFilter !== SidebarEnum.PENDING && 
         activeFilter !== SidebarEnum.TRASH && (
          <div className="flex items-center gap-2 bg-[#242424]/40 border border-zinc-800/50 rounded-xl px-4 py-2.5 transition-colors w-full">
            <Plus size={18} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleAddTask}
              placeholder="Add task"
              className="bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none text-sm flex-1"
            />
            
            {/* Priority Pill Selector */}
            <div className="relative shrink-0" ref={priorityRef}>
              <button
                type="button"
                onClick={() => { setIsPriorityOpen(!isPriorityOpen); setIsStatusOpen(false); }}
                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg cursor-pointer transition-colors border ${
                  newTaskPriority === 'high'
                    ? 'bg-rose-950/30 text-rose-400 border-rose-900/40 hover:bg-rose-950/50'
                    : newTaskPriority === 'medium'
                    ? 'bg-amber-950/30 text-amber-400 border-amber-900/40 hover:bg-amber-950/50'
                    : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40 hover:bg-zinc-800'
                }`}
              >
                <span>{newTaskPriority}</span>
                <ChevronDown size={12} />
              </button>
              {isPriorityOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-[#1e1e1e] border border-zinc-800/60 rounded-xl shadow-2xl p-1 flex flex-col gap-0.5 z-40">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setNewTaskPriority(p); setIsPriorityOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer transition-colors flex items-center justify-between ${
                        newTaskPriority === p ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      }`}
                    >
                      <span>{p}</span>
                      {newTaskPriority === p && <span className="text-blue-500 text-sm">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Pill Selector */}
            <div className="relative shrink-0" ref={statusRef}>
              <button
                type="button"
                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsPriorityOpen(false); }}
                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg cursor-pointer transition-colors border ${
                  newTaskStatus === 'completed'
                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/50'
                    : newTaskStatus === 'in-progress'
                    ? 'bg-blue-950/30 text-blue-400 border-blue-900/40 hover:bg-blue-950/50'
                    : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40 hover:bg-zinc-800'
                }`}
              >
                <span>{newTaskStatus}</span>
                <ChevronDown size={12} />
              </button>
              {isStatusOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-[#1e1e1e] border border-zinc-800/60 rounded-xl shadow-2xl p-1 flex flex-col gap-0.5 z-40">
                  {['pending', 'in-progress', 'completed'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setNewTaskStatus(s); setIsStatusOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer transition-colors flex items-center justify-between ${
                        newTaskStatus === s ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      }`}
                    >
                      <span>{s}</span>
                      {newTaskStatus === s && <span className="text-blue-500 text-sm">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={submitNewTask}
              disabled={!newTaskTitle.trim()}
              className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                newTaskTitle.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-zinc-800/40 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Send size={14} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-1.5">
            <TaskRowSkeleton />
            <TaskRowSkeleton />
            <TaskRowSkeleton />
          </div>
        ) : filteredTasks.length === 0 ? (
          /* Empty state illustration */
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-20 select-none">
            <EmptyIllustration />
            <h3 className="text-zinc-400 font-bold mt-2">No tasks</h3>
            <p className="text-zinc-600 text-xs max-w-[200px]">
              {viewType === 'list' 
                ? 'Click the input box to add' 
                : 'Click + in columns to add sections and tasks'}
            </p>
          </div>
        ) : viewType === 'list' ? (
          /* A. Standard List View (Support Grouping & Sorting) */
          <div className="flex-col flex gap-4">
            {groupedTasks ? (
              // Grouped Render
              Object.entries(groupedTasks).map(([groupName, groupList]) => {
                if (groupList.length === 0) return null;
                return (
                  <div key={groupName} className="flex flex-col gap-2">
                    {/* Group Section Header */}
                    <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-2 pt-2 flex items-center justify-between">
                      <span>{groupName}</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{groupList.length}</span>
                    </div>
                    {/* Tasks */}
                    <div className="flex flex-col gap-1.5">
                      {groupList.map((task) => (
                        <TaskListItemRow 
                          key={task._id || task.id} 
                          task={task} 
                          toggleTaskStatus={toggleTaskStatus} 
                          onDeleteClick={handleTaskDeleteClick} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              // Standard Flat Render
              <div className="flex flex-col gap-1.5">
                {sortedTasks.map((task) => (
                  <TaskListItemRow 
                    key={task._id || task.id} 
                    task={task} 
                    toggleTaskStatus={toggleTaskStatus} 
                    onDeleteClick={handleTaskDeleteClick} 
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* B. Kanban View */
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Column Headers Section */}
            <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-3 shrink-0">
              <span className="text-zinc-400 font-bold text-sm">Not Sectioned</span>
              <span className="text-zinc-600 text-xs">0</span>
              <button className="text-zinc-500 hover:text-zinc-200 cursor-pointer">
                <Plus size={14} />
              </button>
              <button className="text-zinc-500 hover:text-zinc-200 cursor-pointer">
                <MoreHorizontal size={14} />
              </button>
              
              <button 
                onClick={handleCreateSection}
                className="text-blue-500 hover:text-blue-400 text-xs font-semibold flex items-center gap-1.5 ml-4 cursor-pointer transition-colors"
              >
                <Plus size={14} />
                <span>New section</span>
              </button>
            </div>

            {/* Kanban Columns Grid */}
            <div className="flex-1 flex gap-4 overflow-x-auto items-start pb-4">
              {sections.map((secName) => {
                const secTasks = sortedTasks.filter((t) => t.section === secName);
                return (
                  <div key={secName} className="flex flex-col gap-3 bg-[#242424]/15 border border-zinc-800/40 rounded-2xl p-4 w-[260px] shrink-0 h-full max-h-[500px]">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-500 border-b border-zinc-800/50 pb-2">
                      <span className="truncate max-w-[160px]">{secName}</span>
                      <span className="bg-zinc-800/80 px-2 py-0.5 rounded-full text-[10px]">{secTasks.length}</span>
                    </div>

                    {/* Task List under this section */}
                    <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
                      {secTasks.map((task) => (
                        <div key={task._id || task.id} className="bg-[#242424]/60 border border-zinc-800/60 rounded-xl p-3 flex flex-col gap-2 shadow-sm hover:border-zinc-700 transition-colors">
                          <div className="flex items-start gap-2.5">
                            <button 
                              onClick={() => toggleTaskStatus(task._id || task.id)}
                              className="text-zinc-500 hover:text-blue-500 cursor-pointer shrink-0 mt-0.5"
                            >
                              {task.status === 'completed' ? (
                                <CheckSquare size={16} className="text-blue-500" />
                              ) : (
                                <Square size={16} />
                              )}
                            </button>
                            <span className={`text-[13px] leading-tight font-medium ${
                              task.status === 'completed' ? 'line-through text-zinc-600' : 'text-zinc-200'
                            }`}>
                              {task.title}
                            </span>
                          </div>

                          {/* Action footer inside card: Move & Delete */}
                          <div className="flex justify-between items-center mt-1 border-t border-zinc-800/40 pt-2 text-[10px] text-zinc-500">
                            {/* Simple Section Switcher */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] uppercase tracking-wider text-zinc-600">Move:</span>
                              <select 
                                value={task.section || 'Not Sectioned'}
                                onChange={(e) => updateTaskSection(task._id || task.id, e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 rounded-md py-0.5 px-1 focus:outline-none cursor-pointer"
                              >
                                {sections.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>

                            <button 
                              onClick={() => handleTaskDeleteClick(task)}
                              className="text-zinc-600 hover:text-rose-400 cursor-pointer p-0.5 rounded transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add task inside this column */}
                      <button
                        onClick={() => {
                          const taskName = prompt(`Enter task name for column "${secName}":`);
                          if (taskName && taskName.trim()) {
                            const newTask = {
                              title: taskName.trim(),
                              status: 'pending',
                              priority: 'medium',
                              listId: activeListId,
                              section: secName,
                              dueDate: null,
                            };
                            addTask(newTask);
                          }
                        }}
                        className="flex items-center justify-center gap-1.5 border border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer mt-1"
                      >
                        <Plus size={13} />
                        <span>Add task</span>
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* Reusable Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setTaskToDeleteId(null);
          setTaskToDeleteTitle(null);
        }}
        onDelete={() => {
          if (taskToDeleteId) {
            deleteTask(taskToDeleteId);
          }
        }}
        title={`Delete task "${taskToDeleteTitle}"?`}
        description="This task will be permanently deleted."
      />

      {/* Search Overlay Dialog Modal */}
      <SearchDialog />

    </div>
  );
}
