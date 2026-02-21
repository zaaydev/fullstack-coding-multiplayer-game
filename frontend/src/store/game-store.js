import { create } from "zustand";

export const useGameStore = create((set) => ({
  room: null,
  setRoom: (data) => set({ room: data }),

  aiQuestion: null,
  setAiQuestion: (data) => set({ aiQuestion: data }),
}));
