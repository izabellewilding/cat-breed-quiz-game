import { create } from "zustand";
import { Breed } from "../types/types";

// const [shuffledItems, setShuffledItems] = useState<Breed[]>([]);

interface GameState {
  shuffledItems: Breed[];
  setShuffledItems: (items: Breed[]) => void;
  usedOptions: Breed[];
  setUsedOptions: (prevOption: Breed) => void;
}

export const useGameStore = create<GameState>((set) => ({
  shuffledItems: [],
  setShuffledItems: (items: Breed[]) => set({ shuffledItems: items }),
  usedOptions: [],
  setUsedOptions: (prevOption: Breed) => {
    set((state) => ({
      usedOptions: [...state.usedOptions, prevOption],
    }));
  },
}));
