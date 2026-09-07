import gsap from "gsap";

/**
 * Setup QuickTo untuk performa mouse parallax 60FPS yang smooth (tanpa re-render react)
 * Mengembalikan fungsi update untuk dipanggil di onMouseMove
 */
export const setupMouseParallax = (target: Element, intensity: number = 0.05) => {
  const xTo = gsap.quickTo(target, "x", { duration: 0.8, ease: "power3" });
  const yTo = gsap.quickTo(target, "y", { duration: 0.8, ease: "power3" });

  return (clientX: number, clientY: number, containerRect: DOMRect) => {
    // Menghitung pergerakan mouse dari titik tengah container
    const x = (clientX - containerRect.left - containerRect.width / 2) * intensity;
    const y = (clientY - containerRect.top - containerRect.height / 2) * intensity;

    xTo(x);
    yTo(y);
  };
};

/**
 * Reset posisi parallax ke 0 (digunakan di onMouseLeave)
 */
export const resetParallax = (target: Element) => {
  gsap.to(target, { x: 0, y: 0, duration: 0.8, ease: "power3" });
};

/**
 * Custom logic untuk hotspot jika dibutuhkan via GSAP
 */
export const hoverHotspot = (container: Element) => {
  const hotspots = container.querySelectorAll(".group");
  
  hotspots.forEach((spot) => {
    spot.addEventListener("mouseenter", () => {
      gsap.to(spot.querySelector(".bg-white"), { scale: 1.2, duration: 0.3 });
    });
    spot.addEventListener("mouseleave", () => {
      gsap.to(spot.querySelector(".bg-white"), { scale: 1, duration: 0.3 });
    });
  });
};