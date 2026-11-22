import { useEffect, type CSSProperties } from 'react';
import type { ThemeMode } from '../hooks/useTheme';

interface HeroJapaneseAccentsProps {
  entered: boolean;
  theme: ThemeMode;
}

/**
 * Precision Japanese Kumiko & Kazari-Kanagu corner fretwork bracket.
 * Uses currentColor so it automatically adapts between Light sumi-ink and Dark alabaster ink.
 */
function KumikoCornerBracket({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      className={`hero-kumiko-corner pointer-events-none absolute z-20 h-9 w-9 text-[var(--ink-primary)] sm:h-13 sm:w-13 ${className}`}
    >
      {/* Outer stepped L-bracket molding */}
      <path
        d="M1 55V1H55"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Inner double-line Raimon / Sayagata fretwork */}
      <path
        d="M7 55V7H55M7 21H21V7M13 13H17V17H13V13Z"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      {/* Corner rotated Kumiko diamond lattice node */}
      <path
        d="M27 7L32 12L27 17L22 12L27 7Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.72"
      />
      <path
        d="M7 27L12 32L17 27L12 22L7 27Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.72"
      />
      {/* Stepped extension ticks along top and left rails */}
      <path
        d="M40 1V7M46 1V5M1 40H7M1 46H5"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.75"
      />
      {/* Solid corner anchor pin */}
      <rect x="3" y="3" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

export function HeroJapaneseAccents({ entered, theme }: HeroJapaneseAccentsProps) {
  const suffix = theme === 'dark' ? 'dark' : 'light';
  const altSuffix = theme === 'dark' ? 'light' : 'dark';
  const state = entered ? 'true' : 'false';

  useEffect(() => {
    const preload = new Image();
    preload.src = `/assets/hero-bamboo-${altSuffix}.png`;
  }, [altSuffix]);

  return (
    <div
      aria-hidden="true"
      data-entered={state}
      className="hero-japanese-frame pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Full-height low-poly bamboo anchored flush to top-right and bottom-right frame edges */}
      <img
        src={`/assets/hero-bamboo-${suffix}.png`}
        alt=""
        width={1032}
        height={768}
        decoding="async"
        draggable={false}
        data-entered={state}
        style={{ '--stagger': '320ms' } as CSSProperties}
        className="botanical-rise absolute top-0 right-0 h-full w-auto max-w-none opacity-[0.14] sm:opacity-[var(--ukiyo-opacity)]"
      />

      {/* Inner Ukiyo-e Beri-waku (double mat line) around top, left, right, and stepped bottom shoulders */}
      <div className="hero-beriwaku-top" />
      <div className="hero-beriwaku-left" />
      <div className="hero-beriwaku-right" />
      <div className="hero-beriwaku-bottom-left hidden sm:block" />
      <div className="hero-beriwaku-bottom-right hidden sm:block" />

      {/* Four Japanese Kumiko & Kazari-Kanagu corner lattice brackets */}
      <KumikoCornerBracket className="top-0 left-0" />
      <KumikoCornerBracket className="top-0 right-0 rotate-90" />
      <KumikoCornerBracket className="right-0 bottom-0 rotate-180" />
      <KumikoCornerBracket className="bottom-0 left-0 -rotate-90" />

      {/* Top-center Ranma / Chigiri dovetail architectural keystone */}
      <div className="hero-ranma-keystone">
        <span className="hero-chigiri-joint" />
        <span className="hero-ranma-bars" />
        <span className="hero-ranma-label font-mono-meta">巻頭 // 壱</span>
        <span className="hero-ranma-bars" />
        <span className="hero-chigiri-joint" />
      </div>

      {/* Left vertical border Ukiyo-e Hashira publisher margin seal */}
      <div className="hero-hashira-seal hero-hashira-left hidden sm:flex">
        <span className="hero-hashira-diamond" />
        <span data-kanji="版" className="hero-hashira-stamp" />
        <span data-kanji="浮世絵・弐千弐拾陸" className="hero-hashira-vertical" />
        <span className="hero-hashira-diamond" />
      </div>

      {/* Right vertical border Kumiko architectural gauge seal */}
      <div className="hero-hashira-seal hero-hashira-right hidden sm:flex">
        <span className="hero-hashira-diamond" />
        <span data-kanji="図" className="hero-hashira-stamp" />
        <span data-kanji="組子枠・零壱号" className="hero-hashira-vertical" />
        <span className="hero-hashira-diamond" />
      </div>

      {/* Bottom-left Hori-Suri (Carved & Printed) Ukiyo-e craftsman seal bar */}
      <div className="hero-horisuri-bar hidden md:inline-flex">
        <span data-kanji="彫" className="hero-horisuri-stamp" />
        <span data-kanji="摺" className="hero-horisuri-stamp" />
        <span className="font-mono-meta text-[9px] tracking-[0.22em] text-[var(--ink-secondary)]">
          NO. 001 // BANDUNG
        </span>
      </div>
    </div>
  );
}
