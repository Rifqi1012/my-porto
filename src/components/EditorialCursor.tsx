import { useEffect, useRef, useState } from 'react';

const INTERACTIVE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"]:not([aria-disabled="true"]), [data-cursor="expand"]';
const TEXT_INPUT_SELECTOR = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea';

export function EditorialCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    document.documentElement.classList.add('custom-cursor-active');

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let initialized = false;
    let rafId = 0;

    const animate = () => {
      current.x += (target.x - current.x) * 0.34;
      current.y += (target.y - current.y) * 0.34;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!initialized) {
        current.x = target.x;
        current.y = target.y;
        initialized = true;
      }

      const el = event.target as HTMLElement | null;
      const inTextInput = Boolean(el?.closest(TEXT_INPUT_SELECTOR));
      const isDisabled = Boolean(el?.closest(':disabled, [aria-disabled="true"]'));
      const inTopLayerDialog = Boolean(el?.closest('dialog[open]'));

      if (inTextInput || isDisabled || inTopLayerDialog) {
        setVisible(false);
        setExpanded(false);
        return;
      }

      setVisible(true);
      setExpanded(Boolean(el?.closest(INTERACTIVE_SELECTOR)));
    };

    const handleDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setPressed(true);
    };

    const handleUp = () => setPressed(false);
    const handleLeave = () => {
      setVisible(false);
      setPressed(false);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    document.addEventListener('pointerleave', handleLeave);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  const baseSize = expanded ? 44 : 12;
  const size = pressed ? Math.round(baseSize * 0.82) : baseSize;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      data-visible={visible ? 'true' : 'false'}
      className="editorial-cursor"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
