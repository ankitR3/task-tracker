import { create } from 'zustand';
import { DashboardEnum, SidebarEnum } from '../constants/DashboardEnum';

const getInitialFilter = () => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return params.get('filter') || SidebarEnum.ALL;
    }
    return SidebarEnum.ALL;
};

const getInitialTab = () => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || DashboardEnum.TASK;
    }
    return DashboardEnum.TASK;
};

export const useDashboardStore = create((set) => ({
    // ── UI State ──────────────────────────────────────────
    activeTab: getInitialTab(),
    activeFilter: getInitialFilter(),
    isSearchOpen: false,
    isAddListOpen: false,
    isSidebarOpen: false,
    sortBy: 'custom',
    searchQuery: '',

    // ── Data State ────────────────────────────────────────
    lists: [],
    tasks: [],
    listSections: {},
    loading: true,

    // ── UI Setters ────────────────────────────────────────
    setActiveTab: (tab) => set({ activeTab: tab }),
    setActiveFilter: (filter) => set({ activeFilter: filter }),
    setSearchOpen: (open) => set({ isSearchOpen: open }),
    setAddListOpen: (open) => set({ isAddListOpen: open }),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSortBy: (sortBy) => set({ sortBy }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),

    // ── List Management (client-side) ─────────────────────
    addList: (list) => set((state) => ({
        lists: [...state.lists, list],
        listSections: {
            ...state.listSections,
            [list.id]: ['Not Sectioned'],
        },
    })),

    deleteList: (id) => set((state) => ({
        lists: state.lists.filter((l) => l.id !== id),
        tasks: state.tasks.filter((t) => t.listId !== id),
    })),

    setListViewType: (listId, viewType) => set((state) => ({
        lists: state.lists.map((l) => l.id === listId ? { ...l, viewType } : l),
    })),

    addSection: (listId, sectionName) => set((state) => ({
        listSections: {
            ...state.listSections,
            [listId]: [...(state.listSections[listId] || ['Not Sectioned']), sectionName],
        },
    })),
}));