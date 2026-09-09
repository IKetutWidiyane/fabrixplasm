"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PRELOADER_READY_EVENT } from "@/components/loader/events";

export function useLenis() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onScroll = () => ScrollTrigger.update();
    const onTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Une fois le preloader terminé, le Hero est monté et la page a changé de
    // hauteur : on recalcule les positions ScrollTrigger pour un scroll propre.
    const onPreloaderReady = () => {
      ScrollTrigger.refresh();
    };

    lenis.on("scroll", onScroll);
    gsap.ticker.add(onTicker);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener(PRELOADER_READY_EVENT, onPreloaderReady);

    return () => {
      gsap.ticker.remove(onTicker);
      lenis.destroy();
      window.removeEventListener(PRELOADER_READY_EVENT, onPreloaderReady);
    };
  }, []);
}