import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Calm, monumental reveal for Section 06 Contact
 * Staggered headline lines, opening horizontal divider, and metadata fade
 */
export const setupContactReveal = (containerEl: HTMLElement) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  // 1. Divider line opens from 0 to 100% width
  tl.fromTo(
    containerEl.querySelector(".contact-divider"),
    { scaleX: 0, transformOrigin: "left center" },
    { scaleX: 1, duration: 1.2, ease: "power3.inOut" }
  );

  // 2. Monumental heading reveal lines
  const headingLines = containerEl.querySelectorAll(".contact-headline-line");
  tl.fromTo(
    headingLines,
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

  // 3. CTA button & details fade up smoothly
  tl.fromTo(
    containerEl.querySelectorAll(".contact-fade-up"),
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

