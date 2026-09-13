"use client";

import { useRef } from "react";
import { worksData } from "@/data/worksData";
import { WorkItem } from "./WorkItem";

export default function WorksSection() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative z-10 w-full min-h-screen bg-[#070707] text-white py-32 px-6 md:px-12 lg:px-24 border-t border-zinc-800/80 overflow-hidden"
    >
      {/* SECTION HEADER */}
      <div className="mb-20 lg:mb-32 max-w-4xl">
        <div className="text-zinc-500 font-mono text-sm tracking-widest mb-6">
          05 — SELECTED WORKS
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.05]">
          PROOF OF PRECISION.
          <span className="block text-zinc-500">ENGINEERED RESULTS.</span>
        </h2>
        <p className="mt-8 text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
          A showcase of parts, sub-assemblies, and heavy-duty structural components fabricated to critical customer specifications.
        </p>
      </div>

      {/* ASYMMETRIC EDITORIAL WORK GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-24 lg:gap-y-36 items-start">
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
