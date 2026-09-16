"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import CNCVisual from "./CNCVisual";
import CNCSpecs from "./CNCSpecs";
import CNCMaterials from "./CNCMaterials";
import { setupSectionHeaderReveal } from "@/animations/sectionHeaderReveal";

export default function CNCSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      // Reveal header konsisten dengan Capabilities / Works / Contact
      setupSectionHeaderReveal(containerRef.current, containerRef.current);
    }
  }, { scope: containerRef });

  return (
    <section 
      id="cnc"
      ref={containerRef} 
      className="relative w-full min-h-screen bg-[#0a0a0a] text-white py-32 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* HEADER TYPOGRAPHY */}
      <div className="mb-20" ref={titleRef}>
        <div className="reveal-divider w-full h-px bg-zinc-800 mb-8" />
        <div className="reveal-fade-up text-zinc-500 font-mono text-sm tracking-widest mb-8">
          02 — CNC MACHINING
        </div>
        
        <h2 className="text-[clamp(2.6rem,11vw,7rem)] font-bold tracking-tighter leading-[1.1]">
          <div className="reveal-headline">PRECISION</div>
          <div className="reveal-headline">BUILT INTO</div>
          <div className="reveal-headline">EVERY CUT.</div>
        </h2>
        
        <p className="mt-8 max-w-md text-zinc-400 text-lg reveal-fade-up">
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