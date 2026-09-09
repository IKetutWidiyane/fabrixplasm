"use client";

import Hero from "@/components/hero/Hero";
import CNCSection from "@/components/sections/cnc/CNCSection";
import ProcessSection from "@/components/sections/process/ProcessSection";
import CustomCursor from "@/components/ui/CustomCursor";
import { useLenis } from "@/hooks/useLenis";

export default function Home() {
  useLenis();

  return (
    <main className="relative min-h-screen">
      <CustomCursor />

      <Hero />
      <CNCSection />
      <ProcessSection />
    </main>
  );
}