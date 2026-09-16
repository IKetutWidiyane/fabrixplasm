import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Awwwards-style engineered scroll interaction for Selected Works items.
 *
 * 1. "Machined blind open" entrance reveal — clip-path vertical wipe with a
 *    subtle rotation + scale settle (the signature editorial pop-in).
 * 2. Staggered content fade-up for the technical header / details below the photo.
 * 3. Heavy scroll-scrubbed parallax — the image breathes translate + scale while
 *    the item crosses the viewport (scrubbed for a 1:1 scroll feel).
 */
export const setupWorkItemParallax = (
  containerEl: HTMLElement,
  imageEl: HTMLElement,
  clipWrapperEl: HTMLElement,
  infoEl: HTMLElement | null
) => {
  if (prefersReducedMotion()) return;

  // 1. Entrance reveal — vertical blind wipe + rotation/scale settle
  gsap.fromTo(
    clipWrapperEl,
    { clipPath: "inset(0% 0% 100% 0%)", scale: 1.05, rotation: -1.25 },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      rotation: 0,
      duration: 1.3,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: containerEl,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // 2. Content stagger fade-up (title/desc column + specs column)
  if (infoEl) {
    const parts = Array.from(infoEl.children);
    gsap.fromTo(
      parts.length > 0 ? parts : infoEl,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: clipWrapperEl,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // 3. Scroll-scrubbed translate + scale parallax
  return gsap.fromTo(
    imageEl,
    { yPercent: -8, scale: 1.1 },
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

