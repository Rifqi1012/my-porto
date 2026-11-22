import { useEffect, useRef, type CSSProperties } from 'react';
import { PROFILE } from '../data/portfolio';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import type { ThemeMode } from '../hooks/useTheme';
import { preloadAndPinImage } from '../utils/assetCache';

interface ProfileSectionProps {
  theme: ThemeMode;
}

const META_KANJI_MAP: Record<string, string> = {
  NAMA: '名',
  DOMISILI: '地',
  PERAN: '職',
};

const CREDENTIAL_SEALS = [
  { kanji: '学', label: 'S1 Teknik Informatika' },
  { kanji: '証', label: 'BNSP Data Analyst' },
  { kanji: '導', label: 'Full-Stack & Team Lead' },
] as const;

function ProfileKanaguCorner({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={`profile-kanagu-corner pointer-events-none absolute z-25 h-6 w-6 text-[var(--ink-primary)] sm:h-7 sm:w-7 ${className}`}
    >
      <path d="M1 35V1H35" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5.5 35V5.5H35M5.5 14H14V5.5"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <rect
        x="8.5"
        y="8.5"
        width="3.2"
        height="3.2"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function ProfileSection({ theme }: ProfileSectionProps) {
  const { ref, revealState } = useRevealOnScroll<HTMLElement>();
  const { ref: figureRef, revealState: mediaReveal } =
    useRevealOnScroll<HTMLElement>();
  const scrollStageRef = useRef<HTMLDivElement | null>(null);
  const progressLabelRef = useRef<HTMLSpanElement | null>(null);

  const isVisible = revealState === 'visible';
  const isMediaVisible = mediaReveal === 'visible' || isVisible;
  const portraitSrc =
    theme === 'dark'
      ? PROFILE.profileVisual.darkSrc
      : PROFILE.profileVisual.src;

  const visibleMetadata = PROFILE.metadata.filter(
    (item) => item.label.trim().toUpperCase() !== 'KETERSEDIAAN'
  );

  useEffect(() => {
    const altSrc =
      theme === 'dark'
        ? PROFILE.profileVisual.src
        : PROFILE.profileVisual.darkSrc;
    void preloadAndPinImage(altSrc);
  }, [theme]);

  // One-way scroll-triggered & scroll-paced Ninja Scroll (Shinobi Makimono) unroll:
  // Unrolls slowly (~4.6s frame-rate-independent duration) as you scroll into #profil, and stays permanently open once revealed.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stageEl = scrollStageRef.current;
    if (!stageEl) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reducedMotion) {
      stageEl.style.setProperty('--scroll-open', '100%');
      stageEl.style.setProperty('--scroll-clip', '0%');
      stageEl.style.setProperty('--scroll-rot', '0deg');
      return;
    }

    let currentP = 0;
    let maxTargetP = 0;
    let rafId = 0;
    let lastTime = 0;

    const applyProgress = (p: number) => {
      const openPct = p * 100;
      const clipPct = 100 - openPct;
      const rotDeg = p * 1080;
      stageEl.style.setProperty('--scroll-open', `${openPct.toFixed(2)}%`);
      stageEl.style.setProperty('--scroll-clip', `${clipPct.toFixed(2)}%`);
      stageEl.style.setProperty('--scroll-rot', `${rotDeg.toFixed(1)}deg`);
      if (progressLabelRef.current) {
        progressLabelRef.current.textContent = `${String(Math.round(openPct)).padStart(3, '0')}%`;
      }
    };

    const computeTarget = () => {
      const rect = stageEl.getBoundingClientRect();
      const vh = window.innerHeight || 900;

      // Progressive unroll window as #profil enters and settles into the viewport
      const enterStart = vh * 0.88;
      const enterFull = vh * 0.08;
      const enterRaw =
        (enterStart - rect.top) / Math.max(1, enterStart - enterFull);
      const enterP = Math.max(0, Math.min(1, enterRaw));
      const eased = enterP * enterP * (3 - 2 * enterP);

      // Latch maximum progress so the Ninja Scroll never closes back up once opened
      if (eased > maxTargetP) {
        maxTargetP = eased;
      }
      if (maxTargetP >= 0.72) {
        maxTargetP = 1;
      }
    };

    const tick = (now: number) => {
      const dt = lastTime ? Math.min(40, now - lastTime) / 1000 : 1 / 60;
      lastTime = now;

      const diff = maxTargetP - currentP;
      if (diff > 0.0008) {
        const dampedRate = diff * 0.95;
        const maxRate = 0.22;
        const step = Math.min(diff, Math.min(dampedRate, maxRate) * dt);
        currentP = Math.min(maxTargetP, currentP + Math.max(step, 0.018 * dt));
        applyProgress(currentP);
        rafId = requestAnimationFrame(tick);
      } else {
        currentP = maxTargetP;
        applyProgress(currentP);
        rafId = 0;
        lastTime = 0;
      }
    };

    const onScrollOrResize = () => {
      computeTarget();
      if (!rafId && maxTargetP - currentP > 0.0008) {
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
      }
    };

    computeTarget();
    applyProgress(currentP);
    if (maxTargetP - currentP > 0.0008) {
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <section
      id="profil"
      ref={ref}
      data-reveal={revealState}
      className="reveal-block py-[var(--space-section-y)]"
    >
      <div className="page-shell">
        {/* Minimalist Japanese Chapter Header Bar (aligned with 02 PROYEK & 03 PRINSIP) */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-3.5">
          <div className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              data-kanji="壱"
              className="profile-chapter-seal"
            />
            <p className="font-mono-meta m-0 text-xs font-semibold tracking-[0.22em] text-[var(--ink-primary)] uppercase">
              01 PROFIL
            </p>
            <span
              aria-hidden="true"
              className="font-mono-meta hidden text-[10px] tracking-[0.2em] text-[var(--ink-secondary)] sm:inline"
            >
              // 人物紹介
            </span>
          </div>

          <div
            aria-hidden="true"
            className="font-mono-meta flex items-center gap-2 text-[10px] tracking-[0.2em] text-[var(--ink-secondary)]"
          >
            <span className="hidden sm:inline">GULUNGAN</span>
            <span
              ref={progressLabelRef}
              className="font-semibold text-[var(--ink-primary)]"
            >
              000%
            </span>
          </div>
        </div>

        {/* One-Way Slow-Unrolling Shinobi Makimono (忍び巻物 / Ninja Scroll) Stage */}
        <div
          ref={scrollStageRef}
          className="byobu-makimono-stage relative mt-8 md:mt-10"
        >
          {/* Top Fixed Ninja Scroll Timber Rod (Hassō 八双) */}
          <div aria-hidden="true" className="profile-makimono-top-rod">
            <span className="profile-makimono-knob profile-makimono-knob-left" />
            <div className="flex w-full items-center justify-between px-4">
              <span className="font-mono-meta text-[9px] tracking-[0.24em] text-[var(--bg-canvas)] opacity-85">
                SHINOBI MAKIMONO // 忍び巻物
              </span>
              <span className="font-mono-meta hidden text-[9px] tracking-[0.24em] text-[var(--bg-canvas)] opacity-85 sm:inline">
                巻壱 ・ 人物紹介
              </span>
            </div>
            <span className="profile-makimono-knob profile-makimono-knob-right" />
          </div>

          {/* Unrolling Parchment Sheet containing the Minimalist Two-Wing Byōbu Spread */}
          <div className="makimono-unroll-sheet">
            <div className="byobu-profile-spread relative grid grid-cols-1 items-stretch gap-5 pt-3 pb-3 md:grid-cols-12 lg:gap-6">
              {/* Left Wing (5 cols): Clean Minimalist Portrait Frame */}
              <figure
                ref={figureRef}
                className="m-0 flex min-w-0 flex-col md:col-span-5"
              >
                <div
                  data-cursor="expand"
                  className="koseki-dossier-frame group relative flex h-full flex-col justify-between overflow-hidden"
                >
                  {/* Four Subtle Corner Registration Ticks */}
                  <span
                    aria-hidden="true"
                    className="noren-corner-tick noren-corner-tl"
                  />
                  <span
                    aria-hidden="true"
                    className="noren-corner-tick noren-corner-tr"
                  />
                  <span
                    aria-hidden="true"
                    className="noren-corner-tick noren-corner-bl"
                  />
                  <span
                    aria-hidden="true"
                    className="noren-corner-tick noren-corner-br"
                  />

                  {/* Minimalist Top Header Bar (matches Right Wing) */}
                  <div className="flex h-[48px] shrink-0 items-center justify-between gap-2 border-b border-[var(--border-hairline)] px-4 sm:px-5">
                    <div className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        data-kanji="肖"
                        className="koseki-mini-seal"
                      />
                      <span className="font-mono-meta text-[10px] font-semibold tracking-[0.2em] text-[var(--ink-secondary)]">
                        POTRET PROFIL
                      </span>
                    </div>

                    <span className="font-mono-meta text-[10px] tracking-[0.18em] text-[var(--ink-secondary)]">
                      {PROFILE.portraitNoteRight}
                    </span>
                  </div>

                  {/* Japanese Architectural Kakejiku & Karakuri Maru-mado Portrait Frame with Out-of-the-Box Hover Choreography */}
                  <div className="flex flex-1 items-center justify-center p-4 sm:p-5">
                    <div className="profile-kakejiku-stage relative w-full max-w-[21.5rem]">
                      {/* Top Hasso (八双) Hanging Scroll Bar */}
                      <div aria-hidden="true" className="kakejiku-hasso-bar">
                        <span className="kakejiku-hasso-cap kakejiku-hasso-cap-left" />
                        <span className="font-mono-meta text-[8px] tracking-[0.26em] text-[var(--bg-canvas)] opacity-85">
                          KAKEJIKU // 掛軸・肖像
                        </span>
                        <span className="kakejiku-hasso-cap kakejiku-hasso-cap-right" />
                      </div>

                      {/* Outer Japanese Beri-waku Woodblock Mat Frame */}
                      <div className="profile-beriwaku-mat relative border-x-[1.5px] border-[var(--ink-primary)] bg-[var(--bg-recessed)] p-2.5 sm:p-3">
                        <div
                          className="curtain-media kakejiku-portrait-window profile-portrait-viewport relative aspect-[720/930] w-full overflow-hidden border-[1.5px] border-[var(--ink-primary)]"
                          data-reveal={isMediaVisible ? 'visible' : 'hidden'}
                        >
                          {/* 1. Four Mechanical Kazari-Kanagu Corner Fretwork Brackets (snap inward on hover) */}
                          <ProfileKanaguCorner className="profile-kanagu-tl top-1.5 left-1.5" />
                          <ProfileKanaguCorner className="profile-kanagu-tr top-1.5 right-1.5 rotate-90" />
                          <ProfileKanaguCorner className="profile-kanagu-br right-1.5 bottom-1.5 rotate-180" />
                          <ProfileKanaguCorner className="profile-kanagu-bl bottom-1.5 left-1.5 -rotate-90" />

                          {/* 2. Sacred Maru-mado (丸窓) Zen Moon Window & Rotating Kamon Astrolabe Behind the Head */}
                          <div
                            aria-hidden="true"
                            className="profile-marumado-halo pointer-events-none"
                          >
                            <svg
                              viewBox="0 0 260 260"
                              fill="none"
                              className="h-full w-full text-[var(--ink-primary)]"
                            >
                              <circle
                                cx="130"
                                cy="130"
                                r="118"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeDasharray="5 5"
                              />
                              <circle
                                cx="130"
                                cy="130"
                                r="102"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <rect
                                x="58"
                                y="58"
                                width="144"
                                height="144"
                                stroke="currentColor"
                                strokeWidth="1.1"
                              />
                              <rect
                                x="58"
                                y="58"
                                width="144"
                                height="144"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                transform="rotate(45 130 130)"
                              />
                              <circle
                                cx="130"
                                cy="130"
                                r="64"
                                stroke="currentColor"
                                strokeWidth="0.9"
                                strokeDasharray="3 4"
                              />
                              <path
                                d="M130 6V32M130 228V254M6 130H32M228 130H254"
                                stroke="currentColor"
                                strokeWidth="1.3"
                              />
                            </svg>
                          </div>

                          {/* 3. Left & Right Sliding Shoji / Ofuda Vertical Tategaki Wing Shutters (unfold from edges on hover) */}
                          <div
                            aria-hidden="true"
                            className="profile-ofuda-wing profile-ofuda-wing-left"
                          >
                            <span
                              data-kanji="印"
                              className="profile-ofuda-seal"
                            />
                            <span
                              data-kanji="造形・構造"
                              className="profile-ofuda-kanji"
                            />
                          </div>

                          <div
                            aria-hidden="true"
                            className="profile-ofuda-wing profile-ofuda-wing-right"
                          >
                            <span
                              data-kanji="魂"
                              className="profile-ofuda-seal"
                            />
                            <span
                              data-kanji="風雅・革新"
                              className="profile-ofuda-kanji"
                            />
                          </div>

                          {/* 4. Horizontal Sumi-Ink Kento Laser Scan Beam on Hover */}
                          <span
                            aria-hidden="true"
                            className="profile-kento-scanline pointer-events-none"
                          />

                          {/* Wireframe Portrait Image (kept 100% static scale on hover so 1px wireframe lines never shimmer or vibrate) */}
                          <img
                            src={portraitSrc}
                            alt={PROFILE.profileVisual.alt}
                            width={720}
                            height={930}
                            decoding="async"
                            draggable={false}
                            className="profile-wireframe-img relative z-10 block h-full w-full select-none object-cover"
                          />

                          {/* 5. Bottom-Right Double Hanko Seal & Bottom-Center Verification Stamp on Hover */}
                          <div
                            aria-hidden="true"
                            className="profile-hanko-stack pointer-events-none"
                          >
                            <span
                              data-kanji="リ"
                              className="kakejiku-hanko-solid"
                            />
                            <span
                              data-kanji="極"
                              className="kakejiku-hanko-outline profile-hanko-sub"
                            />
                          </div>

                          <div
                            aria-hidden="true"
                            className="kakejiku-hover-seal pointer-events-none"
                          >
                            <span data-kanji="検印済 // 弐千弐拾陸" />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Jiku (軸) Cylindrical Wooden Scroll Roller & End-Knobs */}
                      <div aria-hidden="true" className="kakejiku-jiku-roller">
                        <span className="kakejiku-jikusaki kakejiku-jikusaki-left" />
                        <div className="flex w-full items-center justify-between px-3">
                          <span className="font-mono-meta text-[8px] tracking-[0.22em] text-[var(--bg-canvas)] opacity-80">
                            NO. 001
                          </span>
                          <span className="h-1 w-8 border-y border-[var(--bg-canvas)] opacity-55" />
                          <span className="font-mono-meta text-[8px] tracking-[0.22em] text-[var(--bg-canvas)] opacity-80">
                            弐千弐拾陸
                          </span>
                        </div>
                        <span className="kakejiku-jikusaki kakejiku-jikusaki-right" />
                      </div>
                    </div>
                  </div>

                  {/* Minimalist Bottom Footer Bar (matches Right Wing) */}
                  <figcaption className="font-mono-meta flex h-[38px] shrink-0 items-center justify-between border-t border-[var(--border-hairline)] px-4 text-[10px] tracking-[0.18em] text-[var(--ink-secondary)] sm:px-5">
                    <span>{PROFILE.portraitNoteLeft}</span>
                    <span>BANDUNG // ID</span>
                  </figcaption>
                </div>
              </figure>

              {/* Right Wing (7 cols): Clean Minimalist Editorial Bio & 3-Column Metadata */}
              <div className="flex min-w-0 flex-col md:col-span-7">
                <div className="koseki-dossier-frame relative flex h-full flex-col justify-between overflow-hidden">
                  {/* Four Subtle Corner Registration Ticks */}
                  <span
                    aria-hidden="true"
                    className="noren-corner-tick noren-corner-tl"
                  />
                  <span
                    aria-hidden="true"
                    className="noren-corner-tick noren-corner-tr"
                  />
                  <span
                    aria-hidden="true"
                    className="noren-corner-tick noren-corner-bl"
                  />
                  <span
                    aria-hidden="true"
                    className="noren-corner-tick noren-corner-br"
                  />

                  {/* Minimalist Top Header Bar (matches Left Wing) */}
                  <div className="flex h-[48px] shrink-0 items-center justify-between gap-3 border-b border-[var(--border-hairline)] px-5 sm:px-7">
                    <div className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        data-kanji="録"
                        className="koseki-mini-seal"
                      />
                      <span className="font-mono-meta text-[10px] font-semibold tracking-[0.2em] text-[var(--ink-secondary)]">
                        RINGKASAN PROFIL
                      </span>
                    </div>

                    <span className="font-mono-meta text-[10px] tracking-[0.18em] text-[var(--ink-secondary)]">
                      自己紹介
                    </span>
                  </div>

                  {/* Main Breathable Editorial Content */}
                  <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-8">
                    <div>
                      {/* Greeting & Name + Subtle Vertical Katakana Watermark */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono-meta m-0 text-[10px] tracking-[0.24em] text-[var(--ink-secondary)] uppercase">
                            PERKENALAN
                          </p>
                          <h2 className="font-editorial m-0 mt-2 text-[clamp(2rem,3.4vw,2.85rem)] font-medium leading-[1.08] tracking-[-0.015em] text-[var(--ink-primary)]">
                            <span className="split-mask block">
                              <span
                                className="split-line"
                                data-entered={isVisible ? 'true' : 'false'}
                                style={{ '--stagger': '60ms' } as CSSProperties}
                              >
                                {PROFILE.greetingPrefix}
                              </span>
                            </span>
                            <span className="split-mask mt-0.5 block">
                              <span
                                className="split-line italic font-normal"
                                data-entered={isVisible ? 'true' : 'false'}
                                style={{ '--stagger': '160ms' } as CSSProperties}
                              >
                                {PROFILE.greetingItalic}
                              </span>
                            </span>
                          </h2>
                        </div>

                        <div
                          aria-hidden="true"
                          className="koseki-vertical-watermark hidden lg:flex"
                        >
                          <span data-kanji={PROFILE.displayWordmark} />
                        </div>
                      </div>

                      {/* Clean Bio Paragraph (without heavy gray nested box) */}
                      <p className="m-0 mt-5 border-t border-[var(--border-hairline)] pt-5 text-[0.95rem] leading-[1.85] text-[var(--ink-secondary)] sm:text-base">
                        {PROFILE.bio}
                      </p>

                      {/* Three Minimalist Japanese Credential Seals */}
                      <div
                        aria-hidden="true"
                        className="mt-5 flex flex-wrap items-center gap-2"
                      >
                        {CREDENTIAL_SEALS.map((cred) => (
                          <span
                            key={cred.label}
                            className="koseki-credential-pill"
                          >
                            <span
                              data-kanji={cred.kanji}
                              className="koseki-credential-kanji"
                            />
                            <span className="font-mono-meta text-[10.5px] font-medium tracking-[0.06em]">
                              {cred.label}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Clean 3-Column Metadata Row (NAMA, DOMISILI, PERAN — KETERSEDIAAN removed) */}
                    <dl className="m-0 grid grid-cols-1 gap-4 border-t border-[var(--border-hairline)] pt-5 sm:grid-cols-3">
                      {visibleMetadata.map((item) => {
                        const key = item.label.trim().toUpperCase();
                        const kanji = META_KANJI_MAP[key] ?? '印';

                        return (
                          <div
                            key={item.label}
                            className="border-l-2 border-[var(--ink-primary)] pl-3"
                          >
                            <div className="inline-flex items-center gap-1.5">
                              <span
                                aria-hidden="true"
                                data-kanji={kanji}
                                className="koseki-mini-seal !h-4 !w-4 !text-[8.5px]"
                              />
                              <dt className="font-mono-meta text-[10px] tracking-[0.18em] text-[var(--ink-secondary)] uppercase">
                                {item.label}
                              </dt>
                            </div>
                            <dd className="m-0 mt-1.5 text-sm font-semibold tracking-[0.01em] text-[var(--ink-primary)]">
                              {item.value}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>

                  {/* Minimalist Bottom Footer Bar (matches Left Wing) */}
                  <div
                    aria-hidden="true"
                    className="font-mono-meta flex h-[38px] shrink-0 items-center justify-between border-t border-[var(--border-hairline)] px-5 text-[10px] tracking-[0.18em] text-[var(--ink-secondary)] sm:px-7"
                  >
                    <span>BIODATA RESMI</span>
                    <span>{PROFILE.verticalAccent} // 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descending Cylindrical Ninja Scroll Roller (Jiku 軸) */}
          <div aria-hidden="true" className="makimono-unroll-cylinder">
            <span className="profile-makimono-knob profile-makimono-knob-left">
              <span className="profile-makimono-spiral" />
            </span>

            <div className="flex w-full items-center justify-between px-4">
              <span className="font-mono-meta hidden text-[8.5px] tracking-[0.24em] text-[var(--bg-canvas)] opacity-80 sm:inline">
                // 巻物軸
              </span>

              <div className="profile-roller-clasp">
                <span className="profile-roller-cord" />
                <span data-kanji="忍" className="profile-roller-medallion" />
                <span className="profile-roller-cord" />
              </div>

              <span className="font-mono-meta hidden text-[8.5px] tracking-[0.24em] text-[var(--bg-canvas)] opacity-80 sm:inline">
                KAIMON // 全開
              </span>
            </div>

            <span className="profile-makimono-knob profile-makimono-knob-right">
              <span className="profile-makimono-spiral" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
