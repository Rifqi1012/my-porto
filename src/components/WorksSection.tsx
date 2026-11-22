import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PROJECTS } from '../data/portfolio';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import type { ProjectItem } from '../types/portfolio';
import { ArrowUpRightIcon } from './Icons';

interface WorksSectionProps {
  onSelectProject?: (project: ProjectItem, trigger: HTMLButtonElement) => void;
}

const DAIJI_NUMERALS = [
  '壱',
  '弐',
  '参',
  '肆',
  '伍',
  '陸',
  '漆',
  '捌',
  '玖',
  '拾',
] as const;

export function WorksSection(_props: WorksSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [enteredCards, setEnteredCards] = useState<Record<number, boolean>>({});
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const { ref, revealState } = useRevealOnScroll<HTMLElement>();
  const isVisible = revealState === 'visible';

  // Per-card IntersectionObserver so each project dossier performs its Japanese Karakuri gate-parting entrance as the user scrolls to it
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      const all: Record<number, boolean> = {};
      PROJECTS.forEach((_, idx) => {
        all[idx] = true;
      });
      setEnteredCards(all);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idxAttr = entry.target.getAttribute('data-card-index');
          if (idxAttr !== null) {
            const idx = Number(idxAttr);
            setEnteredCards((prev) =>
              prev[idx] ? prev : { ...prev, [idx]: true }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="karya"
      ref={ref}
      data-reveal={revealState}
      className="works-section-stage reveal-block border-t border-[var(--border-hairline)] py-[var(--space-section-y)]"
    >
      <div className="page-shell">
        {/* Minimalist Japanese Chapter Header Bar with Center-Outward Kamoi Line Draw */}
        <div
          data-entered={isVisible ? 'true' : 'false'}
          className="works-kamoi-header relative flex items-center justify-between gap-4 pb-3.5"
        >
          <div className="works-header-left inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              data-kanji="弐"
              className="profile-chapter-seal works-chapter-stamp"
            />
            <p className="font-mono-meta m-0 text-xs font-semibold tracking-[0.22em] text-[var(--ink-primary)] uppercase">
              02 PROYEK
            </p>
            <span
              aria-hidden="true"
              className="font-mono-meta hidden text-[10px] tracking-[0.2em] text-[var(--ink-secondary)] sm:inline"
            >
              // 開発実績
            </span>
          </div>

          {/* Ceremonial Center Noren / Chigiri Crest that locks in when section enters */}
          <div
            aria-hidden="true"
            className="works-header-crest hidden items-center gap-2 md:flex"
          >
            <span className="tech-rack-diamond" />
            <span className="h-px w-12 bg-[var(--border-control)]" />
            <span className="tech-rack-chigiri" />
            <span className="h-px w-12 bg-[var(--border-control)]" />
            <span className="tech-rack-diamond" />
          </div>

          <div
            aria-hidden="true"
            className="works-header-right font-mono-meta flex items-center gap-2 text-[10px] tracking-[0.2em] text-[var(--ink-secondary)]"
          >
            <span className="hidden sm:inline">ARSIP</span>
            <span className="font-semibold text-[var(--ink-primary)]">
              {String(PROJECTS.length).padStart(2, '0')} PROYEK
            </span>
          </div>

          {/* Animated bottom hairline rule that draws from center outward on section entrance */}
          <span aria-hidden="true" className="works-kamoi-draw-line" />
        </div>

        {/* Clean Minimalist Section Title & Guide with Hanging Noren Stagger */}
        <div
          data-entered={isVisible ? 'true' : 'false'}
          className="works-title-stage mt-7 flex flex-col justify-between gap-4 sm:mt-9 lg:flex-row lg:items-end"
        >
          <div>
            <p className="works-eyebrow-reveal font-mono-meta m-0 text-[10px] tracking-[0.24em] text-[var(--ink-secondary)] uppercase">
              PORTOFOLIO PENGEMBANGAN &amp; SISTEM
            </p>
            <h2 className="font-editorial m-0 mt-1.5 text-[clamp(2.35rem,4.8vw,3.85rem)] font-medium leading-[1.04] tracking-[-0.02em] text-[var(--ink-primary)]">
              <span className="split-mask">
                <span
                  className="split-line"
                  data-entered={isVisible ? 'true' : 'false'}
                  style={{ '--stagger': '90ms' } as CSSProperties}
                >
                  Proyek <span className="italic font-normal">pilihan</span>
                </span>
              </span>
            </h2>
          </div>

          <p className="works-guide-reveal m-0 max-w-[40ch] text-sm leading-relaxed text-[var(--ink-secondary)] lg:text-right">
            Arahkan kursor pada bingkai untuk membuka pintu geser <em>Fusuma</em> dan melihat pratinjau penuh setiap proyek.
          </p>
        </div>

        {/* Minimalist Japanese Fusuma Project Dossiers with Per-Card Karakuri Shōji Entrance Choreography */}
        <div className="mt-8 flex flex-col gap-7 sm:mt-10 sm:gap-8">
          {PROJECTS.map((project, idx) => {
            const kanjiNum = DAIJI_NUMERALS[idx] ?? '壱';
            const isHighlighted = activeIndex === idx;
            const isCardEntered = Boolean(enteredCards[idx]);

            return (
              <article
                key={`${project.id}-${idx}`}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                data-card-index={idx}
                data-card-entered={isCardEntered ? 'true' : 'false'}
                data-cursor="expand"
                data-active={isHighlighted ? 'true' : 'false'}
                onMouseEnter={() => setActiveIndex(idx)}
                onFocus={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                className="hanga-work-dossier group relative overflow-hidden"
              >
                {/* Out-of-the-Box Full-Card Karakuri Shōji Entrance Doors:
                    Sealed shut before the user scrolls to this card; unlocks at the center Kamon seal & parts wide open left and right on arrival! */}
                <div
                  aria-hidden="true"
                  className="dossier-entrance-stage pointer-events-none"
                >
                  <div className="dossier-entrance-door dossier-entrance-door-left">
                    <span className="dossier-entrance-rail" />
                    <span
                      data-kanji="開"
                      className="dossier-entrance-tag dossier-entrance-tag-left"
                    />
                  </div>

                  <div className="dossier-entrance-door dossier-entrance-door-right">
                    <span className="dossier-entrance-rail" />
                    <span
                      data-kanji="展"
                      className="dossier-entrance-tag dossier-entrance-tag-right"
                    />
                  </div>

                  {/* Center Karakuri Entrance Seal & Vertical Kentō Beam */}
                  <span className="dossier-entrance-seam" />
                  <div className="dossier-entrance-seal">
                    <span className="dossier-entrance-seal-ring" />
                    <span
                      data-kanji={kanjiNum}
                      className="dossier-entrance-seal-core"
                    />
                  </div>
                </div>

                {/* Four Subtle Corner Registration Ticks */}
                <span aria-hidden="true" className="noren-corner-tick noren-corner-tl" />
                <span aria-hidden="true" className="noren-corner-tick noren-corner-tr" />
                <span aria-hidden="true" className="noren-corner-tick noren-corner-bl" />
                <span aria-hidden="true" className="noren-corner-tick noren-corner-br" />

                {/* Minimalist Top Bar: Index + Category on left, Year on right */}
                <div className="dossier-topbar-reveal flex items-center justify-between gap-3 border-b border-[var(--border-hairline)] px-5 py-3 sm:px-7">
                  <div className="inline-flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      data-kanji={kanjiNum}
                      className="hanga-daiji-seal shrink-0"
                    />
                    <span className="font-mono-meta text-xs font-semibold tracking-[0.18em] text-[var(--ink-primary)]">
                      {project.index}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-3 w-px bg-[var(--border-hairline)]"
                    />
                    <span className="font-mono-meta text-[10.5px] tracking-[0.18em] text-[var(--ink-secondary)] uppercase">
                      {project.shortTitle}
                    </span>
                  </div>

                  <span className="font-mono-meta text-xs font-medium tracking-[0.18em] text-[var(--ink-secondary)]">
                    {project.year}
                  </span>
                </div>

                {/* Main 2-Column Balanced Layout (6 cols Visual + 6 cols Info) */}
                <div className="grid grid-cols-1 items-center gap-0 lg:grid-cols-12">
                  {/* Left Wing (6 cols): Clean Uncropped Project Screenshot with Fusuma Sliding Doors */}
                  <div className="dossier-visual-reveal border-b border-[var(--border-hairline)] p-5 sm:p-7 lg:col-span-6 lg:border-r lg:border-b-0">
                    <div className="hanga-visual-stage relative w-full overflow-hidden border border-[var(--ink-primary)] bg-[var(--bg-recessed)] p-2.5 sm:p-3">
                      <img
                        src={project.image.src}
                        alt={project.image.alt}
                        width={1280}
                        height={720}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                        className="hanga-project-img block h-auto max-h-[21rem] w-full select-none bg-[var(--bg-canvas)] object-contain"
                      />

                      {/* Left & Right Japanese Fusuma (襖) Sliding Gate Doors:
                          Closed by default, parting wide open left & right on hover */}
                      <div
                        aria-hidden="true"
                        className="hanga-fusuma-shutter hanga-fusuma-left"
                      >
                        <span className="hanga-fusuma-koshiita" />
                        <div className="hanga-fusuma-handle hanga-fusuma-handle-left">
                          <div className="hanga-fusuma-plaque">
                            <span data-kanji="開" className="hanga-fusuma-seal" />
                          </div>
                        </div>
                      </div>

                      <div
                        aria-hidden="true"
                        className="hanga-fusuma-shutter hanga-fusuma-right"
                      >
                        <span className="hanga-fusuma-koshiita" />
                        <div className="hanga-fusuma-handle hanga-fusuma-handle-right">
                          <div className="hanga-fusuma-plaque">
                            <span data-kanji="門" className="hanga-fusuma-seal" />
                          </div>
                        </div>
                      </div>

                      {/* Center Medallion on the closed gate that unlocks & parts on hover */}
                      <div
                        aria-hidden="true"
                        className="hanga-gate-center-lock pointer-events-none"
                      >
                        <span className="hanga-gate-lock-ring" />
                        <span
                          data-kanji={kanjiNum}
                          className="hanga-gate-lock-core"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Wing (6 cols): Clean, Breathable Editorial Details */}
                  <div className="dossier-info-reveal flex flex-col justify-between gap-6 p-5 sm:p-8 lg:col-span-6">
                    <div>
                      {/* Role Eyebrow */}
                      <p className="font-mono-meta m-0 text-[10.5px] font-medium tracking-[0.2em] text-[var(--ink-secondary)] uppercase">
                        {project.role}
                      </p>

                      {/* Primary Project Title from src/data/portfolio.ts */}
                      <h3 className="font-editorial m-0 mt-2 text-[clamp(1.85rem,3.1vw,2.65rem)] font-medium leading-[1.1] tracking-[-0.015em] text-[var(--ink-primary)]">
                        {project.title}
                      </h3>

                      {/* Workplace / Client Line */}
                      {project.client ? (
                        <div className="mt-3 inline-flex items-center gap-2 text-xs text-[var(--ink-secondary)] sm:text-[13px]">
                          <span
                            aria-hidden="true"
                            data-kanji="司"
                            className="koseki-mini-seal !h-4 !w-4 shrink-0 !bg-[var(--ink-primary)] !text-[8.5px] !text-[var(--bg-canvas)]"
                          />
                          <span className="font-medium text-[var(--ink-primary)]">
                            {project.client}
                          </span>
                        </div>
                      ) : null}

                      {/* Clean Summary Paragraph (no heavy nested boxes) */}
                      <p className="m-0 mt-5 border-t border-[var(--border-hairline)] pt-4 text-sm leading-[1.8] text-[var(--ink-secondary)] sm:text-[0.95rem]">
                        {project.summary}
                      </p>
                    </div>

                    {/* Footer: Tech Stack & Action Link / Private Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)] pt-4">
                      <ul
                        aria-label={`Teknologi ${project.title}`}
                        className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0"
                      >
                        {project.stack.map((tech) => (
                          <li key={tech} className="hanga-stack-tag">
                            <span className="font-mono-meta text-[11px] font-medium tracking-[0.04em]">
                              {tech}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {(() => {
                        const rawUrl = (project.liveUrl || project.repoUrl || '').trim();
                        const isPrivateProject =
                          project.isPrivate === true ||
                          !rawUrl ||
                          rawUrl.toLowerCase() === 'private' ||
                          rawUrl === '#';

                        if (isPrivateProject) {
                          return (
                            <div
                              aria-label={`Status akses ${project.title}: Project Private (Akses Internal)`}
                              className="hanga-private-plaque font-mono-meta inline-flex min-h-[46px] select-none items-center gap-2 px-3.5 text-[11px] font-semibold tracking-[0.14em] uppercase"
                            >
                              <span
                                aria-hidden="true"
                                data-kanji="秘"
                                className="hanga-private-seal"
                              />
                              <span>Project Private</span>
                              <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                                className="h-3.5 w-3.5 shrink-0 opacity-75"
                              >
                                <rect
                                  x="3.25"
                                  y="7.25"
                                  width="9.5"
                                  height="6.5"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                />
                                <path
                                  d="M5.25 7.25V5.2C5.25 3.68 6.48 2.45 8 2.45C9.52 2.45 10.75 3.68 10.75 5.2V7.25"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                />
                              </svg>
                            </div>
                          );
                        }

                        return (
                          <a
                            href={rawUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Buka project ${project.title}`}
                            className="hanga-action-plaque font-mono-meta inline-flex min-h-[46px] items-center gap-2 px-4 text-[11px] font-semibold tracking-[0.14em] uppercase no-underline"
                          >
                            <span
                              aria-hidden="true"
                              data-kanji="開"
                              className="hanga-action-seal"
                            />
                            <span>Buka Project</span>
                            <ArrowUpRightIcon className="hanga-action-arrow h-3.5 w-3.5" />
                          </a>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
