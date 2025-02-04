import { create } from "zustand";


export const useEditModalStore = create((set) => ({
  showEditModal: false,
  setShowEditModal: (show) => set({ showEditModal: show }),
  trash: false,
  setTrash: (trash) => set({ trash }),
}));