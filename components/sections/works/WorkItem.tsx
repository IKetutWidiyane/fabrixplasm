"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { WorkProject } from "@/data/worksData";
import { setupWorkItemParallax } from "@/animations/worksParallax";

interface WorkItemProps {
  project: WorkProject;
}

export function WorkItem({ project }: WorkItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (containerRef.current && imageRef.current && clipRef.current) {
        setupWorkItemParallax(
          containerRef.current,
          imageRef.current,
          clipRef.current,
          infoRef.current
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`col-span-12 ${project.layout.columnSpan} ${
        project.layout.offsetY ?? ""
      } relative group select-none`}
    >
      {/* PROJECT TOP TECHNICAL HEADER */}
      <div className="flex justify-between items-baseline font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase mb-4 border-b border-zinc-800 pb-2">
        <span className="text-[#FF6A00] font-bold">
          {`${project.number} // ${project.category}`}
        </span>
        <span>YEAR {project.year}</span>
      </div>

      {/* CLIPPED PARALLAX IMAGE CONTAINER */}
      <div
        ref={clipRef}
        className={`relative w-full ${project.layout.aspectRatio} overflow-hidden bg-zinc-950 border border-zinc-800/90 rounded-sm cursor-pointer`}
      >
        <img
          ref={imageRef}
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="absolute -top-[14%] left-0 w-full h-[128%] object-cover grayscale brightness-90 group-hover:brightness-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
        />

        {/* Industrial CAD overlay grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Precision corner badge */}
        <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-400 bg-black/70 backdrop-blur-md px-2.5 py-1 border border-zinc-800 rounded z-10">
          SECTOR: {project.clientSector}
        </div>

        {/* Floating View Project Indicator on Hover */}
        <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-black bg-[#E8E5DE] px-3 py-1 font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          VIEW SPEC →
        </div>
      </div>

      {/* PROJECT DETAILS & SPECIFICATIONS */}
      <div
        ref={infoRef}
        className="mt-6 flex flex-col md:flex-row justify-between items-start gap-6"
      >
        <div className="max-w-md">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#FF6A00] transition-colors">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technical specs block */}
        <div className="font-mono text-[11px] text-zinc-400 border-l border-zinc-800 pl-4 flex flex-col gap-1.5 shrink-0">
          <div>
            <span className="text-zinc-600 block text-[9px]">MATERIAL</span>
            <span className="text-zinc-200">{project.material}</span>
          </div>
          <div>
            <span className="text-zinc-600 block text-[9px]">PROCESS</span>
            <span className="text-zinc-200">{project.method}</span>
          </div>
          <div>
            <span className="text-zinc-600 block text-[9px]">TOLERANCE</span>
            <span className="text-[#FF6A00]">{project.tolerance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
