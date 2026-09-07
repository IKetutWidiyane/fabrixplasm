"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { revealImageCut } from "@/animations/cncReveal";
import { setupMouseParallax, resetParallax } from "@/animations/cncHover";
import CNCAnnotations from "./CNCAnnotations";

export default function CNCVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const updateParallax = useRef<Function | null>(null);

  useGSAP(() => {
    if (containerRef.current && imageRef.current) {
      // Panggil fungsi dari file animation
      revealImageCut(containerRef.current, containerRef.current);
      updateParallax.current = setupMouseParallax(imageRef.current, 0.05);
    }
  }, { scope: containerRef });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (updateParallax.current && containerRef.current) {
      updateParallax.current(e.clientX, e.clientY, containerRef.current.getBoundingClientRect());
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current) resetParallax(imageRef.current);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-900 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imageRef}
        src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=2000&auto=format&fit=crop"
        alt="CNC Machining Process"
        className="w-[105%] h-[105%] max-w-none object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 brightness-75 group-hover:brightness-100 transition-all duration-700"
      />
      
      {/* Panggil komponen Annotations yang sudah kita pisah */}
      <CNCAnnotations />
    </div>
  );
}