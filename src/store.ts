import { create } from "zustand";
import { Breed } from "../types/types";

interface GameState {
  shuffledItems: Breed[];
  setShuffledItems: (items: Breed[]) => void;
  usedOptions: Breed[];
  setUsedOptions: (prevOption: Breed) => void;
  selectedItem: Breed | null;
  setSelectedItem: (breed: Breed | null) => void;
  score: number;
  incrementScore: () => void;
}

const getShuffledItems = (allBreeds: Breed[], count: number) => {
  const shuffledData = allBreeds.sort(() => Math.random() - 0.5);
  return shuffledData.slice(0, count);
};

export const useGameStore = create<GameState>((set) => ({
  shuffledItems: [],
  setShuffledItems: (allBreeds: Breed[]) => {
    set((state) => {
      const availableOptions = allBreeds.filter(
        (option) => !state.usedOptions.some((used) => used.id === option.id)
      );

      if (availableOptions.length < 4) {
        return {
          ...state,
          usedOptions: [],
          shuffledItems: getShuffledItems(allBreeds, 4),
        };
      }

      return { ...state, shuffledItems: getShuffledItems(availableOptions, 4) };
    });
  },
  usedOptions: [],
  setUsedOptions: (prevOption) => {
    set((state) => ({
      usedOptions: [...state.usedOptions, prevOption],
    }));
  },
  selectedItem: null,
  setSelectedItem: (breed) => set({ selectedItem: breed }),
  score: 0,
  incrementScore: () => set((state) => ({ ...state, score: state.score + 1 })),
}));
