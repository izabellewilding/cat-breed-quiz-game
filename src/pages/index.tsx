import Image from "next/image";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import { Card } from "@/components/card";
import { useQuery } from "@tanstack/react-query";
import { Breed } from "../../types/types";
import { useGameStore } from "@/store";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const shuffledItems = useGameStore((state) => state.shuffledItems);
  const setShuffledItems = useGameStore((state) => state.setShuffledItems);
  const usedOptions = useGameStore((state) => state.usedOptions);
  const setUsedOptions = useGameStore((state) => state.setUsedOptions);
  const correctOptionIndex = useGameStore((state) => state.correctOptionIndex);

  const { data, isLoading, isError } = useQuery<Breed[]>({
    queryKey: ["breeds"],
    queryFn: async () => {
      const res = await fetch("https://api.thecatapi.com/v1/breeds?limit=30");
      const allBreeds = await res.json();

      const allBreedsWithImages = await Promise.all(
        allBreeds.map(async (breed: Breed) => {
          const res = await fetch(
            `https://api.thecatapi.com/v1/images/search?breed_id=${breed.id}`
          );
          const images = await res.json();
          return { id: breed.id, name: breed.name, imageUrl: images[0].url };
        })
      );

      return allBreedsWithImages;
    },
  });

  useEffect(() => {
    if (data && !shuffledItems.length) {
      setShuffledItems(data);
    }
  }, [data, setShuffledItems, shuffledItems, usedOptions]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  const onReshuffleGame = (prevOption: Breed) => {
    setUsedOptions(prevOption);
    setShuffledItems(data || []);
  };

  return (
    <main className="h-screen flex justify-center">
      <Card
        options={shuffledItems}
        correctOption={shuffledItems[correctOptionIndex]}
        onReshuffleGame={onReshuffleGame}
      />
    </main>
  );
}
