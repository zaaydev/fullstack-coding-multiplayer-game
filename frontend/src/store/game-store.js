import { create } from "zustand";

export const useGameStore = create((set) => ({
  room: null,
  setRoom: (data) => set({ room: data }),
  
  code: "// Start Writing Your Code Here",
  setCode: (data) => set({ code: data }),

  scores: [],
  setScores: (data) => set({scores: data}),

  aiQuestion: null,
  setAiQuestion: (data) => set({ aiQuestion: data }),
}));
