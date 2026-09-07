import gsap from "gsap";

/**
 * Animasi reveal text dari bawah ke atas menggunakan clip-path
 */
export const revealTextHero = (targets: string | Element[], triggerData: ScrollTrigger.Vars) => {
  return gsap.fromTo(
    targets,
    { 
      y: 50, 
      opacity: 0, 
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" 
    },
    {
      y: 0,
      opacity: 1,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 1,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: triggerData,
    }
  );
};

/**
 * Animasi gambar terbuka/terpotong (seperti efek mesin memotong material)
 */
export const revealImageCut = (target: Element, triggerElement: Element) => {
  return gsap.fromTo(
    target,
    { clipPath: "inset(100% 0% 0% 0%)", scale: 1.05 },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: triggerElement,
        // UBAH BARIS INI: Dari "top 80%" menjadi "top 95%"
        start: "top 95%", 
        end: "top 30%", // Gambar akan selesai terbuka full saat posisinya di 30% layar
        scrub: 1, 
      },
    }
  );
};