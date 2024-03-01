import Image from "next/image";
import { Inter } from "next/font/google";
import { Card } from "@/components/card";
import { useQuery } from "@tanstack/react-query";

export interface Breed {
  id: string;
  name: string;
  imageUrl: string;
}

const inter = Inter({ subsets: ["latin"] });

function getRandomItems(data: Breed[], count: number) {
  // Shuffle the array
  const shuffledData = [...data].sort(() => Math.random() - 0.5);
  // Return the first 'count' items
  return shuffledData.slice(0, count);
}

export default function Home() {
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

  const randomItems = getRandomItems(data || [], 4);
  console.log(randomItems, "RANDOM");
  return (
    <main className="h-screen flex justify-center">
      {JSON.stringify(data, null, 2)}
      {/* <Card items={randomItems} /> */}
    </main>
  );
}
