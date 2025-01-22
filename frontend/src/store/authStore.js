// import { create } from "zustand";

// const loadFromLocalStorage = (key) => {
//   try {
//     const serializedState = localStorage.getItem(key);
//     return serializedState ? JSON.parse(serializedState) : null;
//   } catch (e) {
//     console.error("Could not load state from local storage", e);
//     return null;
//   }
// };

// const saveToLocalStorage = (key, value) => {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch (e) {
//     console.error("Could not save state to local storage", e);
//   }
// };

// export const useAuthStore = create((set) => ({
//   user: loadFromLocalStorage("user"),
//   token: loadFromLocalStorage("token"),
//   isSignedIn: !!loadFromLocalStorage("token"),
//   setUser: (user) => {
//     saveToLocalStorage("user", user);
//     set({ user });
//   },
//   setToken: (token) => {
//     saveToLocalStorage("token", token);
//     set({ token, isSignedIn: !!token });
//   },
//   signOut: () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     set({ user: null, token: null, isSignedIn: false });
//   },
// }));

import { create } from "zustand";

const loadFromLocalStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (e) {
    console.error("Could not load state from local storage", e);
    return null;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.error("Could not save state to local storage", e);
  }
};

export const useAuthStore = create((set) => ({
  user: loadFromLocalStorage("user"),
  token: loadFromLocalStorage("token"),
  isSignedIn: !!loadFromLocalStorage("token"),
  setUser: (user) => {
    saveToLocalStorage("user", user);
    set({ user });
  },
  setToken: (token) => {
    saveToLocalStorage("token", token);
    set({ token, isSignedIn: !!token });
  },
  signOut: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, isSignedIn: false });
  },
}));