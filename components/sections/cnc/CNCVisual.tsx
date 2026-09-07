"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { revealImageCut } from "@/animations/cncReveal";
import { setupMouseParallax, resetParallax } from "@/animations/cncHover";
import CNCAnnotations from "./CNCAnnotations";

// Daftar foto yang bisa diganti-ganti (Tambahkan foto lain jika ada)
const CNC_IMAGES = [
  {
    id: 1,
    src: "/images/cnc/cnc-machine.webp",
    alt: "CNC Machine Overview",
    label: "01 MACHINE",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2000&auto=format&fit=crop",
    alt: "CNC Cutting Process",
    label: "02 CUTTING",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=2000&auto=format&fit=crop",
    alt: "CNC Metal Result",
    label: "03 DETAIL",
  },
];

export default function CNCVisual() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const updateParallax = useRef<Function | null>(null);

  useGSAP(() => {
    if (containerRef.current && imageRef.current) {
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
      className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-900 group rounded-sm border border-zinc-800"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gambar Utama dengan Sizing Presisi */}
      <img
        key={CNC_IMAGES[currentIndex].src}
        ref={imageRef}
        src={CNC_IMAGES[currentIndex].src}
        alt={CNC_IMAGES[currentIndex].alt}
        className="absolute -top-[2.5%] -left-[2.5%] w-[105%] h-[105%] max-w-none object-cover brightness-75 group-hover:brightness-100 transition-[filter,opacity] duration-500"
      />
      
      {/* Hotspot Annotations */}
      <CNCAnnotations />

      {/* Tombol Switcher Foto (Kanan Bawah) */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 border border-zinc-800">
        {CNC_IMAGES.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setCurrentIndex(idx)}
            className={`px-2.5 py-1 font-mono text-[10px] tracking-wider transition-all ${
              currentIndex === idx
                ? "bg-white text-black font-bold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            {img.label}
          </button>
        ))}
      </div>
    </div>
  );
}