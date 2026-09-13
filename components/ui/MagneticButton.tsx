"use client";
import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

export default function MagneticButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const quickX = useRef<((value: number) => void) | null>(null);
  const quickY = useRef<((value: number) => void) | null>(null);
  const isFinePointer = useRef(false);

  useEffect(() => {
    isFinePointer.current = window.matchMedia("(pointer: fine)").matches;
    if (ref.current && isFinePointer.current) {
      quickX.current = gsap.quickTo(ref.current, "x", { duration: 0.4, ease: "power3.out" });
      quickY.current = gsap.quickTo(ref.current, "y", { duration: 0.4, ease: "power3.out" });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isFinePointer.current || !ref.current || !quickX.current || !quickY.current) return;
    const element = ref.current;
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.3;
    const y = (e.clientY - (top + height / 2)) * 0.3;
    quickX.current(x);
    quickY.current(y);
  };

  const handleMouseLeave = () => {
    if (!isFinePointer.current || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="cursor-pointer">
      {children}
    </div>
  );
}