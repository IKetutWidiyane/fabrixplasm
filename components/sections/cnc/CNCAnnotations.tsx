"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { hoverHotspot } from "@/animations/cncHover";

export default function CNCAnnotations() {
  const annotationRef = useRef<HTMLDivElement>(null);

  // Animasi pulsing dan hover text ditangani murni via CSS/Tailwind untuk efisiensi,
  // tetapi jika butuh animasi GSAP khusus saat hover, kita panggil dari cncHover.ts
  useGSAP(() => {
    if (annotationRef.current) {
      hoverHotspot(annotationRef.current);
    }
  }, { scope: annotationRef });

  return (
    <div ref={annotationRef} className="absolute inset-0 z-20 pointer-events-none">
      {/* Hotspot 1 - Tool Head */}
      <div className="absolute top-[40%] left-[60%] group pointer-events-auto">
        {/* Titik / Node */}
        <div className="w-3 h-3 bg-white rounded-full relative cursor-crosshair">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
        </div>
        
        {/* Garis & Text Annotation */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex flex-col items-start">
            <div className="w-px h-8 bg-zinc-400 mb-1 ml-2"></div>
            <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-zinc-700 p-3 text-xs w-48">
              <p className="font-mono text-white mb-1">TOOL HEAD</p>
              <div className="w-full h-px bg-zinc-700 mb-2"></div>
              <p className="text-zinc-400 leading-relaxed">
                Precision cutting & controlled movement at 10,000 RPM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}