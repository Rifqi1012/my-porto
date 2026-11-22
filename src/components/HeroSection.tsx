import { useEffect, useState, type CSSProperties } from 'react';
import { PROFILE } from '../data/portfolio';
import type { ThemeMode } from '../hooks/useTheme';
import { preloadAndPinImage } from '../utils/assetCache';
import { HeroJapaneseAccents } from './HeroJapaneseAccents';

interface HeroSectionProps {
  entered: boolean;
  theme: ThemeMode;
}

const TECH_PLAQUE_META: Record<string, { kanji: string; domain: string }> = {
  'React.js': { kanji: '構', domain: 'UI CORE' },
  'Next.js': { kanji: '速', domain: 'FULLSTACK' },
  TypeScript: { kanji: '律', domain: 'TYPE SAFE' },
  'Tailwind CSS': { kanji: '彩', domain: 'DESIGN UI' },
  Python: { kanji: '析', domain: 'DATA & AI' },
  'C++ / IoT': { kanji: '機', domain: 'EMBEDDED' },
};

const FALLBACK_KANJI = ['壱', '弐', '参', '肆', '伍', '陸', '漆', '捌'] as const;

export function HeroSection({ entered, theme }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);
  const [portraitHovered, setPortraitHovered] = useState(false);
  const [byobuDone, setByobuDone] = useState(false);

  useEffect(() => {
    if (!entered) return;
    const timer = window.setTimeout(() => {
      setByobuDone(true);
    }, 1650);
    return () => window.clearTimeout(timer);
  }, [entered]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        setScrollY(Math.min(window.scrollY, 640));
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const wordmarkChars = Array.from(PROFILE.displayWordmark);
  const wordmarkParallax = Math.round(scrollY * 0.14);
  const portraitParallax = Math.round(scrollY * -0.05);
  const portraitSrc = theme === 'dark' ? PROFILE.heroVisual.darkSrc : PROFILE.heroVisual.src;

  // Keep alternate-theme wireframe portrait pinned in global memory cache so Light <-> Dark transitions swap with zero blink.
  useEffect(() => {
    const altSrc = theme === 'dark' ? PROFILE.heroVisual.src : PROFILE.heroVisual.darkSrc;
    void preloadAndPinImage(altSrc);
  }, [theme]);

  return (
    <section id="top" className="pt-3 pb-8 sm:pt-4 sm:pb-12">
      <div className="page-shell">
        <div className="hero-poster-frame relative overflow-hidden bg-[var(--bg-canvas)]">
          {/* Upper Hero artwork area: bamboo spans cleanly from top border to bottom hairline */}
          <div className="relative px-6 pt-7 pb-0 sm:px-11 sm:pt-9 lg:px-14 lg:pt-10">
            <HeroJapaneseAccents entered={entered} theme={theme} />

            {/* Minimal top editorial line */}
            <div className="relative z-10 flex flex-wrap items-baseline justify-between gap-3">
              <p
                data-entered={entered ? 'true' : 'false'}
                style={{ '--stagger': '120ms' } as CSSProperties}
                className="hero-stagger font-mono-meta m-0 tracking-[0.22em] text-[var(--ink-secondary)]"
              >
                {PROFILE.role}
              </p>

              <p
                data-entered={entered ? 'true' : 'false'}
                style={{ '--stagger': '180ms' } as CSSProperties}
                className="hero-stagger font-editorial m-0 text-xl italic text-[var(--ink-primary)] sm:text-2xl"
              >
                {PROFILE.locationDate}
              </p>
            </div>

            {/* Dominant centerpiece: enlarged wireframe cutout over monumental display serif */}
            <div className="hero-wireframe-stage relative z-10 mt-4 flex flex-col items-center justify-end sm:mt-2 sm:min-h-[27rem] lg:min-h-[34rem]">
              <div
                className="hero-wordmark-parallax pointer-events-none select-none sm:absolute sm:inset-x-0 sm:top-[44%] sm:-translate-y-1/2"
                style={{ '--hero-wordmark-y': `${wordmarkParallax}px` } as CSSProperties}
              >
                <h1
                  data-portrait-hovered={portraitHovered ? 'true' : 'false'}
                  className="hero-wordmark-focus font-editorial m-0 text-center text-[clamp(4.2rem,15.5vw,15rem)] font-medium leading-[0.86] tracking-[0.14em] text-[var(--ink-primary)] uppercase sm:tracking-[0.24em]"
                  aria-label={`${PROFILE.name}, ${PROFILE.role}`}
                >
                  {wordmarkChars.map((char, index) => {
                    const side =
                      index === 0
                        ? 'left'
                        : index === wordmarkChars.length - 1
                          ? 'right'
                          : 'center';
                    return (
                      <span
                        key={`${char}-${index}`}
                        data-side={side}
                        className="split-mask hero-fusuma-char"
                        aria-hidden="true"
                      >
                        <span
                          className="split-char"
                          data-entered={entered ? 'true' : 'false'}
                          style={{ '--stagger': `${index * 65}ms` } as CSSProperties}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      </span>
                    );
                  })}
                </h1>
              </div>

              {/* Static hit-zone wrapper: never scales or rotates, preventing any mouseenter/mouseleave boundary jitter */}
              <div
                data-cursor="expand"
                onMouseEnter={() => setPortraitHovered(true)}
                onMouseLeave={() => setPortraitHovered(false)}
                onPointerDown={() => setPortraitHovered(true)}
                onPointerUp={() => setPortraitHovered(false)}
                className="hero-portrait-parallax relative z-10 -mb-px mt-3 w-[min(100%,24rem)] sm:mt-0 sm:w-[33rem] lg:w-[40rem]"
                style={{ '--hero-portrait-y': `${portraitParallax}px` } as CSSProperties}
              >
                <div
                  data-entered={entered ? 'true' : 'false'}
                  data-hovered={portraitHovered ? 'true' : 'false'}
                  className="hero-portrait-tilt relative"
                >
                  {/* 1. Sacred Japanese Kamon / Asanoha Geometric Sunburst Halo unfurling behind the head on entrance & hover */}
                  <div
                    aria-hidden="true"
                    data-entered={entered ? 'true' : 'false'}
                    data-ready={byobuDone ? 'true' : 'false'}
                    className="hero-kamon-halo"
                  >
                    <svg
                      viewBox="0 0 360 360"
                      fill="none"
                      className="hero-kamon-svg h-full w-full text-[var(--ink-primary)]"
                    >
                      {/* Outer Shrine Compass Ring with 24 radial sun-ray ticks */}
                      <g className="hero-kamon-ring-outer">
                        <circle
                          cx="180"
                          cy="180"
                          r="170"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeDasharray="6 4"
                        />
                        <circle
                          cx="180"
                          cy="180"
                          r="158"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        {Array.from({ length: 24 }).map((_, i) => {
                          const deg = i * 15;
                          return (
                            <line
                              key={deg}
                              x1="180"
                              y1="10"
                              x2="180"
                              y2={i % 3 === 0 ? '26' : '20'}
                              stroke="currentColor"
                              strokeWidth={i % 3 === 0 ? '1.8' : '1'}
                              transform={`rotate(${deg} 180 180)`}
                            />
                          );
                        })}
                        {/* Four cardinal Kumiko diamond nodes */}
                        <rect
                          x="175"
                          y="3"
                          width="10"
                          height="10"
                          fill="var(--bg-canvas)"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          transform="rotate(45 180 8)"
                        />
                        <rect
                          x="347"
                          y="175"
                          width="10"
                          height="10"
                          fill="var(--bg-canvas)"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          transform="rotate(45 352 180)"
                        />
                        <rect
                          x="175"
                          y="347"
                          width="10"
                          height="10"
                          fill="var(--bg-canvas)"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          transform="rotate(45 180 352)"
                        />
                        <rect
                          x="3"
                          y="175"
                          width="10"
                          height="10"
                          fill="var(--bg-canvas)"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          transform="rotate(45 8 180)"
                        />
                      </g>

                      {/* Counter-rotating Yata-no-Kagami 8-Pointed Sacred Mirror Star & Asanoha Lattice */}
                      <g className="hero-kamon-ring-inner">
                        <rect
                          x="68"
                          y="68"
                          width="224"
                          height="224"
                          stroke="currentColor"
                          strokeWidth="1.25"
                        />
                        <rect
                          x="68"
                          y="68"
                          width="224"
                          height="224"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          transform="rotate(45 180 180)"
                        />
                        <circle
                          cx="180"
                          cy="180"
                          r="134"
                          stroke="currentColor"
                          strokeWidth="1"
                          opacity="0.7"
                        />
                        <line
                          x1="22"
                          y1="180"
                          x2="338"
                          y2="180"
                          stroke="currentColor"
                          strokeWidth="0.9"
                          opacity="0.55"
                        />
                        <line
                          x1="180"
                          y1="22"
                          x2="180"
                          y2="338"
                          stroke="currentColor"
                          strokeWidth="0.9"
                          opacity="0.55"
                        />
                        <line
                          x1="68"
                          y1="68"
                          x2="292"
                          y2="292"
                          stroke="currentColor"
                          strokeWidth="0.9"
                          opacity="0.55"
                        />
                        <line
                          x1="292"
                          y1="68"
                          x2="68"
                          y2="292"
                          stroke="currentColor"
                          strokeWidth="0.9"
                          opacity="0.55"
                        />
                      </g>
                    </svg>
                  </div>

                  {/* 2. Left & Right Unfurling Japanese Ofuda / Tanzaku Talisman Banners behind the shoulders */}
                  <div
                    aria-hidden="true"
                    className="hero-ofuda-tag hero-ofuda-left hidden sm:flex"
                  >
                    <span data-kanji="印" className="hero-ofuda-seal" />
                    <span data-kanji="造形・技術" className="hero-ofuda-vertical" />
                    <span className="hero-ofuda-diamond" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="hero-ofuda-tag hero-ofuda-right hidden sm:flex"
                  >
                    <span data-kanji="魂" className="hero-ofuda-seal" />
                    <span data-kanji="風雅・革新" className="hero-ofuda-vertical" />
                    <span className="hero-ofuda-diamond" />
                  </div>

                  {/* 3. Samurai Zanzō / Ukiyo-e Kentō Multi-Plate Woodblock Afterimages (converge on entrance, fan out on hover) */}
                  <img
                    src={portraitSrc}
                    alt=""
                    aria-hidden="true"
                    data-entered={entered ? 'true' : 'false'}
                    data-ready={byobuDone ? 'true' : 'false'}
                    width={977}
                    height={741}
                    decoding="async"
                    draggable={false}
                    className="hero-zanzo-plate hero-zanzo-left"
                  />
                  <img
                    src={portraitSrc}
                    alt=""
                    aria-hidden="true"
                    data-entered={entered ? 'true' : 'false'}
                    data-ready={byobuDone ? 'true' : 'false'}
                    width={977}
                    height={741}
                    decoding="async"
                    draggable={false}
                    className="hero-zanzo-plate hero-zanzo-right"
                  />

                  <div
                    data-entered={entered ? 'true' : 'false'}
                    className="hero-wireframe-unveil relative z-10"
                  >
                    <div
                      data-entered={entered ? 'true' : 'false'}
                      data-hovered={portraitHovered ? 'true' : 'false'}
                      className="hero-portrait-hover relative"
                    >
                      <img
                        src={portraitSrc}
                        alt={PROFILE.heroVisual.alt}
                        width={977}
                        height={741}
                        fetchPriority="high"
                        decoding="async"
                        data-entered={entered ? 'true' : 'false'}
                        className="hero-main-portrait-img block h-auto w-full select-none"
                        draggable={false}
                      />

                      {/* 4. Crisp Vector Japanese Kentō (見当) Registration Frame Locks on hover (zero bitmap mask re-rasterization) */}
                      <div aria-hidden="true" className="hero-kento-locks">
                        <span className="hero-kento-bracket hero-kento-bracket-tl" />
                        <span className="hero-kento-bracket hero-kento-bracket-tr" />
                        <span data-kanji="見当 // 壱" className="hero-kento-collar-seal" />
                      </div>

                      {/* 5-Panel Japanese Byōbu / Tanzaku Folding Screen Accordion Reveal Stage (unmounts after entrance) */}
                      {!byobuDone ? (
                        <div
                          aria-hidden="true"
                          data-entered={entered ? 'true' : 'false'}
                          className="hero-byobu-stage pointer-events-none absolute inset-0"
                        >
                          {[0, 1, 2, 3, 4].map((sliceIndex) => (
                            <div
                              key={sliceIndex}
                              data-slice={sliceIndex}
                              data-entered={entered ? 'true' : 'false'}
                              className="hero-byobu-strip absolute inset-0"
                            >
                              <img
                                src={portraitSrc}
                                alt=""
                                width={977}
                                height={741}
                                decoding="async"
                                draggable={false}
                                className="block h-auto w-full select-none"
                              />
                            </div>
                          ))}

                          {/* Four Vertical Kumiko Joinery Seam Guides with Sliding Diamond Pins */}
                          {[1, 2, 3, 4].map((seamIndex) => (
                            <span
                              key={seamIndex}
                              data-seam={seamIndex}
                              style={{ left: `${seamIndex * 20}%` } as CSSProperties}
                              className="hero-byobu-seam"
                            >
                              <span className="hero-byobu-seam-diamond" />
                            </span>
                          ))}

                          {/* Ceremonial Japanese Hanko Registration Lock Stamp during reveal convergence */}
                          <div className="hero-byobu-hanko-flash">
                            <span data-kanji="見当合" className="hero-byobu-hanko-box" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Dual opposing Japanese Kumiko laser carving bars during initial entrance */}
                  {!byobuDone ? (
                    <>
                      <span
                        aria-hidden="true"
                        data-entered={entered ? 'true' : 'false'}
                        className="hero-scan-line"
                      />
                      <span
                        aria-hidden="true"
                        data-entered={entered ? 'true' : 'false'}
                        className="hero-scan-line-counter"
                      />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Japanese Kifuda-kake (木札掛け) Architectural Tech Stack Arsenal Rack interlocked below the Hero frame */}
        <div
          data-entered={entered ? 'true' : 'false'}
          style={{ '--stagger': '420ms' } as CSSProperties}
          className="hero-stagger tech-kifuda-rack relative pt-3 pb-4 sm:pt-4 sm:pb-5"
          aria-label="Indeks teknologi utama"
        >
          {/* Vertical timber joinery struts connecting the Hero frame bottom to the Tech Stack rack */}
          <span aria-hidden="true" className="tech-rack-strut tech-rack-strut-left" />
          <span aria-hidden="true" className="tech-rack-strut tech-rack-strut-center" />
          <span aria-hidden="true" className="tech-rack-strut tech-rack-strut-right" />

          {/* Top Kamoi suspension header beam */}
          <div className="tech-rack-header">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                data-kanji="技"
                className="tech-guild-seal"
              />
              <p className="font-mono-meta m-0 text-[11px] font-semibold tracking-[0.22em] text-[var(--ink-primary)]">
                [TECH STACK]
              </p>
              <span
                aria-hidden="true"
                className="font-mono-meta hidden text-[10px] tracking-[0.2em] text-[var(--ink-secondary)] sm:inline"
              >
                // 技術目録
              </span>
            </div>

            <div aria-hidden="true" className="tech-rack-beam-line hidden md:flex">
              <span className="tech-rack-diamond" />
              <span className="tech-rack-rule" />
              <span className="tech-rack-chigiri" />
              <span className="tech-rack-rule" />
              <span className="tech-rack-diamond" />
            </div>

            <span
              aria-hidden="true"
              className="font-mono-meta text-[10px] tracking-[0.2em] text-[var(--ink-secondary)]"
            >
              [01 / {String(PROFILE.techStack.length).padStart(2, '0')} ARSENAL]
            </span>
          </div>

          {/* 6 Carved Japanese Ema / Kifuda Tech Plaques suspended from the rack */}
          <ul className="m-0 mt-2.5 grid list-none grid-cols-2 gap-2.5 p-0 sm:mt-3 sm:grid-cols-3 lg:grid-cols-6">
            {PROFILE.techStack.map((item, idx) => {
              const meta = TECH_PLAQUE_META[item] ?? {
                kanji: FALLBACK_KANJI[idx] ?? '技',
                domain: 'CORE STACK',
              };
              const num = String(idx + 1).padStart(2, '0');
              return (
                <li
                  key={item}
                  data-step={idx % 2 === 0 ? 'even' : 'odd'}
                  className="tech-kifuda-card group relative"
                >
                  {/* Top wooden suspension peg & cord ring */}
                  <span aria-hidden="true" className="tech-kifuda-peg" />
                  <span aria-hidden="true" className="tech-kifuda-hole" />

                  {/* Top metadata row: tabular index + architectural domain code */}
                  <div className="flex items-center justify-between gap-1.5 border-b border-[var(--border-subtle)] pb-1.5 transition-colors duration-200 group-hover:border-current/25">
                    <span className="font-mono-meta text-[10px] font-semibold tracking-[0.16em] opacity-75">
                      NO.{num}
                    </span>
                    <span className="font-mono-meta truncate text-[8.5px] tracking-[0.14em] opacity-65">
                      {meta.domain}
                    </span>
                  </div>

                  {/* Main body: carved Kanji seal stamp + technology title */}
                  <div className="mt-2 flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      data-kanji={meta.kanji}
                      className="tech-kifuda-kanji shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="tech-kifuda-title block truncate text-[0.9rem] font-semibold tracking-[0.01em]">
                        {item}
                      </span>
                      <span
                        aria-hidden="true"
                        className="tech-kifuda-gauge mt-1.5 block"
                      />
                    </div>
                  </div>

                  {/* Bottom corner Kumiko registration tick */}
                  <span aria-hidden="true" className="tech-kifuda-corner" />
                </li>
              );
            })}
          </ul>

          {/* Bottom architectural Kumiko closing rail */}
          <div aria-hidden="true" className="tech-rack-footer mt-3.5 sm:mt-4">
            <span className="tech-rack-finial tech-rack-finial-left" />
            <span className="tech-rack-diamond" />
            <span className="tech-rack-rule" />
            <span className="tech-rack-chigiri" />
            <span className="tech-rack-rule" />
            <span className="tech-rack-diamond" />
            <span className="tech-rack-finial tech-rack-finial-right" />
          </div>
        </div>
      </div>
    </section>
  );
}
