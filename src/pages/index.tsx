import Image from "next/image";
import { useState } from "react";
import { Inter } from "next/font/google";
import { Card } from "@/components/card";
import { useQuery } from "@tanstack/react-query";
import { Breed } from "../../types/types";

const inter = Inter({ subsets: ["latin"] });

function getRandomItems(data: Breed[], count: number) {
  // Shuffle the array
  const shuffledData = [...data].sort(() => Math.random() - 0.5);
  // Return the first 'count' items
  return shuffledData.slice(0, count);
}

export default function Home() {
  const [shuffledItems, setShuffledItems] = useState<Breed[]>([]);
  // list of used answers
  // score of the game
  /// current questions

  const { data, isLoading, isError } = useQuery<Breed[]>({
    queryKey: ["breeds"],
    queryFn: async () => {
      const res = await fetch("https://api.thecatapi.com/v1/breeds?limit=20");
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  const onReshuffleGame = () => {
    setShuffledItems(getRandomItems(data || [], 4));
  };

  const randomItems = getRandomItems(data || [], 4);
  return (
    <main className="h-screen flex justify-center">
      <Card
        options={randomItems}
        correctOption={randomItems[0]}
        onReshuffleGame={onReshuffleGame}
      />
    </main>
  );
}
