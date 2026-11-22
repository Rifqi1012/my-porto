import { useEffect, useState, type RefObject } from 'react';

/**
 * Tracks normalized 0..1 progress as an element travels through the viewport.
 * Returns 1 immediately when reduced motion is preferred so content stays fully revealed.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when section top enters 85% viewport height; 1 when top passes 22% viewport height.
      const start = vh * 0.85;
      const end = vh * 0.22;
      const raw = (start - rect.top) / Math.max(1, start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref]);

  return progress;
}
