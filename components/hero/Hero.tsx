"use client";
import { useEffect, useRef } from "react";
import Navbar from "@/components/navigation/Navbar";
import HeroScene from "./HeroScene";
import MagneticButton from "@/components/ui/MagneticButton";
import { animateHeroIntro } from "@/animations/heroIntro";
import { createHeroScrollUI } from "@/animations/heroScroll";
import { COMPANY_DATA } from "@/data/company";

export default function Hero() {
  const scrollProxyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateHeroIntro();
    createHeroScrollUI(scrollProxyRef.current);
  }, []);

  return (
    <>
      {/* 3D Canvas di bawah UI */}
      <HeroScene scrollProxyRef={scrollProxyRef} />

      {/* UI Tetap (Fixed Overlay) */}
      <div className="fixed inset-0 z-10 p-6 md:p-10 pointer-events-none flex flex-col justify-between mix-blend-difference">
        <Navbar />

        {/* Teks Utama */}
        <div className="hero-ui-fade flex-1 flex flex-col justify-center w-full max-w-5xl mt-8">
          <h1 className="text-[clamp(3.5rem,7.5vw,9rem)] leading-[0.85] tracking-tight font-bold uppercase">
            <span className="block text-[#E8E5DE] fade-in-up">DIGITAL</span>
            <span className="block text-[#8D8A82] ml-[-0.02em] fade-in-up">DESIGN.</span>
            <span className="block text-[#E8E5DE] ml-[8vw] md:ml-[12vw] fade-in-up">PHYSICAL</span>
            <span className="block text-[#8D8A82] ml-[10vw] md:ml-[14vw] fade-in-up">PRECISION.</span>
          </h1>
          <div className="mt-8 flex flex-col font-mono text-[10px] text-[#8D8A82] uppercase tracking-[0.2em] gap-1 fade-in-up">
            <span>CNC MACHINING</span>
            <span>LASER CUTTING</span>
            <span className="font-bold text-[#FF6A00]">PLASMA</span>
            <span>3D PRINTING</span>
          </div>
        </div>

        {/* Metadata Bawah */}
        <div className="hero-ui-fade flex justify-between items-end font-mono text-[10px] uppercase tracking-[0.2em] fade-in-up">
          <div className="flex flex-col gap-1 text-[#8D8A82]">
            <span>SCROLL</span>
            <span>TO FABRICATE</span>
            <span className="mt-2 text-[#FF6A00] text-lg">↓</span>
          </div>
          <div className="hidden md:flex flex-col gap-1 text-center">
            <span className="text-[#E8E5DE]">MATERIAL: {COMPANY_DATA.material}</span>
            <span className="text-[#8D8A82]">TOLERANCE: {COMPANY_DATA.tolerance}</span>
          </div>
          <div className="pointer-events-auto">
            <MagneticButton>
              <a href="#" className="flex items-center gap-2 text-[#E8E5DE] border-b border-[#8D8A82] pb-1 hover:text-[#FF6A00] transition-colors">
                START A PROJECT →
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Area Spacer untuk memicu ScrollTrigger GSAP */}
      <div ref={scrollProxyRef} className="absolute top-0 left-0 w-full h-[350vh] z-20" />
    </>
  );
}