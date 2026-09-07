"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CNCVisual from "./CNCVisual";
import CNCSpecs from "./CNCSpecs";
import CNCMaterials from "./CNCMaterials";

// Register plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CNCSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Timeline utama untuk storytelling scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        // UBAH BARIS INI: Animasi dimulai saat ujung atas section menyentuh 90% tinggi layar (hampir paling bawah)
        start: "top 90%", 
        end: "bottom 80%",
        toggleActions: "play none none reverse",
      },
    });

    // 1. Reveal teks pembuka
    const texts = gsap.utils.toArray(".reveal-text");
    tl.fromTo(
      texts,
      { y: 50, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
      {
        y: 0,
        opacity: 1,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
      }
    );

    // 2. Teks kecil fade in
    tl.fromTo(
      ".reveal-subtext",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen bg-[#0a0a0a] text-white py-32 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* HEADER TYPOGRAPHY */}
      <div className="mb-20" ref={titleRef}>
        <div className="text-zinc-500 font-mono text-sm tracking-widest mb-8 reveal-subtext">
          02 — CNC MACHINING
        </div>
        
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
          <div className="reveal-text">PRECISION</div>
          <div className="reveal-text">BUILT INTO</div>
          <div className="reveal-text">EVERY CUT.</div>
        </h2>
        
        <p className="mt-8 max-w-md text-zinc-400 text-lg reveal-subtext">
          Computer-controlled machining for precise, repeatable, and production-ready components.
        </p>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CNC VISUAL (Kiri - Memakan 8 kolom) */}
        <div className="lg:col-span-8 relative z-10">
          <CNCVisual />
        </div>

        {/* OVERLAPPING SPECS (Kanan - Memakan 4 kolom, overlap secara visual via negative margin/transform di CSS) */}
        <div className="lg:col-span-4 lg:-ml-16 relative z-20 mt-12 lg:mt-32">
          <CNCSpecs />
        </div>
      </div>

      {/* MATERIALS SECTION */}
      <div className="mt-32 border-t border-zinc-800 pt-16">
        <CNCMaterials />
      </div>

      {/* TRANSITION TO SECTION 03 */}
      <div className="mt-40 flex flex-col md:flex-row justify-between items-end border-b border-zinc-800 pb-12 transition-to-03">
        <h3 className="text-4xl md:text-5xl font-bold tracking-tighter max-w-sm mb-6 md:mb-0">
          PRECISION IS ONLY THE BEGINNING.
        </h3>
        <div className="text-zinc-500 font-mono flex items-center gap-4 hover:text-white transition-colors cursor-pointer">
          03 — FABRICATION PROCESS
          <span className="text-xl">→</span>
        </div>
      </div>
    </section>
  );
}