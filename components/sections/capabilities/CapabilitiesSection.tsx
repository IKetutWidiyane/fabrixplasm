"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { capabilitiesData, CapabilityItemData } from "@/data/capabilitiesData";
import { CapabilityItem } from "./CapabilityItem";
import { CapabilityPreview, CapabilityPreviewHandle } from "./CapabilityPreview";
import { setupSectionHeaderReveal } from "@/animations/sectionHeaderReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CapabilitiesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const previewRef = useRef<CapabilityPreviewHandle>(null);
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);
  const isFinePointer = useRef(false);

  useEffect(() => {
    isFinePointer.current = window.matchMedia("(pointer: fine)").matches;
  }, []);

  // Reveal header section saat scroll (gaya CNCSection / Awwwards)
  useGSAP(() => {
    if (containerRef.current) {
      setupSectionHeaderReveal(containerRef.current, containerRef.current);
    }
  }, { scope: containerRef });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isFinePointer.current || !previewRef.current) return;
    previewRef.current.updatePosition(e.clientX, e.clientY);
  };

  const handleHoverDesktop = (item: CapabilityItemData | null) => {
    if (!isFinePointer.current || !previewRef.current) return;
    previewRef.current.setActiveItem(item);
  };

  return (
    <section
      id="capabilities"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative z-10 w-full min-h-screen bg-[#090909] text-white py-32 px-6 md:px-12 lg:px-24 border-t border-zinc-800/80 overflow-hidden"
    >
      {/* Floating Image Preview Tracker (Desktop Only, 0 React re-renders) */}
      <CapabilityPreview ref={previewRef} items={capabilitiesData} />

      {/* SECTION HEADER */}
      <div className="mb-16 md:mb-24 max-w-4xl">
        <div className="reveal-divider w-full h-px bg-zinc-800 mb-10 md:mb-14" />
        <div className="reveal-fade-up text-zinc-500 font-mono text-sm tracking-widest mb-6">
          04 — CAPABILITIES
        </div>
        <h2 className="text-[clamp(2.4rem,10vw,7rem)] font-bold tracking-tighter leading-[1.05]">
          <span className="reveal-headline block">WHAT WE BUILD.</span>
          <span className="reveal-headline block text-zinc-500">DIGITAL TO PHYSICAL.</span>
        </h2>
        <p className="reveal-fade-up mt-8 text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
          From high-tolerance 5-axis aerospace geometries to multi-ton structural steel plasma severance. Engineered for repeatability, speed, and precision.
        </p>
      </div>

      {/* CAPABILITIES LIST */}
      <div className="w-full border-t border-zinc-800/80">
        {capabilitiesData.map((item, idx) => (
          <CapabilityItem
            key={item.id}
            item={item}
            isOpenMobile={openMobileIndex === idx}
            onToggleMobile={() =>
              setOpenMobileIndex((prev) => (prev === idx ? null : idx))
            }
            onHoverDesktop={handleHoverDesktop}
          />
        ))}
      </div>

      {/* SECTION FOOTNOTE */}
      <div className="mt-20 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-zinc-500 font-mono text-[10px] tracking-widest uppercase gap-4">
        <span>TOLERANCES DOWN TO 10 MICRONS (±0.01MM)</span>
        <span>STANDARD COMPLIANCE: ISO 9001 / AS9100 READY</span>
      </div>
    </section>
  );
}

