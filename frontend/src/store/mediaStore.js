import { create } from "zustand";
import toast from "react-hot-toast";

// Helper functions to interact with local storage
const loadFromLocalStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    console.error("Could not load state from local storage", e);
    return undefined;
  }
};

const saveToLocalStorage = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (e) {
    console.error("Could not save state to local storage", e);
  }
};

const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Could not clear state from local storage", e);
  }
};

const defaultMediaObject = { title: "", rating: "", description: "", imageUrl: "" };
const defaultMediaList = { name: "medium crawler", items: Array(10).fill(defaultMediaObject) };

const initialState = {
  mediaItems: loadFromLocalStorage("mediaItems") || [],
  mediaLists: loadFromLocalStorage("mediaLists") || [defaultMediaList],
  currentMediaList: loadFromLocalStorage("currentMediaList") || defaultMediaList,
  slotIndexClicked: null,
  showManageListsModal: false,
};

export const useMediaStore = create((set) => ({
  ...initialState,
  setMediaItem: (index, mediaItem) =>
    set((state) => {
      const mediaItems = [...state.currentMediaList.items];
      mediaItems[index] = mediaItem;
      const updatedMediaList = { ...state.currentMediaList, items: mediaItems };
      const mediaLists = state.mediaLists.map((list) =>
        list.name === state.currentMediaList.name ? updatedMediaList : list
      );
      saveToLocalStorage("currentMediaList", updatedMediaList);
      saveToLocalStorage("mediaLists", mediaLists);
      return { currentMediaList: updatedMediaList, mediaLists };
    }),
  swapMediaItems: (index1, index2) =>
    set((state) => {
      const newMediaItems = [...state.currentMediaList.items];
      [newMediaItems[index1], newMediaItems[index2]] = [
        newMediaItems[index2],
        newMediaItems[index1],
      ];
      const updatedMediaList = { ...state.currentMediaList, items: newMediaItems };
      const mediaLists = state.mediaLists.map((list) =>
        list.name === state.currentMediaList.name ? updatedMediaList : list
      );
      saveToLocalStorage("currentMediaList", updatedMediaList);
      saveToLocalStorage("mediaLists", mediaLists);
      return { currentMediaList: updatedMediaList, mediaLists };
    }),
  setSlotIndexClicked: (index) => set({ slotIndexClicked: index }),
  setShowManageListsModal: (show) => set({ showManageListsModal: show }),
  addMediaList: (list) =>
    set((state) => {
      if (state.mediaLists.length < 5) {
        const newList = { ...list, name: `new media list ${state.mediaLists.length}`, items: Array(10).fill(defaultMediaObject) };
        const mediaLists = [...state.mediaLists, newList];
        saveToLocalStorage("mediaLists", mediaLists);
        return { mediaLists };
      } else {
        console.warn("Media list limit reached");
        return state;
      }
    }),
  addMediaItem: () =>
    set((state) => {
      if (state.currentMediaList.items.length >= 25) {
        toast.error("Media list is full");
        return state;
      }
      const newMediaItem = { title: "", rating: "", description: "", imageUrl: "" };
      const updatedMediaList = {
        ...state.currentMediaList,
        items: [...state.currentMediaList.items, newMediaItem],
      };
      const mediaLists = state.mediaLists.map((list) =>
        list.name === state.currentMediaList.name ? updatedMediaList : list
      );
      saveToLocalStorage("currentMediaList", updatedMediaList);
      saveToLocalStorage("mediaLists", mediaLists);
      return { currentMediaList: updatedMediaList, mediaLists };
    }),
  deleteMediaItem: (index) =>
    set((state) => {
      if (index < 10) {
        toast.error("Cannot delete the first 10 media items");
        return state;
      }
      const updatedMediaItems = state.currentMediaList.items.filter((_, i) => i !== index);
      const updatedMediaList = { ...state.currentMediaList, items: updatedMediaItems };
      const mediaLists = state.mediaLists.map((list) =>
        list.name === state.currentMediaList.name ? updatedMediaList : list
      );
      saveToLocalStorage("currentMediaList", updatedMediaList);
      saveToLocalStorage("mediaLists", mediaLists);
      return { currentMediaList: updatedMediaList, mediaLists };
    }),
  removeMediaList: (index) =>
    set((state) => {
      const mediaLists = state.mediaLists.filter((_, i) => i !== index);
      saveToLocalStorage("mediaLists", mediaLists);
      return { mediaLists };
    }),
  setMediaLists: (lists) => {
    saveToLocalStorage("mediaLists", lists);
    set({ mediaLists: lists });
  },
  setCurrentMediaList: (list) =>
    set((state) => {
      saveToLocalStorage("currentMediaList", list);
      return { currentMediaList: list };
    }),
  updateMediaListName: (index, name) =>
    set((state) => {
      const mediaLists = state.mediaLists.map((list, i) => i === index ? { ...list, name } : list);
      saveToLocalStorage("mediaLists", mediaLists);
      return { mediaLists };
    }),
  clearLocalStorage: () => {
    clearLocalStorage("mediaItems");
    clearLocalStorage("mediaLists");
    clearLocalStorage("currentMediaList");
    set({
      mediaItems: [],
      mediaLists: [defaultMediaList],
      currentMediaList: defaultMediaList,
    });
  },

}));