"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LoadingProgress from "./LoadingProgress";
import { PRELOADER_READY_EVENT } from "./events";
import { PreloaderState } from "@/hooks/useAssetPreloader";
import { preloadIdleAssets } from "@/lib/assetLoader";

interface PreloaderProps {
  state: PreloaderState;
}

/**
 * Overlay plein écran — uniquement jusqu'à ce que les assets critiques du Hero
 * soient prêts. Sortie animée GSAP, verrouillage du scroll pendant l'attente.
 */
export default function Preloader({ state }: PreloaderProps) {
  const { progress, status, done } = state;
  const overlayRef = useRef<HTMLDivElement>(null);
  const [exited, setExited] = useState(false);

  // Verrouille le scroll tant que le preloader est visible.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Une fois prêt : déverrouille + prévient le reste de l'app (Hero mount, Lenis…)
  // et lance en arrière-plan le préchargement des sections suivantes (CNC, Process).
  useEffect(() => {
    if (!done) return;
    document.body.style.overflow = "";
    preloadIdleAssets();
    window.dispatchEvent(new CustomEvent(PRELOADER_READY_EVENT));
  }, [done]);

  // Sortie animée GSAP quand tout est prêt.
  useGSAP(
    () => {
      if (!done || !overlayRef.current) return;
      const overlay = overlayRef.current;
      const tl = gsap.timeline();
      tl.set(overlay, { pointerEvents: "none" }, 0)
        .to(".preloader__content", { opacity: 0, y: -24, duration: 0.35, ease: "power2.in" }, 0)
        .to(overlay, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, 0.05)
        .call(() => setExited(true));
    },
    { dependencies: [done], scope: overlayRef },
  );

  if (exited) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0B0A] select-none"
      aria-busy="true"
      aria-label="Loading FABRIXPLASM"
    >
      <LoadingProgress progress={progress} status={status} />

      {/* Détail bas-gauche */}
      <div className="fixed bottom-6 left-6 font-mono text-[9px] text-[#8D8A82] tracking-[0.25em] uppercase">
        FABRIXPLASM // DIGITAL → PHYSICAL
      </div>
    </div>
  );
}