"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { revealImageCut } from "@/animations/cncReveal";
import { setupMouseParallax, resetParallax } from "@/animations/cncHover";
import CNCAnnotations from "./CNCAnnotations";

export default function CNCVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const updateParallax = useRef<Function | null>(null);

  // State micro-interaction: Realtime CNC Coordinates & Hover State
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    if (containerRef.current && imageRef.current) {
      revealImageCut(containerRef.current, containerRef.current);
      updateParallax.current = setupMouseParallax(imageRef.current, 0.04);
    }
  }, { scope: containerRef });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // 1. Mouse Parallax
    if (updateParallax.current) {
      updateParallax.current(e.clientX, e.clientY, rect);
    }

    // 2. Realtime CNC Coordinate calculation (simulasi mm dari pusat gambar)
    const posX = Math.round((e.clientX - rect.left - rect.width / 2) * 1.8);
    const posY = Math.round((e.clientY - rect.top - rect.height / 2) * 1.8);
    setCoords({ x: posX, y: posY });

    // 3. Laser Reticle Micro Interaction Position
    if (cursorRef.current) {
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      cursorRef.current.style.transform = `translate3d(${localX}px, ${localY}px, 0)`;
    }
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (imageRef.current) resetParallax(imageRef.current);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/10] lg:aspect-[16/9] overflow-hidden bg-[#0a0a0a] group border border-zinc-800/80 rounded-sm cursor-none select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* GAMBAR UTAMA */}
      <img
        ref={imageRef}
        src="/images/cnc/cnc-machine.webp"
        alt="CNC Machining Process"
        className="absolute -top-[5%] -left-[5%] w-[110%] h-[110%] max-w-none object-cover brightness-75 group-hover:brightness-95 transition-[filter] duration-700"
      />

      {/* OVERLAY GRID INDUSTRIAL (CAD-STYLE) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* HUD OVERLAY - STATUS INDIKATOR */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-400 tracking-wider pointer-events-none flex items-center gap-2 z-10">
        <span className="inline-block w-1.5 h-1.5 bg-[#FF6A00] rounded-full animate-pulse" />
        <span>CAM_FEED_01 // ACTIVE</span>
      </div>

      {/* HUD OVERLAY - REALTIME COORDINATE TRACKER */}
      <div className="absolute top-4 right-4 font-mono text-[10px] text-zinc-300 pointer-events-none bg-black/70 backdrop-blur-md px-3 py-1 border border-zinc-800 rounded z-10 flex items-center gap-3">
        <span><strong className="text-[#FF6A00]">X:</strong> {coords.x >= 0 ? `+${coords.x}` : coords.x}mm</span>
        <span><strong className="text-[#FF6A00]">Y:</strong> {coords.y >= 0 ? `+${coords.y}` : coords.y}mm</span>
      </div>

      {/* HUD OVERLAY - SPEC INFO FOOTER */}
      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-zinc-500 pointer-events-none hidden sm:block z-10">
        FEED_RATE: 12,000 RPM // AXIS: 3-AXIS
      </div>

      {/* MICRO INTERACTION: LASER TARGET RETICLE */}
      <div 
        ref={cursorRef}
        className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200 z-30 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="w-9 h-9 border border-[#FF6A00]/60 rounded-full animate-[spin_8s_linear_infinite] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#FF6A00] rounded-full" />
          </div>
          {/* Target crosshair lines */}
          <div className="absolute -top-2 w-px h-1.5 bg-[#FF6A00]" />
          <div className="absolute -bottom-2 w-px h-1.5 bg-[#FF6A00]" />
          <div className="absolute -left-2 h-px w-1.5 bg-[#FF6A00]" />
          <div className="absolute -right-2 h-px w-1.5 bg-[#FF6A00]" />
          
          {/* Target Label */}
          <span className="absolute left-6 font-mono text-[8px] text-[#FF6A00] tracking-widest bg-black/80 px-1.5 py-0.5 border border-[#FF6A00]/40 whitespace-nowrap">
            TARGET LOC
          </span>
        </div>
      </div>

      {/* HOTSPOT ANNOTATIONS */}
      <CNCAnnotations />
    </div>
  );
}