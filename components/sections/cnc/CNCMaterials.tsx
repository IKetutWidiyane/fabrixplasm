"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Pastikan ScrollTrigger diregistrasi agar tidak error di Next.js
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const materials = [
  { name: "ALUMINUM", props: "Lightweight, Machinable, Corrosion resistant" },
  { name: "STEEL", props: "High strength, Durable, Industrial standard" },
  { name: "STAINLESS", props: "Rust-proof, Medical grade, Aesthetic finish" },
  { name: "BRASS", props: "Low friction, Acoustic properties, Decorative" },
  { name: "PLASTICS", props: "Delrin, PEEK, Nylon for specialized parts" },
];

export default function CNCMaterials() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".material-label",
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full py-8">
      <div className="font-mono text-zinc-500 text-sm mb-8 md:mb-12">MATERIALS</div>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-x-12 md:gap-y-10 flex-wrap">
        {materials.map((mat, idx) => (
          <div 
            key={mat.name}
            className="material-label group relative cursor-pointer"
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
            // Tambahkan onClick untuk dukungan layar sentuh (HP)
            onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
          >
            <h4 className={`text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold tracking-tighter transition-colors duration-300 ${
              activeIndex === null 
                ? "text-zinc-300" 
                : activeIndex === idx 
                  ? "text-white" 
                  : "text-zinc-700 md:text-zinc-800"
            }`}>
              {mat.name}
            </h4>
            
            {/* 
              Di Mobile: Menjadi "Accordion" yang mendorong konten di bawahnya ke bawah (menggunakan max-h).
              Di Desktop (md+): Menjadi Tooltip "Absolute" yang melayang tanpa mengubah layout. 
            */}
            <div className={`
              overflow-hidden md:overflow-visible transition-all duration-300 ease-in-out
              md:absolute md:top-full md:left-0 md:mt-4 md:w-56
              ${
                activeIndex === idx 
                  ? "max-h-24 opacity-100 mt-2 md:mt-0 md:translate-y-0" 
                  : "max-h-0 opacity-0 md:-translate-y-2 pointer-events-none"
              }
            `}>
              <div className="h-px w-12 md:w-full bg-zinc-600 mb-2 mt-1 md:mt-0"></div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono">
                {mat.props}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}