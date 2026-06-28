import { create } from 'zustand';
import { DashboardEnum, SidebarEnum } from '../constants/DashboardEnum';
import { getAllTasksApi } from '../components/tasks/getAllTask';
import { createTaskApi } from '../components/tasks/createTask';
import { deleteTaskApi } from '../components/tasks/deleteTask';
import { updateTaskApi, updateTaskStatusApi } from '../components/tasks/updateTask';

export const useDashboardStore = create((set) => ({
    activeTab: DashboardEnum.TASK,
    activeFilter: SidebarEnum.ALL,
    isSearchOpen: false,
    isAddListOpen: false,
    isSidebarOpen: false,
    sortBy: 'custom',
    searchQuery: '',
    
    lists: [],
    tasks: [],
    listSections: {},
    
    setActiveTab: (tab) => set({ activeTab: tab }),
    
    setActiveFilter: (filter) => {
      set({ activeFilter: filter });
      useDashboardStore.getState().fetchTasks();
    },
    
    setSearchOpen: (open) => set({ isSearchOpen: open }),
    setAddListOpen: (open) => set({ isAddListOpen: open }),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    
    setSortBy: (sortBy) => {
      set({ sortBy });
      useDashboardStore.getState().fetchTasks();
    },
    
    setSearchQuery: (searchQuery) => {
      set({ searchQuery });
      useDashboardStore.getState().fetchTasks();
    },
    
    addList: (list) => set((state) => ({ 
      lists: [...state.lists, list],
      listSections: {
        ...state.listSections,
        [list.id]: ['Not Sectioned']
      }
    })),
    
    deleteList: (id) => set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
      tasks: state.tasks.filter((t) => t.listId !== id)
    })),

    setListViewType: (listId, viewType) => set((state) => ({
      lists: state.lists.map((l) => l.id === listId ? { ...l, viewType } : l)
    })),

    fetchTasks: async () => {
      const { activeFilter, sortBy, searchQuery } = useDashboardStore.getState();
      const params = {};

      if (activeFilter.startsWith('list_')) {
        params.listId = activeFilter.replace('list_', '');
      } else if (activeFilter === SidebarEnum.PENDING) {
        params.status = 'pending';
      } else if (activeFilter === SidebarEnum.COMPLETED) {
        params.status = 'completed';
      } else if (activeFilter === SidebarEnum.TRASH) {
        params.isDeleted = 'true';
      }

      if (sortBy === 'date') {
        params.sort = 'dueDate';
      } else if (sortBy === 'priority') {
        params.sort = 'priority';
      } else if (sortBy === 'title') {
        params.sort = 'title';
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      try {
        const json = await getAllTasksApi(params);
        if (json.success) {
          set({ tasks: json.data });
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    },

    addTask: async (taskData) => {
      try {
        const json = await createTaskApi(taskData);
        if (json.success) {
          set((state) => ({ tasks: [...state.tasks, json.data] }));
        }
      } catch (err) {
        console.error('Failed to add task:', err);
      }
    },

    toggleTaskStatus: async (id) => {
      const currentTask = useDashboardStore.getState().tasks.find((t) => t._id === id || t.id === id);
      if (!currentTask) return;
      const dbId = currentTask._id || currentTask.id;
      const newStatus = currentTask.status === 'completed' ? 'pending' : 'completed';

      try {
        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === id || t.id === id) ? { ...t, status: newStatus } : t)
        }));

        const json = await updateTaskStatusApi(dbId, newStatus);
        if (!json.success) {
          // Revert
          set((state) => ({
            tasks: state.tasks.map((t) => (t._id === id || t.id === id) ? { ...t, status: currentTask.status } : t)
          }));
        }
      } catch (err) {
        console.error('Failed to toggle status:', err);
        // Revert
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === id || t.id === id) ? { ...t, status: currentTask.status } : t)
        }));
      }
    },

    deleteTask: async (id) => {
      const currentTask = useDashboardStore.getState().tasks.find((t) => t._id === id || t.id === id);
      if (!currentTask) return;
      const dbId = currentTask._id || currentTask.id;

      try {
        // Optimistic update
        set((state) => ({
          tasks: state.tasks.filter((t) => t._id !== id && t.id !== id)
        }));

        const json = await deleteTaskApi(dbId);
        if (!json.success) {
          // Revert
          set((state) => ({
            tasks: [...state.tasks, currentTask]
          }));
        }
      } catch (err) {
        console.error('Failed to delete task:', err);
        // Revert
        set((state) => ({
          tasks: [...state.tasks, currentTask]
        }));
      }
    },

    updateTaskSection: async (id, section) => {
      const currentTask = useDashboardStore.getState().tasks.find((t) => t._id === id || t.id === id);
      if (!currentTask) return;
      const dbId = currentTask._id || currentTask.id;

      try {
        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === id || t.id === id) ? { ...t, section } : t)
        }));

        const json = await updateTaskApi(dbId, { section });
        if (!json.success) {
          // Revert
          set((state) => ({
            tasks: state.tasks.map((t) => (t._id === id || t.id === id) ? { ...t, section: currentTask.section } : t)
          }));
        }
      } catch (err) {
        console.error('Failed to update task section:', err);
        // Revert
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === id || t.id === id) ? { ...t, section: currentTask.section } : t)
        }));
      }
    },

    addSection: (listId, sectionName) => set((state) => ({
      listSections: {
        ...state.listSections,
        [listId]: [...(state.listSections[listId] || ['Not Sectioned']), sectionName]
      }
    }))
}));