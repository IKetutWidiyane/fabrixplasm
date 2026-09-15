import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Heavy, engineered scroll parallax and entrance reveal for Selected Works items
 * yPercent: -8 -> +8, subtle scale 1.04 -> 1, and precision clip-path reveal
 */
export const setupWorkItemParallax = (
  containerEl: HTMLElement,
  imageEl: HTMLElement,
  clipWrapperEl: HTMLElement
) => {
  // 1. Entrance clip-path reveal (machined metal opening effect)
  gsap.fromTo(
    clipWrapperEl,
    { clipPath: "inset(100% 0% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: containerEl,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // 2. Subtle, heavy parallax scroll
  return gsap.fromTo(
    imageEl,
    { yPercent: -8, scale: 1.04 },
    {
      yPercent: 8,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: containerEl,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
};

