import { create } from "zustand";
import { Breed } from "../types/types";

// const [shuffledItems, setShuffledItems] = useState<Breed[]>([]);

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

export const useGameStore = create<GameState>((set) => ({
  shuffledItems: [],
  setShuffledItems: (items) => set({ shuffledItems: items }),
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
