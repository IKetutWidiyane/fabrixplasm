"use client";

import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navigation/Navbar";
import CNCSection from "@/components/sections/cnc/CNCSection";
import ProcessSection from "@/components/sections/process/ProcessSection";
import CapabilitiesSection from "@/components/sections/capabilities/CapabilitiesSection";
import WorksSection from "@/components/sections/works/WorksSection";
import ContactSection from "@/components/sections/contact/ContactSection";
import Footer from "@/components/sections/contact/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/loader/Preloader";
import { useLenis } from "@/hooks/useLenis";
import { useAssetPreloader } from "@/hooks/useAssetPreloader";

export default function Home() {
  useLenis();
  const preloader = useAssetPreloader();

  return (
    <main className="relative min-h-screen bg-[#070707]">
      <Preloader state={preloader} />

      {/* Industrial Navigation */}
      <Navbar />

      {/* 01 — HERO (Mounted once critical assets are cached) */}
      {preloader.done ? <Hero /> : null}

      {/* Desktop Hardware Accelerated Custom Cursor */}
      <CustomCursor />

      {/* 02 — CNC MACHINING */}
      <CNCSection />

      {/* 03 — PROCESS */}
      <ProcessSection />

      {/* 04 — CAPABILITIES */}
      <CapabilitiesSection />

      {/* 05 — SELECTED WORKS */}
      <WorksSection />

      {/* 06 — CONTACT */}
      <ContactSection />

      {/* INDUSTRIAL FOOTER */}
      <Footer />
    </main>
  );
}