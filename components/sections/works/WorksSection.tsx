"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { worksData } from "@/data/worksData";
import { WorkItem } from "./WorkItem";
import { setupSectionHeaderReveal } from "@/animations/sectionHeaderReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WorksSection() {
  const containerRef = useRef<HTMLElement>(null);

  // Reveal header section saat scroll (gaya CNCSection / Awwwards)
  useGSAP(() => {
    if (containerRef.current) {
      setupSectionHeaderReveal(containerRef.current, containerRef.current);
    }
  }, { scope: containerRef });

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative z-10 w-full min-h-screen bg-[#070707] text-white py-32 px-6 md:px-12 lg:px-24 border-t border-zinc-800/80 overflow-hidden"
    >
      {/* SECTION HEADER */}
      <div className="mb-20 lg:mb-32 max-w-4xl">
        <div className="reveal-divider w-full h-px bg-zinc-800 mb-10 md:mb-14" />
        <div className="reveal-fade-up text-zinc-500 font-mono text-sm tracking-widest mb-6">
          05 — SELECTED WORKS
        </div>
        <h2 className="text-[clamp(2.4rem,10vw,7rem)] font-bold tracking-tighter leading-[1.05]">
          <span className="reveal-headline block">PROOF OF PRECISION.</span>
          <span className="reveal-headline block text-zinc-500">ENGINEERED RESULTS.</span>
        </h2>
        <p className="reveal-fade-up mt-8 text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
          A showcase of parts, sub-assemblies, and heavy-duty structural components fabricated to critical customer specifications.
        </p>
      </div>

      {/* STAGGERED EDITORIAL WORK GRID — uniform 4:3 photos, responsive 1/2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 lg:gap-x-12 gap-y-20 lg:gap-y-32 items-start">
        {worksData.map((project) => (
          <WorkItem key={project.id} project={project} />
        ))}
      </div>

      {/* TRANSITION PROMPT */}
      <div className="mt-36 pt-16 border-t border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
          READY TO FABRICATE CUSTOM SPECIFICATIONS?
        </div>
        <a
          href="#contact"
          className="font-mono text-sm text-[#E8E5DE] hover:text-[#FF6A00] transition-colors flex items-center gap-3 group"
        >
          INITIATE SPEC REVIEW
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </section>
  );
}
