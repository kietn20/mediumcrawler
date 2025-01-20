import { create } from 'zustand';

export const useSearchModalStore = create((set) => ({
  showSearchModal: false,
  setShowSearchModal: (show) => set({ showSearchModal: show }),
}));