import { useCallback } from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { SidebarEnum } from '../constants/DashboardEnum';
import { getAllTasksApi } from '../components/tasks/getAllTask';
import { createTaskApi } from '../components/tasks/createTask';
import { deleteTaskApi } from '../components/tasks/deleteTask';
import { updateTaskApi, updateTaskStatusApi } from '../components/tasks/updateTask';

/**
 * Custom hook that provides all task CRUD operations.
 * Reads state from the store and uses store setters for updates.
 * Keeps the store clean — only UI state lives there.
 */
export function useTaskActions() {

  const fetchTasks = useCallback(async () => {
    const { activeFilter, sortBy, searchQuery } = useDashboardStore.getState();
    useDashboardStore.setState({ loading: true });

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
        useDashboardStore.setState({ tasks: json.data });
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      useDashboardStore.setState({ loading: false });
    }
  }, []);

  const addTask = useCallback(async (taskData) => {
    try {
      const json = await createTaskApi(taskData);
      if (json.success) {
        useDashboardStore.setState((state) => ({
          tasks: [...state.tasks, json.data],
        }));
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id) => {
    const { tasks } = useDashboardStore.getState();
    const currentTask = tasks.find((t) => t._id === id || t.id === id);
    if (!currentTask) return;

    const dbId = currentTask._id || currentTask.id;
    const newStatus = currentTask.status === 'completed' ? 'pending' : 'completed';

    // Optimistic update
    useDashboardStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        (t._id === id || t.id === id) ? { ...t, status: newStatus } : t
      ),
    }));

    try {
      const json = await updateTaskStatusApi(dbId, newStatus);
      if (!json.success) {
        // Revert
        useDashboardStore.setState((state) => ({
          tasks: state.tasks.map((t) =>
            (t._id === id || t.id === id) ? { ...t, status: currentTask.status } : t
          ),
        }));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
      // Revert
      useDashboardStore.setState((state) => ({
        tasks: state.tasks.map((t) =>
          (t._id === id || t.id === id) ? { ...t, status: currentTask.status } : t
        ),
      }));
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    const { tasks } = useDashboardStore.getState();
    const currentTask = tasks.find((t) => t._id === id || t.id === id);
    if (!currentTask) return;

    const dbId = currentTask._id || currentTask.id;

    // Optimistic update
    useDashboardStore.setState((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id && t.id !== id),
    }));

    try {
      const json = await deleteTaskApi(dbId);
      if (!json.success) {
        // Revert
        useDashboardStore.setState((state) => ({
          tasks: [...state.tasks, currentTask],
        }));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      // Revert
      useDashboardStore.setState((state) => ({
        tasks: [...state.tasks, currentTask],
      }));
    }
  }, []);

  const updateTaskSection = useCallback(async (id, section) => {
    const { tasks } = useDashboardStore.getState();
    const currentTask = tasks.find((t) => t._id === id || t.id === id);
    if (!currentTask) return;

    const dbId = currentTask._id || currentTask.id;

    // Optimistic update
    useDashboardStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        (t._id === id || t.id === id) ? { ...t, section } : t
      ),
    }));

    try {
      const json = await updateTaskApi(dbId, { section });
      if (!json.success) {
        // Revert
        useDashboardStore.setState((state) => ({
          tasks: state.tasks.map((t) =>
            (t._id === id || t.id === id) ? { ...t, section: currentTask.section } : t
          ),
        }));
      }
    } catch (err) {
      console.error('Failed to update task section:', err);
      // Revert
      useDashboardStore.setState((state) => ({
        tasks: state.tasks.map((t) =>
          (t._id === id || t.id === id) ? { ...t, section: currentTask.section } : t
        ),
      }));
    }
  }, []);

  return {
    fetchTasks,
    addTask,
    toggleTaskStatus,
    deleteTask,
    updateTaskSection,
  };
}
