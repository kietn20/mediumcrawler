import { create } from "zustand";

export const useShareModalStore = create((set) => ({
  showShareModal: false,
  setShowShareModal: (showShareModal) => set({ showShareModal }),
}));