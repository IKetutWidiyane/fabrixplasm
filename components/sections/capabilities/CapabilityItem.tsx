"use client";

import { useRef } from "react";
import { CapabilityItemData } from "@/data/capabilitiesData";
import { animateRowHover } from "@/animations/capabilitiesHover";

interface CapabilityItemProps {
  item: CapabilityItemData;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  onHoverDesktop: (item: CapabilityItemData | null) => void;
}

export function CapabilityItem({
  item,
  isOpenMobile,
  onToggleMobile,
  onHoverDesktop,
}: CapabilityItemProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    onHoverDesktop(item);
    animateRowHover(textRef.current, arrowRef.current, true);
  };

  const handleMouseLeave = () => {
    onHoverDesktop(null);
    animateRowHover(textRef.current, arrowRef.current, false);
  };

  return (
    <div
      ref={rowRef}
      className="border-b border-zinc-800/80 transition-colors duration-300"
    >
      {/* 
        DESKTOP ROW (md:flex)
        Massive typography, hover displacement, pointer:fine floating preview trigger
      */}
      <div
        className="hidden md:flex items-center justify-between py-10 lg:py-14 cursor-pointer select-none group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-baseline gap-8 lg:gap-16">
          <span className="font-mono text-xs text-zinc-600 tracking-widest group-hover:text-[#FF6A00] transition-colors">
            {item.id}
          </span>
          <h3
            ref={textRef}
            className="text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-zinc-300 group-hover:text-white transition-colors"
          >
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-8 lg:gap-12">
          <div className="hidden xl:flex flex-col text-right font-mono text-[11px] text-zinc-500 tracking-wider">
            <span className="text-zinc-400">{item.subtitle}</span>
            <span>{item.specs[0]?.label}: {item.specs[0]?.value}</span>
          </div>

          <span
            ref={arrowRef}
            className="font-mono text-2xl lg:text-3xl text-zinc-600 transition-colors"
          >
            →
          </span>
        </div>
      </div>

      {/* 
        MOBILE ACCORDION (md:hidden)
        Tap to toggle inline preview and detailed specs
      */}
      <div className="md:hidden py-6">
        <button
          type="button"
          onClick={onToggleMobile}
          className="w-full flex items-center justify-between text-left py-2 focus:outline-none"
          aria-expanded={isOpenMobile}
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-zinc-500">
              {item.id}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              {item.name}
            </h3>
          </div>

          <span className="font-mono text-xl text-[#FF6A00] w-6 h-6 flex items-center justify-center">
            {isOpenMobile ? "−" : "+"}
          </span>
        </button>

        {/* Accordion Expand Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpenMobile ? "max-h-[700px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-2 pb-6 flex flex-col gap-5">
            {/* Inline image for touch devices */}
            <div className="w-full aspect-[16/10] bg-zinc-900 overflow-hidden border border-zinc-800 rounded-sm">
              <img
                src={item.imagePreview}
                alt={item.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover grayscale contrast-110"
              />
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed">
              {item.description}
            </p>

            {/* Spec list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60 font-mono text-[11px]">
              {item.specs.map((sp) => (
                <div key={sp.label} className="flex flex-col">
                  <span className="text-zinc-500 uppercase">{sp.label}</span>
                  <span className="text-zinc-200">{sp.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

