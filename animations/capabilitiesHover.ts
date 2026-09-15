import gsap from "gsap";

/**
 * Setup high-performance gsap.quickTo tracker for floating capability image
 * Runs at 60+ FPS outside React lifecycle.
 */
export const setupFloatingPreview = (previewEl: HTMLElement) => {
  const xTo = gsap.quickTo(previewEl, "x", { duration: 0.35, ease: "power3.out" });
  const yTo = gsap.quickTo(previewEl, "y", { duration: 0.35, ease: "power3.out" });
  const rotateTo = gsap.quickTo(previewEl, "rotation", { duration: 0.45, ease: "power2.out" });

  let lastX = 0;

  return (clientX: number, clientY: number) => {
    // Offset thumbnail slightly from cursor so it doesn't block text
    const targetX = clientX + 32;
    const targetY = clientY - 140;

    // Subtle dynamic tilt based on horizontal mouse movement speed
    const deltaX = clientX - lastX;
    const tilt = Math.max(-8, Math.min(8, deltaX * 0.4));
    lastX = clientX;

    xTo(targetX);
    yTo(targetY);
    rotateTo(tilt);
  };
};

/**
 * Animate typography displacement when hovering capability item
 */
export const animateRowHover = (
  textEl: HTMLElement | null,
  arrowEl: HTMLElement | null,
  isEnter: boolean
) => {
  if (!textEl) return;
  if (isEnter) {
    gsap.to(textEl, {
      x: 24,
      color: "#FFFFFF",
      duration: 0.4,
      ease: "power2.out",
    });
    if (arrowEl) {
      gsap.to(arrowEl, {
        x: 8,
        color: "#FF6A00",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  } else {
    gsap.to(textEl, {
      x: 0,
      color: "",
      duration: 0.4,
      ease: "power2.out",
    });
    if (arrowEl) {
      gsap.to(arrowEl, {
        x: 0,
        color: "",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }
};

