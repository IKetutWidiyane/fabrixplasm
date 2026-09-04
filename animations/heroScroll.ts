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

  // UI Fade out saat scroll ke bawah memotong mesin
  tl.to(".hero-ui-fade", { opacity: 0, y: -50, scale: 0.95, duration: 0.5 }, 0.2);
  return tl;
};