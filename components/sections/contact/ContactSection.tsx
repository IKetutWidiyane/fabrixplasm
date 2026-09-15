"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import MagneticButton from "@/components/ui/MagneticButton";
import { COMPANY_DATA } from "@/data/company";
import { setupContactReveal } from "@/animations/contactReveal";

export default function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (containerRef.current) {
        setupContactReveal(containerRef.current);
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative z-10 w-full min-h-[90vh] bg-[#050505] text-white pt-28 pb-20 px-6 md:px-12 lg:px-24 flex flex-col justify-between overflow-hidden border-t border-zinc-900"
    >
      {/* 1. Slowly opening precision horizontal divider */}
      <div className="contact-divider w-full h-px bg-zinc-800 mb-16" />

      {/* 2. Top Header Metadata */}
      <div className="flex justify-between items-center font-mono text-xs text-zinc-500 tracking-widest uppercase mb-12">
        <span className="text-[#FF6A00]">06 — CONTACT / ACTION</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-400">CAPACITY: OPEN FOR PRODUCTION</span>
        </div>
      </div>

      {/* 3. Monumental Headline */}
      <div className="max-w-6xl my-auto">
        <h2 className="text-[clamp(3.2rem,9vw,9.5rem)] font-bold tracking-tighter leading-[0.88] uppercase select-none">
          <span className="contact-headline-line block text-zinc-100">LET&apos;S</span>
          <span className="contact-headline-line block text-zinc-400">MAKE</span>
          <span className="contact-headline-line block text-zinc-100">SOMETHING</span>
          <span className="contact-headline-line block text-[#FF6A00]">REAL.</span>
        </h2>
      </div>

      {/* 4. Action CTA Row */}
      <div className="contact-fade-up mt-16 md:mt-24 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="max-w-md">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3">
            TECHNICAL CONSULTATION & RFQ
          </p>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
            Send engineering drawings, STEP/IGES CAD files, or custom production specs for an immediate feasibility and tolerance review.
          </p>
        </div>

        {/* Magnetic Button CTA */}
        <div className="shrink-0">
          <MagneticButton>
            <a
              href={`mailto:${COMPANY_DATA.email}?subject=Fabrication%20Inquiry%20-%20FABRIXPLASM`}
              className="inline-flex items-center gap-4 bg-[#E8E5DE] text-black font-mono text-xs md:text-sm font-bold tracking-[0.2em] px-8 py-5 hover:bg-[#FF6A00] hover:text-white transition-colors duration-300 uppercase shadow-2xl group"
            >
              <span>START A PROJECT</span>
              <span className="text-lg group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

