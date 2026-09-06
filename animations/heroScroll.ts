import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const createHeroScrollUI = (triggerElement: HTMLElement | null) => {
  if (!triggerElement) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  // Babak 1: UI awal fade out saat scroll mulai memotong
  tl.to(".hero-ui-fade", { opacity: 0, y: -50, scale: 0.95, duration: 0.5 }, 0.08);

  // Babak 2: end-state (FABRICATION COMPLETE) fade in mendekati akhir scroll
  tl.fromTo(".hero-end-fade", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, 0.8);
  return tl;
};