import Image from "next/image";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import { Game } from "@/components/game";
import { useQuery } from "@tanstack/react-query";
import { Breed } from "../types";
import { useGameStore } from "@/store";

export default function Home() {
  const setShuffledItems = useGameStore((state) => state.setShuffledItems);
  const setUsedOptions = useGameStore((state) => state.setUsedOptions);

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

      setShuffledItems(allBreedsWithImages);

      return allBreedsWithImages;
    },
  });

  const onReshuffleGame = (prevOption: Breed) => {
    setUsedOptions(prevOption);
    setShuffledItems(data || []);
  };

  return (
    <main className="h-screen flex justify-center">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching data</div>}
      {data && <Game onReshuffleGame={onReshuffleGame} />}
    </main>
  );
}
