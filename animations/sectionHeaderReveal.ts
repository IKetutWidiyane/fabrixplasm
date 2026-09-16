import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reveal header section dengan gaya ContactSection (tenang & monumental).
 *
 * - `.reveal-divider`  : garis horizontal membuka dari kiri ke kanan (scaleX 0 → 1)
 * - `.reveal-headline` : baris judul naik + fade (y: 60 → 0), stagger per baris
 * - `.reveal-fade-up`  : label & paragraf fade-up halus (y: 20 → 0)
 *
 * `toggleActions: "play none none reverse"` → animasi membalik saat
 * scroll/swipe ke atas (responsif di desktop & mobile).
 *
 * @param scopeEl   Elemen cakupan agar selector `.reveal-*` tidak bocor
 *                  ke section/komponen lain di halaman.
 * @param triggerEl Elemen yang memicu ScrollTrigger.
 */
export const setupSectionHeaderReveal = (
  scopeEl: HTMLElement,
  triggerEl: HTMLElement
) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  // 1. Divider horizontal membuka dari kiri ke kanan
  const divider = scopeEl.querySelector(".reveal-divider");
  if (divider) {
    tl.fromTo(
      divider,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1.2, ease: "power3.inOut" }
    );
  }

  // 2. Baris judul besar naik berurutan (stagger)
  const headlineLines = gsap.utils.toArray<HTMLElement>(
    ".reveal-headline",
    scopeEl
  );
  tl.fromTo(
    headlineLines,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
    },
    "-=0.7"
  );

  // 3. Label & paragraf fade-up halus
  const fadeUps = gsap.utils.toArray<HTMLElement>(".reveal-fade-up", scopeEl);
  tl.fromTo(
    fadeUps,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
    },
    "-=0.5"
  );

  return tl;
};