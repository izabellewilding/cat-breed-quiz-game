import Image from "next/image";
import { Inter } from "next/font/google";
import { Card } from "@/components/Card";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="h-screen flex justify-center">
      <Card />
    </main>
  );
}
