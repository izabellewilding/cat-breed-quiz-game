import { useMemo } from "react";
import Image from "next/image";
import JSConfetti from "js-confetti";
import { Button } from "./button";
import { Breed } from "@/types";
import { useGameStore } from "@/store";

interface GameProps {
  onReshuffleGame: (arg: Breed) => void;
}

export const Game = ({ onReshuffleGame }: GameProps) => {
  //Confetti to show on correct answer
  const jsConfetti = useMemo(() => {
    if (typeof window === "undefined") return {} as JSConfetti;

    return new JSConfetti();
  }, []);

  const shuffledItems = useGameStore((state) => state.shuffledItems);

  const correctOptionIndex = useGameStore((state) => state.correctOptionIndex);

  const selectedItem = useGameStore((state) => state.selectedItem);
  const setSelectedItem = useGameStore((state) => state.setSelectedItem);
  const incrementScore = useGameStore((state) => state.incrementScore);
  const score = useGameStore((state) => state.score);

  const handleSelectBreed = (breed: Breed) => {
    //Set the selected breed
    setSelectedItem(breed);

    //Check if the selected breed is correct
    const isCorrect = breed.id === shuffledItems[correctOptionIndex].id;

    //If correct, show confetti and increment score
    if (isCorrect) {
      jsConfetti.addConfetti({
        emojis: ["🌈", "🐈", "😻", "💫", "🏆", "🙌", "⭐"],
      });
      incrementScore();
    }
    //Reset the game after 2 seconds
    setTimeout(resetGame, 2000);
  };

  const resetGame = () => {
    setSelectedItem(null);
    onReshuffleGame(shuffledItems[correctOptionIndex]);
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm max-w-96 m-auto">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
            Guess the Breed
          </h1>
          <p className="text-xl font-semibold whitespace-nowrap leading-none tracking-tight">
            Score: {score}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Select the correct breed of the cat in the image.
        </p>
      </div>
      <div className="p-6 grid gap-4 items-center justify-center">
        <Image
          key={shuffledItems[correctOptionIndex].id}
          src={shuffledItems[correctOptionIndex].imageUrl}
          alt="Cat"
          width="300"
          height="200"
          className="aspect-square object-cover rounded-lg border "
        />
        <div className="grid gap-2">
          {shuffledItems.map((breed) => (
            <Button
              key={breed.id}
              variant={
                selectedItem &&
                breed.id === shuffledItems[correctOptionIndex].id
                  ? "correct"
                  : selectedItem && breed.id === selectedItem.id
                  ? "incorrect"
                  : "default"
              }
              onClick={() => handleSelectBreed(breed)}
              disabled={selectedItem !== null}
            >
              {breed.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
