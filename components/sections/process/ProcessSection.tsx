"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProcessProgress from "./ProcessProgress";
import ProcessSteps from "./ProcessSteps";
import ProcessVisual from "./ProcessVisual";
import { processData } from "@/data/processData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Dibuat 1 agar pergerakan scroll lebih presisi
          onUpdate: (self) => {
            const progress = self.progress;
            const currentStep = Math.min(3, Math.floor(progress * 4));
            setActiveStep(currentStep);
          },
        },
      });

      // Animasi transisi gambar
      processData.forEach((_, idx) => {
        if (idx === 0) return; // Gambar pertama (0) sudah tampil by default

        // Gambar baru disapu dari bawah (inset 100%) ke atas (inset 0%)
        tl.to(`.process-image-${idx}`, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "power2.inOut",
        }, idx - 1); // Posisi di timeline (0, 1, 2)

        // Efek parallax vertikal kecil
        tl.fromTo(`.process-image-inner-${idx}`,
          { y: "10%" },
          { y: "0%", duration: 1, ease: "power2.out" },
          idx - 1
        );
      });
    });

    return () => mm.revert(); // Cleanup GSAP
  }, { scope: containerRef });

  return (
    <section className="relative z-10 bg-zinc-950 text-zinc-50">
      {/* 
        DESKTOP VERSION
        Tinggi 400vh untuk menahan scroll, isinya 100vh lengket (sticky) 
      */}
      <div ref={containerRef} className="hidden md:block relative h-[400vh] w-full">
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-12 gap-12 items-center">
            
            {/* Bagian Kiri: Typografi & Logic */}
            <div className="col-span-4 lg:col-span-5 flex flex-col justify-center pr-8">
              <ProcessProgress activeStep={activeStep} />
              <ProcessSteps activeStep={activeStep} />
              
              {/* Closing statement di akhir step */}
              <div className={`mt-16 transition-all duration-700 delay-300 ${activeStep === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
                <div className="h-[1px] w-12 bg-zinc-700 mb-6" />
                <h4 className="text-xl font-bold tracking-tight mb-2">DIGITAL PRECISION.<br/>PHYSICAL RESULT.</h4>
                <p className="text-sm text-zinc-500 font-mono flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  SCROLL TO CAPABILITIES <span>→</span>
                </p>
              </div>
            </div>

            {/* Bagian Kanan: Visualizer */}
            <div className="col-span-8 lg:col-span-7">
              <ProcessVisual />
            </div>
            
          </div>
        </div>
      </div>

      {/* 
        MOBILE VERSION
        Normal Scroll Sequence
      */}
      <div className="md:hidden flex flex-col w-full py-24 px-6 gap-24">
        <div className="mb-8">
          <h2 className="text-sm font-mono text-zinc-500 mb-4">03 — PROCESS</h2>
          <h3 className="text-3xl font-bold tracking-tighter">FROM DIGITAL<br/>TO PHYSICAL.</h3>
        </div>

        {processData.map((step, idx) => (
          <div key={step.id} className="flex flex-col gap-6">
            <div className="font-mono text-zinc-500 text-sm border-b border-zinc-800 pb-2 flex justify-between">
              <span>{step.id} {step.phase}</span>
              <span>0{idx + 1} / 04</span>
            </div>
            <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden">
              <img src={step.image} alt={step.title} className="w-full h-full object-cover grayscale mix-blend-lighten" />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">{step.title}</h4>
              <p className="text-zinc-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}