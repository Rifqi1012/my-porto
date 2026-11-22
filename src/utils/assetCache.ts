/// <reference types="vite/client" />
import { PROFILE, PROJECTS } from '../data/portfolio';

export const ASSET_CACHE_NAME = 'rifqi-porto-assets-v1';
const SESSION_WARM_KEY = 'rifqi-porto-cache-warm-v1';

// Strong in-memory reference map prevents the browser Garbage Collector from evicting decoded bitmaps while scrolling
const MEMORY_IMAGE_REGISTRY = new Map<string, HTMLImageElement>();

export function buildAssetManifest(): string[] {
  const urls = [
    '/assets/favicon.svg',
    PROFILE.heroVisual.src,
    PROFILE.heroVisual.darkSrc,
    '/assets/hero-bamboo-light.png',
    '/assets/hero-bamboo-dark.png',
    PROFILE.profileVisual.src,
    PROFILE.profileVisual.darkSrc,
    ...PROJECTS.map((project) => project.image.src),
  ];
  return Array.from(
    new Set(urls.filter((u): u is string => Boolean(u && u.trim())))
  );
}

export function isAssetCacheWarm(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_WARM_KEY) === '1';
  } catch {
    return false;
  }
}

export function markAssetCacheWarm(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_WARM_KEY, '1');
  } catch {
    // ignore storage quota errors
  }
}

async function persistToCacheStorage(src: string): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const cache = await window.caches.open(ASSET_CACHE_NAME);
    const existing = await cache.match(src);
    if (!existing) {
      const response = await fetch(src, { cache: 'force-cache' });
      if (response.ok) {
        await cache.put(src, response);
      }
    }
  } catch {
    // Fallback gracefully to standard browser HTTP cache
  }
}

export function preloadAndPinImage(src: string): Promise<void> {
  const existing = MEMORY_IMAGE_REGISTRY.get(src);
  if (existing && existing.complete && existing.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const onReady = () => {
      MEMORY_IMAGE_REGISTRY.set(src, img);
      if (typeof img.decode === 'function') {
        img.decode().then(finish).catch(finish);
      } else {
        finish();
      }
    };

    img.onload = onReady;
    img.onerror = finish;
    img.src = src;

    if (img.complete) {
      onReady();
    }

    // Store in persistent Cache Storage API in the background
    void persistToCacheStorage(src);
  });
}

export function registerAssetServiceWorker(): void {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !import.meta.env.PROD
  ) {
    return;
  }

  window.addEventListener(
    'load',
    () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration is progressive enhancement
      });
    },
    { once: true }
  );
}
