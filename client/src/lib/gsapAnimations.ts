import gsap from "gsap";
import { useEffect, useRef } from "react";

// Global flag to disable animations
const ANIMATIONS_DISABLED = false;

/**
 * Hook for GSAP timeline animations on element mount
 */
export function useGsapAnimation(callback: (ctx: gsap.Context) => void, deps: React.DependencyList = []) {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (ANIMATIONS_DISABLED) return;
    
    // Create context for automatic cleanup
    ctx.current = gsap.context(() => {
      callback(ctx.current!);
    });

    return () => {
      ctx.current?.revert();
    };
  }, deps);

  return ctx.current;
}

/**
 * Animate a card on hover with GSAP
 */
export function setupCardHoverAnimation(selector: string) {
  if (ANIMATIONS_DISABLED) return;
  
  const cards = document.querySelectorAll(selector);

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -8,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  });
}

/**
 * Animate resume content sections with staggered entrance
 */
export function animateResumeSections(selector: string) {
  if (ANIMATIONS_DISABLED) return gsap.timeline();
  
  const tl = gsap.timeline();

  tl.to(`${selector}`, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "cubic.out",
    stagger: 0.1,
  });

  return tl;
}

/**
 * Pulse animation for elements
 */
export function pulseElement(element: Element, intensity: number = 1.1) {
  if (ANIMATIONS_DISABLED) return;
  
  gsap.to(element, {
    scale: intensity,
    duration: 0.5,
    ease: "power1.inOut",
    yoyo: true,
    repeat: 1,
  });
}

/**
 * Smooth scroll animation
 */
export function smoothScroll(target: string | Element | number, duration: number = 0.5) {
  if (ANIMATIONS_DISABLED) return;
  
  gsap.to(window, {
    scrollTo: { y: target, autoKill: true },
    duration,
    ease: "power3.inOut",
  });
}

/**
 * Count-up animation for numbers
 */
export function countUp(
  element: HTMLElement,
  endValue: number,
  duration: number = 1,
  decimals: number = 0
) {
  if (ANIMATIONS_DISABLED) {
    element.textContent = endValue.toFixed(decimals);
    return;
  }
  
  const proxy = { value: 0 };

  gsap.to(proxy, {
    value: endValue,
    duration,
    ease: "power1.out",
    onUpdate() {
      element.textContent = proxy.value.toFixed(decimals);
    },
  });
}

/**
 * Typewriter animation effect
 */
export function typewriter(
  element: HTMLElement,
  text: string,
  duration: number = 2,
  delimiter: string = ""
) {
  const chars = text.split(delimiter);
  let index = 0;

  gsap.to(
    {},
    {
      duration: duration / chars.length,
      repeat: chars.length - 1,
      repeatDelay: 0,
      onRepeat() {
        element.textContent += chars[index];
        index++;
      },
      ease: "none",
    }
  );
}

/**
 * Bounce animation for elements
 */
export function bounce(element: Element, intensity: number = 1) {
  gsap.to(element, {
    y: -20 * intensity,
    duration: 0.3,
    ease: "power1.out",
  });

  gsap.to(element, {
    y: 0,
    duration: 0.4,
    ease: "bounce.out",
    delay: 0.3,
  });
}

/**
 * Flip animation for cards (3D effect)
 */
export function flipCard(element: Element, duration: number = 0.6) {
  gsap.to(element, {
    rotationY: 360,
    duration,
    ease: "back.out",
    transformStyle: "preserve-3d",
  });
}

/**
 * Fade and slide animation
 */
export function fadeAndSlide(
  element: Element,
  direction: "up" | "down" | "left" | "right" = "up",
  distance: number = 30,
  duration: number = 0.5,
  delay: number = 0
) {
  if (ANIMATIONS_DISABLED) return;
  
  const vars: any = { opacity: 1, duration, delay, ease: "power2.out" };

  switch (direction) {
    case "up":
      vars.y = 0;
      break;
    case "down":
      vars.y = 0;
      break;
    case "left":
      vars.x = 0;
      break;
    case "right":
      vars.x = 0;
      break;
  }

  gsap.fromTo(
    element,
    {
      opacity: 0,
      ...(direction === "up" && { y: distance }),
      ...(direction === "down" && { y: -distance }),
      ...(direction === "left" && { x: distance }),
      ...(direction === "right" && { x: -distance }),
    },
    vars
  );
}

/**
 * Subtle button hover animation
 */
export function setupButtonHover(selector: string) {
  if (ANIMATIONS_DISABLED) return;
  
  const buttons = document.querySelectorAll(selector);
  
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    });
    
    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  });
}

/**
 * Stagger animation for list items
 */
export function staggerFadeIn(selector: string, stagger: number = 0.1) {
  if (ANIMATIONS_DISABLED) return gsap.timeline();
  
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger,
      ease: "power2.out",
    }
  );
}
