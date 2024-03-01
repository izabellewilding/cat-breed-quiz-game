import { create } from "zustand";
import { Breed } from "../types/types";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import { share, isSupported } from "shared-zustand";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

interface GameState {
  shuffledItems: Breed[];
  setShuffledItems: (items: Breed[]) => void;
  usedOptions: Breed[];
  setUsedOptions: (prevOption: Breed) => void;
  selectedItem: Breed | null;
  setSelectedItem: (breed: Breed | null) => void;
  score: number;
  incrementScore: () => void;
  correctOptionIndex: number;
}

const getShuffledItems = (allBreeds: Breed[], count: number) => {
  const shuffledData = allBreeds.sort(() => Math.random() - 0.5);
  return shuffledData.slice(0, count);
};

export const useGameStore = create(
  subscribeWithSelector(
    persist<GameState>(
      (set) => ({
        shuffledItems: [],
        setShuffledItems: (allBreeds: Breed[]) => {
          set((state) => {
            const availableOptions = allBreeds.filter(
              (option) =>
                !state.usedOptions.some((used) => used.id === option.id)
            );

            if (availableOptions.length < 4) {
              return {
                ...state,
                usedOptions: [],
                shuffledItems: getShuffledItems(allBreeds, 4),
                correctOptionIndex: getRandomInt(4),
              };
            }

            return {
              ...state,
              shuffledItems: getShuffledItems(availableOptions, 4),
              correctOptionIndex: getRandomInt(4),
            };
          });
        },
        correctOptionIndex: 0,
        usedOptions: [],
        setUsedOptions: (prevOption) => {
          set((state) => ({
            usedOptions: [...state.usedOptions, prevOption],
          }));
        },
        selectedItem: null,
        setSelectedItem: (breed) => set({ selectedItem: breed }),
        score: 0,
        incrementScore: () =>
          set((state) => ({ ...state, score: state.score + 1 })),
      }),
      {
        name: "game-storage",
      }
    )
  )
);

// progressive enhancement check.
if ("BroadcastChannel" in globalThis /* || isSupported() */) {
  share("score", useGameStore, {
    // if set to true this tab trys to immediately recover the shared state from another tab.
    initialize: true,
  });

  share("correctOptionIndex", useGameStore, {
    // if set to true this tab trys to immediately recover the shared state from another tab.
    initialize: true,
  });

  share("selectedItem", useGameStore, {
    // if set to true this tab trys to immediately recover the shared state from another tab.
    initialize: true,
  });

  share("shuffledItems", useGameStore, {
    // if set to true this tab trys to immediately recover the shared state from another tab.
    initialize: true,
  });

  share("usedOptions", useGameStore, {
    // if set to true this tab trys to immediately recover the shared state from another tab.
    initialize: true,
  });
}
