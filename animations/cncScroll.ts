import gsap from "gsap";

/**
 * Memunculkan item secara berurutan dari samping (digunakan di CNCSpecs)
 */
export const staggerSpecsOnScroll = (targets: string | Element[], triggerElement: Element) => {
  return gsap.fromTo(
    targets,
    { opacity: 0, x: 30 },
    {
      opacity: 1,
      x: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: triggerElement,
        // UBAH BARIS INI: Dari "top 80%" menjadi "top 90%"
        start: "top 90%", 
        toggleActions: "play none none reverse",
      },
    }
  );
};

/**
 * Fade up berurutan untuk list material di bawah
 */
export const staggerMaterialsOnScroll = (targets: string | Element[], triggerElement: Element) => {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power1.out",
      scrollTrigger: {
        trigger: triggerElement,
        start: "top 85%",
      },
    }
  );
};