"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMousePosition } from "@/hooks/useMousePosition";
import { cn } from "@/lib/utils";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition();

  useEffect(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: "power2.out" });
    }
  }, [x, y]);

  return (
    <div
      ref={cursorRef}
      className={cn(
        "fixed top-0 left-0 w-2 h-2 bg-[#E8E5DE] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300"
      )}
    />
  );
}