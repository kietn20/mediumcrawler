import { create } from 'zustand';

export const useAppStore = create((set) => ({
    loading: false,
    setLoading: (loading) => set({ loading }),
}));

