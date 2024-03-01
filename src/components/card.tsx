import Image from "next/image";
import { useEffect } from "react";
import { Button } from "./button";
import { Breed } from "../../types/types";
import { useState } from "react";

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
  const [selected, setSelected] = useState<Breed | null>(null);
  const [correct, setCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleSelectBreed = (breed: Breed) => {
    setSelected(breed);

    const isCorrect = breed.id === correctOption.id;

    setCorrect(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setTimeout(resetGame, 2000);
  };

  const resetGame = () => {
    setSelected(null);
    onReshuffleGame(correctOption);
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm max-w-96 m-auto">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
          Guess the Breed
        </h3>
        <p className="text-sm text-muted-foreground">
          Select the correct breed of the cat in the image.
        </p>
      </div>
      <div className="p-6 grid gap-4 items-center justify-center">
        <Image
          key={correctOption.id}
          src={correctOption.imageUrl}
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
                selected && breed.id === correctOption.id
                  ? "correct"
                  : selected && breed.id === selected.id
                  ? "incorrect"
                  : "default"
              }
              onClick={() => handleSelectBreed(breed)}
              disabled={selected !== null}
            >
              {breed.name}
            </Button>
          ))}
        </div>
        {/* <div className="flex justify-end">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-white text-black">
              Next
            </button>
          </div> */}
      </div>
    </div>
  );
};
