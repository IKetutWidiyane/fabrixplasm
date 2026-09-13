"use client";
import { useState, useEffect } from "react";

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let rafId: number | null = null;
    let latestEvent: MouseEvent | null = null;

    const update = () => {
      if (latestEvent) {
        setMousePosition({
          x: latestEvent.clientX,
          y: latestEvent.clientY,
          normalizedX: (latestEvent.clientX / window.innerWidth) * 2 - 1,
          normalizedY: -(latestEvent.clientY / window.innerHeight) * 2 + 1,
        });
      }
      rafId = null;
    };

    const onMove = (e: MouseEvent) => {
      latestEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return mousePosition;
}