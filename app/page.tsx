"use client";
import Hero from "@/components/hero/Hero";
import  CNCSection  from "@/components/sections/cnc/CNCSection";
import CustomCursor from "@/components/ui/CustomCursor";
import { useLenis } from "@/hooks/useLenis";

export default function Home() {
  useLenis(); // Memanggil smooth scroll globally

  return (
    <main className="relative min-h-screen">
      <CustomCursor />
      <Hero />
      <CNCSection />
    </main>
  );
}