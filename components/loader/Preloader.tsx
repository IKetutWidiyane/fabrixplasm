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

export default function Preloader({ state }: PreloaderProps) {
  const { progress, status, done } = state;

  const overlayRef = useRef<HTMLDivElement>(null);
  const [exited, setExited] = useState(false);

  // Lock scrolling while loading.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Once critical assets are ready, prepare the rest of the site.
  useEffect(() => {
    if (!done) return;

    document.body.style.overflow = "";

    preloadIdleAssets();

    window.dispatchEvent(
      new CustomEvent(PRELOADER_READY_EVENT)
    );
  }, [done]);

  useGSAP(
    () => {
      if (!done || !overlayRef.current) return;

      const overlay = overlayRef.current;

      const tl = gsap.timeline({
        onComplete: () => {
          setExited(true);
        },
      });

      tl.set(overlay, {
        pointerEvents: "none",
      })

        // FP logo completes its final movement.
        .to(
          ".preloader__mark",
          {
            scale: 1.05,
            duration: 0.35,
            ease: "power2.out",
          }
        )

        // Content moves slightly back.
        .to(
          ".preloader__content",
          {
            opacity: 0,
            scale: 0.985,
            duration: 0.45,
            ease: "power2.inOut",
          },
          "-=0.05"
        )

        // Curtain exits upward.
        .to(
          overlay,
          {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
          },
          "-=0.1"
        );
    },
    {
      dependencies: [done],
      scope: overlayRef,
    }
  );

  if (exited) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] h-screen w-screen overflow-hidden bg-[#090909]"
      aria-busy={!done}
      aria-label="Loading FABRIXPLASM"
    >
      <LoadingProgress
        progress={progress}
        status={status}
      />
    </div>
  );
}