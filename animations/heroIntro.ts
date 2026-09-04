import gsap from "gsap";

export const animateHeroIntro = () => {
  const tl = gsap.timeline();
  tl.fromTo(
    ".fade-in-up",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1, duration: 1.5, ease: "expo.out", delay: 0.2 }
  );
  return tl;
};