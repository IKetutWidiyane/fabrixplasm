"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const specs = [
  { id: "01", title: "3-AXIS MACHINING", desc: "Complex geometry execution" },
  { id: "02", title: "PRECISION COMPONENTS", desc: "Tolerances down to ±0.01mm" },
  { id: "03", title: "PRODUCTION READY", desc: "Scalable manufacturing" },
];

export default function CNCSpecs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".spec-item",
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800 p-8 shadow-2xl relative shadow-black/50"
    >
      <div className="text-zinc-500 font-mono text-xs mb-8">CNC CAPABILITIES</div>
      
      <div className="flex flex-col gap-8">
        {specs.map((spec) => (
          <div key={spec.id} className="spec-item flex gap-6 items-start group">
            <div className="font-mono text-zinc-600 text-sm mt-1 group-hover:text-white transition-colors">
              {spec.id}
            </div>
            <div>
              <h4 className="text-lg font-semibold tracking-wide text-zinc-200 group-hover:text-white transition-colors">
                {spec.title}
              </h4>
              <p className="text-zinc-500 text-sm mt-1">{spec.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-zinc-800 text-sm text-zinc-400 leading-relaxed">
        From prototypes to production components, CNC machining gives digital designs a physical form with controlled precision and repeatability.
      </div>
    </div>
  );
}