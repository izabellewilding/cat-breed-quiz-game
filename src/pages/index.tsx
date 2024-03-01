import Image from "next/image";
import { Inter } from "next/font/google";
import { Card } from "@/components/card";
import { useQuery } from "@tanstack/react-query";

export interface Breed {
  id: string;
  name: string;
  description: string;
  temperament: string;
  origin: string;
  life_span: string;
  adaptability: number;
  affection_level: number;
  child_friendly: number;
  grooming: number;
  intelligence: number;
  health_issues: number;
  social_needs: number;
  stranger_friendly: number;
}

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["breeds"],
    queryFn: async () => {
      const res = await fetch("https://api.thecatapi.com/v1/breeds?limit=10");
      const allBreeds = await res.json();

      const allBreedsWithImages = await Promise.all(
        allBreeds.map(async (breed: Breed) => {
          const res = await fetch(
            `https://api.thecatapi.com/v1/images/search?breed_id=${breed.id}`
          );
          const images = await res.json();
          return { ...breed, image: images[0] };
        })
      );
      return allBreedsWithImages;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <main className="h-screen flex justify-center">
      <Card />
    </main>
  );
}
