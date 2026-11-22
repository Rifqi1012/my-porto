import { useRef, type PointerEvent } from 'react';
import { QUOTE } from '../data/portfolio';
import { useScrollProgress } from '../hooks/useScrollProgress';

export function QuoteBand() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollProgress(sectionRef);
  const fullText = `${QUOTE.highlightText} ${QUOTE.mutedText}`;
  const words = fullText.split(' ');

  // Normalize scroll progress (0 -> 1) across the active viewing window so the Enso brush draws smoothly
  const drawProgress = Math.max(0, Math.min(1, progress / 0.88));
  const ensoCircumference = 780;
  const ensoDashOffset = Math.round(ensoCircumference * (1 - drawProgress));
  const shojiOffsetPx = Math.round((1 - drawProgress) * 36);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
    el.style.setProperty('--qx', `${x.toFixed(1)}%`);
    el.style.setProperty('--qy', `${y.toFixed(1)}%`);
  };

  return (
    <section
      id="prinsip"
      ref={sectionRef}
      className="quote-yugen-section relative overflow-hidden border-y border-[var(--band-dark-border)] bg-[var(--band-dark-bg)] py-20 text-[var(--band-dark-ink)] sm:py-28 lg:py-32"
    >
      <div className="page-shell">
        {/* Minimalist Nocturnal Japanese Chapter Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--band-dark-border)] pb-3.5">
          <div className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              data-kanji="参"
              className="quote-dark-chapter-seal"
            />
            <p className="font-mono-meta m-0 text-xs font-semibold tracking-[0.22em] text-[var(--band-dark-ink)] uppercase">
              03 PRINSIP
            </p>
            <span
              aria-hidden="true"
              className="font-mono-meta hidden text-[10px] tracking-[0.2em] text-[var(--band-dark-muted)] sm:inline"
            >
              // 哲学・美学
            </span>
          </div>

          <div
            aria-hidden="true"
            className="font-mono-meta flex items-center gap-2.5 text-[10px] tracking-[0.22em] text-[var(--band-dark-muted)]"
          >
            <span className="hidden sm:inline">[YŪGEN // 幽玄・座右の銘]</span>
            <span className="text-[var(--band-dark-ink)]">
              {String(Math.round(drawProgress * 100)).padStart(3, '0')}%
            </span>
          </div>
        </div>

        {/* Interactive Minimalist Japanese Yūgen & Maru-mado Zen Stage */}
        <div
          ref={stageRef}
          data-cursor="expand"
          onPointerMove={handlePointerMove}
          className="quote-yugen-stage group relative mx-auto mt-10 max-w-5xl overflow-hidden px-5 py-12 sm:mt-12 sm:px-14 sm:py-16 lg:py-20"
        >
          {/* Andon (行灯) Paper-Lantern Pointer Glow Layer */}
          <div aria-hidden="true" className="quote-andon-spotlight" />

          {/* Four Mechanical Kazari Corner Ticks (expand & lock on hover) */}
          <span aria-hidden="true" className="quote-corner-tick quote-corner-tl" />
          <span aria-hidden="true" className="quote-corner-tick quote-corner-tr" />
          <span aria-hidden="true" className="quote-corner-tick quote-corner-bl" />
          <span aria-hidden="true" className="quote-corner-tick quote-corner-br" />

          {/* Scroll-Parting Left & Right Minimalist Shoji Lattice Frame Wings */}
          <div
            aria-hidden="true"
            className="quote-shoji-wing quote-shoji-wing-left hidden sm:block"
            style={{
              transform: `translate3d(-${36 - shojiOffsetPx}px, 0, 0)`,
            }}
          />
          <div
            aria-hidden="true"
            className="quote-shoji-wing quote-shoji-wing-right hidden sm:block"
            style={{
              transform: `translate3d(${36 - shojiOffsetPx}px, 0, 0)`,
            }}
          />

          {/* Center Scroll-Drawn Zen Enso (円相) Brush Circle & Karesansui Ripple Astrolabe */}
          <div
            aria-hidden="true"
            className="quote-enso-stage pointer-events-none"
          >
            <svg
              viewBox="0 0 340 340"
              fill="none"
              className="quote-enso-svg h-full w-full"
            >
              {/* Outer Karesansui (枯山水) Zen Raked-Sand Concentric Ripples (expand on hover) */}
              <circle
                cx="170"
                cy="170"
                r="158"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeDasharray="2 8"
                className="quote-karesansui-ring quote-karesansui-outer"
              />
              <circle
                cx="170"
                cy="170"
                r="142"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeDasharray="4 6"
                style={{
                  transform: `rotate(${Math.round(drawProgress * 48 - 24)}deg)`,
                  transformOrigin: '170px 170px',
                }}
              />

              {/* Self-Drawing Sumi-Brush Enso Circle driven by scroll + energized on hover */}
              <path
                d="M292 124C313 186 283 258 221 284C157 310 83 280 55 216C27 152 57 78 121 50C179 25 245 47 279 97"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeDasharray={ensoCircumference}
                strokeDashoffset={ensoDashOffset}
                className="quote-enso-brush"
              />

              {/* Inner Maru-mado Compass Crosshairs & Geometric Diamond */}
              <circle
                cx="170"
                cy="170"
                r="104"
                stroke="currentColor"
                strokeWidth="0.8"
                className="quote-karesansui-ring quote-karesansui-inner"
              />
              <rect
                x="96"
                y="96"
                width="148"
                height="148"
                stroke="currentColor"
                strokeWidth="0.75"
                transform="rotate(45 170 170)"
                className="quote-kamon-diamond"
              />
              <path
                d="M170 14V38M170 302V326M14 170H38M302 170H326"
                stroke="currentColor"
                strokeWidth="1.1"
                opacity="0.55"
              />
            </svg>

            {/* Hidden Zen Kanji '道' (Dō - The Way / Principle) that materializes inside the Enso on hover */}
            <span
              data-kanji="道"
              className="quote-center-kanji"
            />
          </div>

          {/* Left & Right Minimalist Vertical Tategaki Calligraphic Pillars (slide & illuminate on hover) */}
          <div
            aria-hidden="true"
            className="quote-tategaki-pillar quote-tategaki-left hidden md:flex"
          >
            <span className="quote-diamond-pin" />
            <span className="quote-tategaki-text">構造の明快</span>
            <span className="quote-diamond-pin" />
          </div>

          <div
            aria-hidden="true"
            className="quote-tategaki-pillar quote-tategaki-right hidden md:flex"
          >
            <span className="quote-diamond-pin" />
            <span className="quote-tategaki-text">静寂と調和</span>
            <span className="quote-diamond-pin" />
          </div>

          {/* Center Editorial Quote with Hover-Parting Japanese Kagi-Kakko (「 」) Brackets */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-3">
              <span
                aria-hidden="true"
                className="quote-eyebrow-line h-px w-7 bg-[var(--band-dark-control)] transition-all duration-500 group-hover:w-12 group-hover:bg-[var(--band-dark-ink)]"
              />
              <p className="font-mono-meta m-0 text-[10px] tracking-[0.28em] text-[var(--band-dark-muted)] uppercase transition-colors duration-300 group-hover:text-[var(--band-dark-ink)]">
                {QUOTE.eyebrow}
              </p>
              <span
                aria-hidden="true"
                className="quote-eyebrow-line h-px w-7 bg-[var(--band-dark-control)] transition-all duration-500 group-hover:w-12 group-hover:bg-[var(--band-dark-ink)]"
              />
            </div>

            <blockquote className="relative mx-auto mt-7 mb-0 max-w-3xl px-2 sm:px-8">
              <span
                aria-hidden="true"
                className="quote-kagikakko quote-kagikakko-open"
              >
                「
              </span>

              <p className="quote-editorial-words font-editorial m-0 text-[clamp(2.05rem,4.7vw,3.95rem)] italic font-normal leading-[1.18] tracking-[-0.015em]">
                {words.map((word, index) => {
                  const threshold = index / Math.max(1, words.length);
                  const lit = progress >= threshold * 0.85;
                  return (
                    <span
                      key={`${word}-${index}`}
                      data-lit={lit ? 'true' : 'false'}
                      className="quote-word-token inline-block"
                      style={{
                        color: lit
                          ? 'var(--band-dark-ink)'
                          : 'var(--band-dark-muted)',
                        opacity: lit ? 1 : 0.28,
                        transform: lit
                          ? 'translate3d(0, 0px, 0)'
                          : 'translate3d(0, 5px, 0)',
                        marginRight: '0.26em',
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>

              <span
                aria-hidden="true"
                className="quote-kagikakko quote-kagikakko-close"
              >
                」
              </span>

              {/* Minimalist Japanese Rakkan Seal & Author Footer */}
              <footer className="mt-9 flex flex-col items-center gap-3.5">
                <div
                  aria-hidden="true"
                  className="flex items-center gap-2.5 opacity-75"
                >
                  <span className="h-px w-10 bg-[var(--band-dark-control)] transition-all duration-500 group-hover:w-16 group-hover:bg-[var(--band-dark-ink)] sm:w-14" />
                  <span className="quote-chigiri-joint" />
                  <span className="h-px w-10 bg-[var(--band-dark-control)] transition-all duration-500 group-hover:w-16 group-hover:bg-[var(--band-dark-ink)] sm:w-14" />
                </div>

                <div className="inline-flex items-center gap-2.5">
                  <span className="font-mono-meta text-[11px] font-semibold tracking-[0.24em] text-[var(--band-dark-muted)] uppercase transition-colors duration-300 group-hover:text-[var(--band-dark-ink)]">
                    {QUOTE.attribution}
                  </span>
                  <span
                    aria-hidden="true"
                    data-kanji="理"
                    className="quote-rakkan-seal"
                  />
                </div>
              </footer>
            </blockquote>
          </div>

          {/* Bottom Horizon Laser Sweep Line on Hover */}
          <span
            aria-hidden="true"
            className="quote-horizon-beam pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
}
