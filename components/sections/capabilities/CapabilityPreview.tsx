"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { CapabilityItemData } from "@/data/capabilitiesData";
import { setupFloatingPreview } from "@/animations/capabilitiesHover";

export interface CapabilityPreviewHandle {
  updatePosition: (clientX: number, clientY: number) => void;
  setActiveItem: (item: CapabilityItemData | null) => void;
}

interface CapabilityPreviewProps {
  items: CapabilityItemData[];
}

export const CapabilityPreview = forwardRef<CapabilityPreviewHandle, CapabilityPreviewProps>(
  ({ items }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const activeIndexRef = useRef<number>(-1);
    const trackerRef = useRef<((x: number, y: number) => void) | null>(null);

    useImperativeHandle(ref, () => ({
      updatePosition: (x: number, y: number) => {
        if (!trackerRef.current && containerRef.current) {
          trackerRef.current = setupFloatingPreview(containerRef.current);
        }
        if (trackerRef.current) {
          trackerRef.current(x, y);
        }
      },
      setActiveItem: (item: CapabilityItemData | null) => {
        if (!containerRef.current) return;
        if (!item) {
          containerRef.current.style.opacity = "0";
          containerRef.current.style.pointerEvents = "none";
          activeIndexRef.current = -1;
          return;
        }

        const idx = items.findIndex((it) => it.id === item.id);
        if (idx !== -1 && imageContainerRef.current) {
          // Show active image layer instantly
          const layers = imageContainerRef.current.querySelectorAll<HTMLDivElement>(".preview-layer");
          layers.forEach((layer, i) => {
            layer.style.opacity = i === idx ? "1" : "0";
          });
          activeIndexRef.current = idx;
        }

        containerRef.current.style.opacity = "1";
      },
    }));

    return (
      <div
        ref={containerRef}
        className="fixed top-0 left-0 z-40 pointer-events-none hidden [@media(pointer:fine)]:block opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
        aria-hidden="true"
      >
        <div
          ref={imageContainerRef}
          className="relative w-72 h-44 overflow-hidden border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/80 rounded-sm"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="preview-layer absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300"
            >
              <img
                src={item.imagePreview}
                alt={item.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover grayscale brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center font-mono text-[9px] text-zinc-300 tracking-wider uppercase">
                <span className="text-[#FF6A00] font-bold">{`${item.id} // ${item.shortName}`}</span>
                <span className="text-zinc-400">{item.specs[0]?.value.split(" ")[0]}</span>
              </div>
            </div>
          ))}

          {/* Precision reticle crosshair in corner */}
          <div className="absolute top-2 right-2 font-mono text-[8px] text-zinc-500 tracking-widest">
            CAM_VIEW
          </div>
        </div>
      </div>
    );
  }
);

CapabilityPreview.displayName = "CapabilityPreview";
