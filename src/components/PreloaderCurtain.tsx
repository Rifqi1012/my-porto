import { useEffect, useState } from 'react';
import { PROFILE } from '../data/portfolio';
import {
  buildAssetManifest,
  isAssetCacheWarm,
  markAssetCacheWarm,
  preloadAndPinImage,
} from '../utils/assetCache';

interface PreloaderCurtainProps {
  onRevealStart: () => void;
}

type GatePhase = 'loading' | 'gate-in' | 'gate-open' | 'done';

function ShojiDoorLattice({ side, phase }: { side: 'left' | 'right'; phase: GatePhase }) {
  const isLeft = side === 'left';

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[var(--bg-canvas)] text-[var(--ink-primary)] ${
        isLeft
          ? 'border-r-2 border-[var(--ink-primary)]'
          : 'border-l-2 border-[var(--ink-primary)]'
      }`}
    >
      {/* Secondary trailing Kumiko parallax screen strip along outer edge */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 bottom-0 w-10 border-[var(--border-control)] bg-[var(--bg-recessed)] opacity-55 sm:w-16 ${
          isLeft ? 'left-0 border-r' : 'right-0 border-l'
        }`}
      />

      {/* Architectural Japanese Sanmon / Kumiko & Maru-mado lattice matched to active Light/Dark theme */}
      <svg
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {/* Outer double Beri-waku timber frame */}
        <rect
          x="16"
          y="16"
          width="568"
          height="868"
          stroke="currentColor"
          strokeOpacity="0.48"
          strokeWidth="2"
        />
        <rect
          x="26"
          y="26"
          width="548"
          height="848"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1"
        />

        {/* Four corner Kazari-Kanagu stepped fretwork brackets */}
        <path
          d="M16 72H52V16M26 56H42V26M584 72H548V16M574 56H558V26M16 828H52V884M26 844H42V874M584 828H548V884M574 844H558V874"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1.6"
        />

        {/* Upper Ranma transom beam & Asanoha diamond fretwork */}
        <line
          x1="16"
          y1="108"
          x2="584"
          y2="108"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="2"
        />
        <line
          x1="16"
          y1="122"
          x2="584"
          y2="122"
          stroke="currentColor"
          strokeOpacity="0.24"
          strokeWidth="1"
        />
        <path
          d="M26 108L95 62L164 108L233 62L302 108L371 62L440 108L509 62L574 108M26 26L95 62L164 26L233 62L302 26L371 62L440 26L509 62L574 26"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.1"
        />
        <line
          x1="26"
          y1="62"
          x2="574"
          y2="62"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1"
        />

        {/* Vertical Kumiko mullions */}
        <line x1="158" y1="122" x2="158" y2="696" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />
        <line x1="300" y1="122" x2="300" y2="696" stroke="currentColor" strokeOpacity="0.24" strokeWidth="1.4" />
        <line x1="442" y1="122" x2="442" y2="696" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />

        {/* Horizontal Shoji paper pane transoms */}
        <line x1="16" y1="236" x2="584" y2="236" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.1" />
        <line x1="16" y1="350" x2="584" y2="350" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.2" />
        <line x1="16" y1="450" x2="584" y2="450" stroke="currentColor" strokeOpacity="0.26" strokeWidth="1.4" />
        <line x1="16" y1="564" x2="584" y2="564" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.2" />

        {/* Geometric Kumiko diamond lattice in upper & lower Shoji bays */}
        <path
          d="M158 122L229 179L158 236M300 122L229 179L300 236M300 122L371 179L300 236M442 122L371 179L442 236"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.1"
        />
        <path
          d="M158 564L229 630L158 696M300 564L229 630L300 696M300 564L371 630L300 696M442 564L371 630L442 696"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.1"
        />

        {/* Lower Koshi-ita (solid carved cedar kick-panel with diagonal Kumiko ribs) */}
        <line
          x1="16"
          y1="696"
          x2="584"
          y2="696"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        <line
          x1="16"
          y1="708"
          x2="584"
          y2="708"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        <rect
          x="16"
          y="696"
          width="568"
          height="188"
          fill="currentColor"
          fillOpacity="0.06"
        />
        <path
          d="M158 708V874M300 708V874M442 708V874M26 790H574"
          stroke="currentColor"
          strokeOpacity="0.24"
          strokeWidth="1.2"
        />
        <path
          d="M87 749L112 790L87 831L62 790L87 749ZM229 749L254 790L229 831L204 790L229 749ZM371 749L396 790L371 831L346 790L371 749ZM513 749L538 790L513 831L488 790L513 749Z"
          stroke="currentColor"
          strokeOpacity="0.26"
          strokeWidth="1.1"
        />
      </svg>

      {/* Half-circle Maru-mado (Zen Moon Window) along the inner edge of each door:
          When closed, left & right halves form a complete sacred circular window in the center */}
      <div
        aria-hidden="true"
        className={`shoji-marumado-half pointer-events-none absolute top-1/2 -translate-y-1/2 ${
          isLeft ? 'right-0' : 'left-0'
        }`}
      >
        <svg
          viewBox="0 0 180 360"
          fill="none"
          className={`h-[17rem] w-[8.5rem] text-[var(--ink-primary)] sm:h-[22rem] sm:w-[11rem] ${
            isLeft ? '' : 'scale-x-[-1]'
          }`}
        >
          <path
            d="M180 8A172 172 0 0 0 180 352"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.55"
          />
          <path
            d="M180 24A156 156 0 0 0 180 336"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="6 4"
            strokeOpacity="0.4"
          />
          <path
            d="M180 54A126 126 0 0 0 180 306"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.35"
          />
          <line x1="8" y1="180" x2="180" y2="180" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" />
          <line x1="56" y1="56" x2="180" y2="180" stroke="currentColor" strokeWidth="1" strokeOpacity="0.28" />
          <line x1="56" y1="304" x2="180" y2="180" stroke="currentColor" strokeWidth="1" strokeOpacity="0.28" />
        </svg>
      </div>

      {/* Vertical Japanese Tategaki Woodblock Pillar Plaque on each door */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2.5 border-[1.5px] border-[var(--ink-primary)] bg-[var(--bg-canvas)] px-2 py-3.5 shadow-sm md:flex ${
          isLeft ? 'left-14 lg:left-24' : 'right-14 lg:right-24'
        }`}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center bg-[var(--ink-primary)] text-[10px] font-bold text-[var(--bg-canvas)]">
          {isLeft ? '壱' : '弐'}
        </span>
        <span
          className="text-[11px] font-bold tracking-[0.28em] text-[var(--ink-primary)]"
          style={{ writingMode: 'vertical-rl' }}
        >
          {isLeft ? '造形・構造' : '風雅・革新'}
        </span>
        <span className="h-1.5 w-1.5 rotate-45 border border-[var(--ink-primary)]" />
      </div>

      {/* Split Karakuri Hikite Lock Plate & Sliding Kannuki Crossbar Bolt along the center seam */}
      <div
        aria-hidden="true"
        data-phase={phase}
        className={`shoji-karakuri-half pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center ${
          isLeft ? 'right-0 flex-row' : 'left-0 flex-row-reverse'
        }`}
      >
        {/* Retracting Kannuki horizontal wooden lock bar */}
        <div className="shoji-kannuki-bar hidden h-3 w-12 border-y-[1.5px] border-[var(--ink-primary)] bg-[var(--bg-recessed)] sm:block sm:w-20" />

        {/* Carved Octagonal Hikite Handle & Split Seal Half */}
        <div
          className={`flex h-16 w-10 flex-col items-center justify-center border-y-[1.5px] border-[var(--ink-primary)] bg-[var(--bg-canvas)] sm:h-20 sm:w-12 ${
            isLeft ? 'border-l-[1.5px]' : 'border-r-[1.5px]'
          }`}
        >
          <span className="font-mono-meta text-[8px] tracking-[0.16em] text-[var(--ink-secondary)]">
            {isLeft ? '01' : '02'}
          </span>
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border border-[var(--ink-primary)] bg-[var(--ink-primary)] text-xs font-bold text-[var(--bg-canvas)] sm:h-8 sm:w-8 sm:text-sm">
            {isLeft ? '開' : '門'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PreloaderCurtain({ onRevealStart }: PreloaderCurtainProps) {
  const [progress, setProgress] = useState(0);
  const [loadedStats, setLoadedStats] = useState<{
    loaded: number;
    total: number;
    currentLabel: string;
  }>(() => {
    const manifest = buildAssetManifest();
    return {
      loaded: 0,
      total: manifest.length + 2,
      currentLabel: 'MEMUAT ASET...',
    };
  });
  const [phase, setPhase] = useState<GatePhase>(() => {
    if (typeof window === 'undefined') return 'done';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'done' : 'loading';
  });

  useEffect(() => {
    if (phase === 'done') {
      onRevealStart();
      return;
    }
    if (phase !== 'loading') return;

    let cancelled = false;
    const imageUrls = buildAssetManifest();
    // Total tasks = all image assets + web fonts ready + document window load
    const totalTasks = Math.max(1, imageUrls.length + 2);
    let completedTasks = 0;
    let allAssetsReady = false;

    const markTaskDone = (label: string) => {
      if (cancelled) return;
      completedTasks = Math.min(totalTasks, completedTasks + 1);
      setLoadedStats({
        loaded: completedTasks,
        total: totalTasks,
        currentLabel: label,
      });
    };

    // 1. Preload, decode, and pin every image asset in memory + persistent Cache Storage
    const imagePromises = imageUrls.map((src) => {
      const filename = src.split('/').pop() || src;
      return preloadAndPinImage(src).then(() => {
        markTaskDone(filename.toUpperCase());
      });
    });

    // 2. Wait for Web Fonts (Cormorant Garamond, Plus Jakarta Sans, IBM Plex Mono)
    const fontsPromise = (
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve()
    ).then(() => {
      markTaskDone('TIPOGRAFI & FONT');
    });

    // 3. Wait for document / window load state
    const windowLoadPromise = new Promise<void>((resolve) => {
      if (typeof document === 'undefined' || document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve(), { once: true });
      }
    }).then(() => {
      markTaskDone('DOKUMEN UTAMA');
    });

    // Wait for all real assets to download & decode (with an 8s safety timeout so a stalled third-party request never hangs forever)
    const safetyTimeout = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 8000);
    });

    Promise.race([
      Promise.all([...imagePromises, fontsPromise, windowLoadPromise]).then(
        () => undefined
      ),
      safetyTimeout,
    ]).then(() => {
      if (cancelled) return;
      completedTasks = totalTasks;
      allAssetsReady = true;
      markAssetCacheWarm();
      setLoadedStats({
        loaded: totalTasks,
        total: totalTasks,
        currentLabel: 'SIAP // 準備完了',
      });
    });

    // Smooth visual progress loop synchronized with real asset loading:
    // Faster ceremonial glide on warm cache hits, while never reaching 100% until allAssetsReady === true.
    const startTime = performance.now();
    const minCeremonialMs = isAssetCacheWarm() ? 380 : 680;
    let displayPct = 0;
    let rafId = 0;

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const timeCap = Math.min(1, elapsed / minCeremonialMs);
      const realRatio = completedTasks / totalTasks;

      // While assets are still downloading/decoding, cap visual progress at 96%
      const allowedTarget = allAssetsReady
        ? timeCap * 100
        : Math.min(96, realRatio * timeCap * 100);

      displayPct += (allowedTarget - displayPct) * 0.24;
      if (allAssetsReady && timeCap >= 1 && allowedTarget - displayPct < 0.8) {
        displayPct = 100;
      }

      const rounded = Math.min(100, Math.round(displayPct));
      setProgress(rounded);

      if (allAssetsReady && rounded >= 100) {
        setPhase('gate-in');
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [phase, onRevealStart]);

  useEffect(() => {
    if (phase === 'gate-in') {
      const timer = window.setTimeout(() => {
        setPhase('gate-open');
        onRevealStart();
      }, 480);
      return () => window.clearTimeout(timer);
    }

    if (phase === 'gate-open') {
      const timer = window.setTimeout(() => setPhase('done'), 1180);
      return () => window.clearTimeout(timer);
    }
  }, [phase, onRevealStart]);

  if (phase === 'done') return null;

  const skip = () => {
    onRevealStart();
    setPhase('done');
  };

  return (
    <div
      aria-label="Memuat portofolio"
      data-phase={phase}
      className={`fixed inset-0 z-50 overflow-hidden ${
        phase === 'gate-open' ? 'pointer-events-none' : ''
      }`}
    >
      {/* Solid theme-matched backdrop during loading and initial gate lock-in */}
      {phase !== 'gate-open' ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[var(--bg-canvas)]"
        />
      ) : null}

      {/* 4-Panel Japanese Sanmon & Kumiko Gate Stage */}
      <div className="shoji-gate-stage absolute inset-0" data-phase={phase}>
        {/* Top Torii / Ranma Architectural Lintel Track that slides upward as the gate opens */}
        <div
          aria-hidden="true"
          data-phase={phase}
          className="shoji-top-ranma pointer-events-none absolute top-0 right-0 left-0 z-20 flex h-9 items-center justify-between border-b-2 border-[var(--ink-primary)] bg-[var(--bg-canvas)] px-4 sm:h-11 sm:px-8"
        >
          <span className="font-mono-meta text-[9px] tracking-[0.24em] text-[var(--ink-secondary)]">
            [SANMON // 参門]
          </span>
          <div className="inline-flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--ink-primary)]" />
            <span className="font-mono-meta text-[10px] font-semibold tracking-[0.28em] text-[var(--ink-primary)]">
              開門 // KAIMON
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--ink-primary)]" />
          </div>
          <span className="font-mono-meta text-[9px] tracking-[0.24em] text-[var(--ink-secondary)]">
            [弐千弐拾陸]
          </span>
        </div>

        {/* Bottom Shikii Wooden Threshold Track that slides downward as the gate opens */}
        <div
          aria-hidden="true"
          data-phase={phase}
          className="shoji-bottom-shikii pointer-events-none absolute right-0 bottom-0 left-0 z-20 flex h-7 items-center justify-center gap-4 border-t-2 border-[var(--ink-primary)] bg-[var(--bg-canvas)] sm:h-8"
        >
          <span className="h-px w-16 bg-[var(--border-control)] sm:w-28" />
          <span className="font-mono-meta text-[9px] tracking-[0.26em] text-[var(--ink-secondary)]">
            BANDUNG // INDONESIA
          </span>
          <span className="h-px w-16 bg-[var(--border-control)] sm:w-28" />
        </div>

        {/* Secondary outer parallax wing panels behind the main Shoji doors */}
        <div
          aria-hidden="true"
          data-phase={phase}
          className="shoji-wing shoji-wing-left pointer-events-none absolute inset-y-0 left-0 w-1/2 border-r-2 border-[var(--ink-primary)] bg-[var(--bg-recessed)]"
        />
        <div
          aria-hidden="true"
          data-phase={phase}
          className="shoji-wing shoji-wing-right pointer-events-none absolute inset-y-0 right-0 w-1/2 border-l-2 border-[var(--ink-primary)] bg-[var(--bg-recessed)]"
        />

        {/* Main Left & Right Shoji / Kumiko Sliding Gate Doors */}
        <div className=" absolute inset-0 flex">
          <div className="shoji-door shoji-door-left h-full w-1/2" data-phase={phase}>
            <ShojiDoorLattice side="left" phase={phase} />
          </div>
          <div className="shoji-door shoji-door-right h-full w-1/2" data-phase={phase}>
            <ShojiDoorLattice side="right" phase={phase} />
          </div>
        </div>

        {/* Center Karakuri Rotating Medallion Seal that unlocks during gate-in before parting */}
        <div
          aria-hidden="true"
          data-phase={phase}
          className="shoji-center-medallion pointer-events-none absolute top-1/2 left-1/2 z-30 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-28 sm:w-28"
        >
          <div className="shoji-medallion-ring absolute inset-0 border-[1.5px] border-dashed border-[var(--ink-primary)]" />
          <div className="shoji-medallion-core flex h-14 w-14 items-center justify-center border-2 border-[var(--ink-primary)] bg-[var(--bg-canvas)] shadow-md sm:h-16 sm:w-16">
            <span className="font-editorial text-xl font-bold text-[var(--ink-primary)] sm:text-2xl">
              {PROFILE.preloaderTitle.charAt(0) || 'リ'}
            </span>
          </div>
        </div>
      </div>

      {/* Delicate center seam light flash marking the parting doors */}
      <span
        aria-hidden="true"
        data-phase={phase}
        className="shoji-seam-light pointer-events-none absolute top-0 bottom-0 left-1/2 z-30 w-0.5 -translate-x-1/2 bg-[var(--ink-primary)]"
      />

      {/* Centered Japanese Woodblock Loading HUD matched to the active Light/Dark theme */}
      <div
        data-phase={phase}
        className="shoji-loader-hud relative z-40 flex h-full flex-col items-center justify-center px-6 text-[var(--ink-primary)]"
      >
        <div className="shoji-hud-card relative w-full max-w-md border-[1.5px] border-[var(--ink-primary)] bg-[var(--bg-canvas)] px-7 py-8 sm:px-9 sm:py-10">
          {/* Corner Kumiko registration ticks */}
          <span className="pointer-events-none absolute top-2 left-2 h-2.5 w-2.5 border-t border-l border-[var(--ink-primary)]" />
          <span className="pointer-events-none absolute top-2 right-2 h-2.5 w-2.5 border-t border-r border-[var(--ink-primary)]" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l border-[var(--ink-primary)]" />
          <span className="pointer-events-none absolute right-2 bottom-2 h-2.5 w-2.5 border-r border-b border-[var(--ink-primary)]" />

          <div className="mb-4 flex items-center justify-between border-b border-[var(--border-hairline)] pb-2">
            <span className="font-mono-meta text-[9px] tracking-[0.24em] text-[var(--ink-secondary)]">
              [JUNBI // 準備中]
            </span>
            <span className="font-mono-meta text-[9px] tracking-[0.2em] text-[var(--ink-secondary)]">
              ASET {String(loadedStats.loaded).padStart(2, '0')} /{' '}
              {String(loadedStats.total).padStart(2, '0')}
            </span>
          </div>

          <p className="font-editorial m-0 text-center text-4xl font-medium tracking-[0.28em] text-[var(--ink-primary)] sm:text-5xl">
            {PROFILE.preloaderTitle}
          </p>

          <div className="relative mt-7 h-1.5 w-full border border-[var(--ink-primary)] bg-[var(--bg-recessed)]">
            <div
              className="h-full bg-[var(--ink-primary)] transition-[width] duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="font-mono-meta mt-3 flex items-center justify-between text-[11px] uppercase text-[var(--ink-secondary)]">
            <span className="truncate pr-3">{loadedStats.currentLabel}</span>
            <span className="font-semibold text-[var(--ink-primary)]">
              {String(progress).padStart(3, '0')}%
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={skip}
          className="shoji-skip-btn font-mono-meta mt-6 inline-flex min-h-[44px] items-center gap-2 border-[1.5px] border-[var(--ink-primary)] bg-[var(--bg-canvas)] px-5 text-xs uppercase tracking-[0.16em] text-[var(--ink-primary)] transition-colors hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)]"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-4 w-4 items-center justify-center border border-current text-[9px] font-bold"
          >
            略
          </span>
          <span>Lewati</span>
        </button>
      </div>
    </div>
  );
}
