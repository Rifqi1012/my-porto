import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';

function readInitialTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  const current = document.documentElement.dataset.theme;
  if (current === 'dark' || current === 'light') return current;
  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures in restricted browsing contexts.
    }
  }, [theme]);

  const toggleTheme = useCallback((originEl?: HTMLElement | null) => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const applyTheme = () => {
      root.dataset.theme = nextTheme;
      setTheme(nextTheme);
    };

    if (reduced || typeof document === 'undefined') {
      applyTheme();
      return;
    }

    if (typeof document.startViewTransition === 'function') {
      const rect = originEl?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : 36;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          applyTheme();
        });
      });

      transition.ready
        .then(() => {
          root.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${Math.ceil(endRadius)}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 560,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // Theme has already been committed; ignore interrupted transition errors.
        });
      return;
    }

    // Fallback smooth color crossfade for browsers without View Transitions API.
    root.classList.add('theme-transitioning');
    applyTheme();
    window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 380);
  }, [theme]);

  return { theme, toggleTheme };
}
