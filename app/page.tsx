"use client";
import Hero from "@/components/hero/Hero";
import CustomCursor from "@/components/ui/CustomCursor";
import { useLenis } from "@/hooks/useLenis";

export default function Home() {
  useLenis(); // Memanggil smooth scroll globally

  return (
    <main className="relative min-h-screen">
      <CustomCursor />
      <Hero />
    </main>
  );
}