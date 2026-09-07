"use client";

import { useState } from "react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const materials = [
  { name: "ALUMINUM", props: "Lightweight, Machinable, Corrosion resistant" },
  { name: "STEEL", props: "High strength, Durable, Industrial standard" },
  { name: "STAINLESS", props: "Rust-proof, Medical grade, Aesthetic finish" },
  { name: "BRASS", props: "Low friction, Acoustic properties, Decorative" },
  { name: "PLASTICS", props: "Delrin, PEEK, Nylon for specialized parts" },
];

export default function CNCMaterials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".material-label",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative">
      <div className="font-mono text-zinc-500 text-sm mb-12">MATERIALS</div>
      
      <div className="flex flex-col md:flex-row gap-x-12 gap-y-6 flex-wrap">
        {materials.map((mat, idx) => (
          <div 
            key={mat.name}
            className="material-label group relative cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <h4 className={`text-2xl md:text-3xl font-bold tracking-tighter transition-colors duration-300 ${
              hoveredIndex === null 
                ? "text-zinc-300" 
                : hoveredIndex === idx 
                  ? "text-white" 
                  : "text-zinc-800"
            }`}>
              {mat.name}
            </h4>
            
            {/* Tooltip Hover Info */}
            <div className={`absolute top-full left-0 mt-4 w-48 transition-all duration-300 ${
              hoveredIndex === idx ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}>
              <div className="h-px w-full bg-zinc-600 mb-2"></div>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                {mat.props}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}