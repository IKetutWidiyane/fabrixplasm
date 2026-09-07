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
      ease: "none", // "none" adalah ease terbaik jika menggunakan scrub
      scrollTrigger: {
        trigger: triggerElement,
        // UBAH START: Mulai animasi saat gambar menyentuh 95% layar (hampir ujung bawah), sehingga tidak telat.
        start: "top 95%", 
        // UBAH END: Animasi selesai terbuka penuh saat gambar berada di tengah layar.
        end: "center center", 
        // UBAH SCRUB: Turunkan dari 1 menjadi 0.2 agar animasinya lebih cepat dan responsif mengikuti kecepatan scroll jarimu.
        scrub: 0.2, 
      },
    }
  );
};