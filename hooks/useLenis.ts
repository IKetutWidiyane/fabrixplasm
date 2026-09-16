"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PRELOADER_READY_EVENT } from "@/components/loader/events";
import { lenisStore } from "@/lib/lenis";

export function useLenis() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Aktifkan sinkronisasi sentuh agar swipe di HP tetap terasa natural
      // dan posisi scroll Lenis ikut ter-update sehingga ScrollTrigger
      // (mikro-interaksi) merespons gerakan ke atas / bawah.
      syncTouch: true,
      touchMultiplier: 1,
    });

    // Bagikan instance ke Navbar (untuk kunci scroll saat menu mobile terbuka)
    lenisStore.instance = lenis;

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
    // lagSmoothing(500, 33) mencegah stutter saat terjadi lonjakan GC / CPU di HP dan laptop hemat daya
    gsap.ticker.lagSmoothing(500, 33);
    window.addEventListener(PRELOADER_READY_EVENT, onPreloaderReady);

    return () => {
      gsap.ticker.remove(onTicker);
      lenis.destroy();
      lenisStore.instance = null;
      window.removeEventListener(PRELOADER_READY_EVENT, onPreloaderReady);
    };
  }, []);
}