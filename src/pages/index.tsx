import Image from "next/image";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import { Game } from "@/components/game";
import { useQuery } from "@tanstack/react-query";
import { Breed } from "../types";
import { useGameStore } from "@/store";

export default function Home() {
  const setShuffledItems = useGameStore((state) => state.setShuffledItems);
  const shuffledItems = useGameStore((state) => state.shuffledItems);
  const setUsedOptions = useGameStore((state) => state.setUsedOptions);

  //Fetch all breeds and their images
  const { data, isLoading, isError } = useQuery<Breed[]>({
    queryKey: ["breeds"],
    queryFn: async () => {
      const res = await fetch("https://api.thecatapi.com/v1/breeds?limit=30");
      const allBreeds = await res.json();

      //Fetch image for each breed
      const allBreedsWithImages = await Promise.all(
        allBreeds.map(async (breed: Breed) => {
          const res = await fetch(
            `https://api.thecatapi.com/v1/images/search?breed_id=${breed.id}`
          );
          const images = await res.json();
          //Return breed with image
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
  }, [data, setShuffledItems, shuffledItems]);

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
