import { useCallback, type PointerEvent } from 'react';

export function useGlassSpecular() {
  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty('--glass-x', `${x}px`);
    event.currentTarget.style.setProperty('--glass-y', `${y}px`);
    event.currentTarget.style.setProperty('--glass-sheen-opacity', '1');
  }, []);

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--glass-sheen-opacity', '0');
  }, []);

  return {
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
  };
}
