import Image from "next/image";
import { Button } from "./button";
import { Breed } from "../../types/types";
import { useGameStore } from "@/store";

interface CardProps {
  options: Breed[];
  correctOption: Breed;
  onReshuffleGame: (arg: Breed) => void;
}

export const Card = ({
  options,
  correctOption,
  onReshuffleGame,
}: CardProps) => {
  const selectedItem = useGameStore((state) => state.selectedItem);
  const setSelectedItem = useGameStore((state) => state.setSelectedItem);
  const incrementScore = useGameStore((state) => state.incrementScore);
  const score = useGameStore((state) => state.score);

  const handleSelectBreed = (breed: Breed) => {
    setSelectedItem(breed);

    const isCorrect = breed.id === correctOption.id;

    if (isCorrect) {
      incrementScore();
    }
    setTimeout(resetGame, 2000);
  };

  const resetGame = () => {
    setSelectedItem(null);
    onReshuffleGame(correctOption);
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm max-w-96 m-auto">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
          Score: {score}
        </h3>
        <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
          Guess the Breed
        </h3>
        <p className="text-sm text-muted-foreground">
          Select the correct breed of the cat in the image.
        </p>
      </div>
      <div className="p-6 grid gap-4 items-center justify-center">
        <Image
          key={correctOption?.id}
          src={correctOption?.imageUrl}
          alt="Cat"
          width="300"
          height="200"
          className="aspect-square object-cover rounded-lg border "
        />
        <div className="grid gap-2">
          {options.map((breed) => (
            <Button
              key={breed.id}
              variant={
                selectedItem && breed.id === correctOption.id
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
