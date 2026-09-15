"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Aktifkan hanya pada device dengan mouse / pointer presisi (desktop/laptop)
    // Nonaktif pada smartphone dan tablet untuk menjaga performa sentuh
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !cursorRef.current) return;

    const el = cursorRef.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.12, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.12, ease: "power2.out" });

    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to(el, { opacity: 1, duration: 0.2 });
        isVisible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseLeave = () => {
      gsap.to(el, { opacity: 0, duration: 0.2 });
      isVisible = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-2 h-2 bg-[#E8E5DE] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-0"
    />
  );
}