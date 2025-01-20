import { create } from 'zustand'; 

export const useHelpModalStore = create((set) => ({
  showHelp: false,
  setShowHelp: (show) => set({ showHelp: show }),
  page: 1,
  setPage: (page) => set({ page }),
  helpButtonRef: null,
  setHelpButtonRef: (ref) => set({ helpButtonRef: ref }),
}));