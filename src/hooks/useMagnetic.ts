import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom hook to apply a magnetic attraction effect to an element.
 * @param strength - The force of the magnetic pull (0.1 to 0.5 is ideal)
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // quickTo creates highly optimized tweens that dynamically update properties
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      // Check distance of cursor from the center of the element
      const distance = Math.hypot(deltaX, deltaY);
      const maxDistance = Math.max(width, height) * 1.6;

      if (distance < maxDistance) {
        // Pull towards mouse coordinates within the strength factor
        xTo(deltaX * strength);
        yTo(deltaY * strength);
      } else {
        // Reset to original position when cursor moves beyond threshold
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
