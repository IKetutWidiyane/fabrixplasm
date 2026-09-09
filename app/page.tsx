"use client";

import Hero from "@/components/hero/Hero";
import CNCSection from "@/components/sections/cnc/CNCSection";
import ProcessSection from "@/components/sections/process/ProcessSection";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/loader/Preloader";
import { useLenis } from "@/hooks/useLenis";
import { useAssetPreloader } from "@/hooks/useAssetPreloader";

export default function Home() {
  useLenis();
  const preloader = useAssetPreloader();

  return (
    <main className="relative min-h-screen">
      <Preloader state={preloader} />

      {/* Le Hero n'est monté qu'une fois les assets critiques prêts :
          son canvas 3D charge alors depuis le cache navigateur, sans double réseau. */}
      {preloader.done ? <Hero /> : null}

      <CustomCursor />
      <CNCSection />
      <ProcessSection />
    </main>
  );
}