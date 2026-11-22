import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS, PROFILE } from '../data/portfolio';
import { useGlassSpecular } from '../hooks/useGlassSpecular';
import type { ThemeMode } from '../hooks/useTheme';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';

interface GlassNavProps {
  theme: ThemeMode;
  onToggleTheme: (originEl?: HTMLElement | null) => void;
}

// Traditional Japanese Daiji (formal accounting/shrine numerals) for the 5 Kifuda talisman slips
const DAIJI_NUMERALS = ['壱', '弐', '参', '肆', '伍'] as const;

type NavMorphPhase =
  | 'top-idle'
  | 'to-bottom-1-gate'
  | 'to-bottom-2-roll'
  | 'to-bottom-3-move'
  | 'to-bottom-4-unroll'
  | 'bottom-idle'
  | 'to-top-1-roll'
  | 'to-top-2-move'
  | 'to-top-3-unroll'
  | 'to-top-4-gate';

export function GlassNav({ theme, onToggleTheme }: GlassNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('profil');
  const [docked, setDocked] = useState(false);
  const [morphPhase, setMorphPhase] = useState<NavMorphPhase>('top-idle');
  const glassHandlers = useGlassSpecular();
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const morphTimersRef = useRef<number[]>([]);
  const prevDockedRef = useRef(false);

  // Hysteresis scroll threshold (220px down / 140px up) prevents jitter near the transition point.
  useEffect(() => {
    let rafId = 0;
    const evaluateScroll = () => {
      rafId = 0;
      const y = window.scrollY;
      setDocked((prev) => {
        if (!prev && y > 220) return true;
        if (prev && y < 140) return false;
        return prev;
      });
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(evaluateScroll);
    };

    evaluateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // 4-Stage Japanese Gate -> Ninja Scroll (Shinobi Makimono) transition choreography
  useEffect(() => {
    if (prevDockedRef.current === docked) return;
    prevDockedRef.current = docked;

    morphTimersRef.current.forEach((id) => window.clearTimeout(id));
    morphTimersRef.current = [];
    setMenuOpen(false);

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setMorphPhase(docked ? 'bottom-idle' : 'top-idle');
      return;
    }

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      morphTimersRef.current.push(id);
    };

    if (docked) {
      // 1. Gate closes from bottom to top at the top position
      setMorphPhase('to-bottom-1-gate');
      // 2. Closed gate rolls inward horizontally into a compact Ninja Scroll
      schedule(() => setMorphPhase('to-bottom-2-roll'), 240);
      // 3. Closed Ninja Scroll glides smoothly from top to bottom
      schedule(() => setMorphPhase('to-bottom-3-move'), 520);
      // 4. Ninja Scroll unrolls horizontally at the bottom & reveals dock controls
      schedule(() => setMorphPhase('to-bottom-4-unroll'), 810);
      schedule(() => setMorphPhase('bottom-idle'), 1130);
    } else {
      // Reverse choreography when returning to top
      // 1. Bottom scroll closes gate & rolls shut into compact Ninja Scroll
      setMorphPhase('to-top-1-roll');
      // 2. Closed Ninja Scroll glides upward to the top position
      schedule(() => setMorphPhase('to-top-2-move'), 170);
      // 3. Ninja Scroll unrolls horizontally across the top rail
      schedule(() => setMorphPhase('to-top-3-unroll'), 360);
      // 4. Gate opens downward revealing the top Noren navbar
      schedule(() => setMorphPhase('to-top-4-gate'), 530);
      schedule(() => setMorphPhase('top-idle'), 680);
    }

    return () => {
      morphTimersRef.current.forEach((id) => window.clearTimeout(id));
      morphTimersRef.current = [];
    };
  }, [docked]);

  useEffect(() => {
    let rafId = 0;

    const updateActiveSection = () => {
      rafId = 0;
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
        (el): el is HTMLElement => el !== null
      );
      if (sections.length === 0) return;

      // If scrolled to the very bottom of the page, highlight the last section (05 KONTAK)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40
      ) {
        setActiveId(sections[sections.length - 1].id);
        return;
      }

      // Reading-focus line at 38% of viewport height works reliably for both short and very tall sections (#karya)
      const focusY = window.innerHeight * 0.38;
      let nextActiveId = sections[0].id;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= focusY) {
          nextActiveId = section.id;
        } else {
          break;
        }
      }

      setActiveId(nextActiveId);
    };

    const onScrollOrResize = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const panel = menuPanelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled)'
    );
    focusables?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const themeLabel = theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang';
  const dockInitial = (PROFILE.displayWordmark || PROFILE.name).trim().charAt(0) || 'リ';
  const activeNav = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0];
  const activeIndex = Math.max(0, NAV_ITEMS.findIndex((item) => item.id === activeId));
  // Swap internal content between full top rail and compact bottom scroll only while the gate shutter is closed
  const compactScrollLayout =
    morphPhase === 'to-bottom-3-move' ||
    morphPhase === 'to-bottom-4-unroll' ||
    morphPhase === 'bottom-idle' ||
    morphPhase === 'to-top-1-roll' ||
    morphPhase === 'to-top-2-move';

  return (
    <header className="relative">
      {/* Static spacer reserves top Noren rail height so detaching into the bottom Makimono dock causes zero layout shift. */}
      <div className="h-[84px] sm:h-[92px]" aria-hidden="true" />

      <div
        className="nav-dock-wrapper"
        data-docked={docked ? 'true' : 'false'}
        data-phase={morphPhase}
      >
        {/* Top Japanese Torii / Kamoi architectural timber lintel beam (visible when unscrolled) */}
        <div aria-hidden="true" className="noren-kamoi-beam">
          <span className="noren-kamoi-finial noren-kamoi-finial-left" />
          <span className="noren-kamoi-rail" />
          <span className="noren-kamoi-peg noren-kamoi-peg-left" />
          <span className="noren-kamoi-peg noren-kamoi-peg-right" />
          <span className="noren-kamoi-finial noren-kamoi-finial-right" />
        </div>

        {/* Left & Right Shinobi Makimono (Ninja handscroll) cylindrical wooden rollers */}
        <span aria-hidden="true" className="makimono-roller makimono-roller-left" />
        <span aria-hidden="true" className="makimono-roller makimono-roller-right" />

        <div
          className="liquid-glass-surface nav-dock-surface noren-glass-frame"
          onPointerMove={glassHandlers.onPointerMove}
          onPointerLeave={glassHandlers.onPointerLeave}
        >
          {/* Japanese Shoji/Kumiko Gate Shutter that closes from bottom-to-top before rolling into a Ninja Scroll */}
          <div aria-hidden="true" className="navbar-shoji-shutter">
            <span className="navbar-shutter-lead-rail" />
            <div className="shinobi-scroll-clasp">
              <span className="shinobi-obi-cord" />
              <span data-kanji="忍" className="shinobi-crest-medallion" />
              <span className="shinobi-obi-cord" />
            </div>
            <span className="navbar-shutter-bottom-rail" />
          </div>

          {/* Inner Kumiko corner registration ticks */}
          <span aria-hidden="true" className="noren-corner-tick noren-corner-tl" />
          <span aria-hidden="true" className="noren-corner-tick noren-corner-tr" />
          <span aria-hidden="true" className="noren-corner-tick noren-corner-bl" />
          <span aria-hidden="true" className="noren-corner-tick noren-corner-br" />

          <div
            className={`liquid-glass-content flex items-center justify-between gap-2 ${
              compactScrollLayout ? 'px-3 py-1.5 sm:px-4' : 'px-3 py-2 sm:px-5'
            }`}
          >
            {/* Left Anchor: Carved Japanese Hanko Stamp Seal + Editorial Signature & Vertical Mokuroku Stamp */}
            <a
              href="#top"
              aria-label={`Kembali ke atas, ${PROFILE.signature}`}
              className={`dock-item noren-brand-seal group inline-flex min-h-[46px] items-center no-underline transition-colors ${
                compactScrollLayout
                  ? 'w-[46px] shrink-0 justify-center'
                  : 'min-w-0 max-w-[12.5rem] gap-2.5 px-1.5 sm:max-w-none sm:gap-3'
              }`}
            >
              <span
                aria-hidden="true"
                data-kanji={dockInitial}
                className="hanko-seal-box shrink-0"
              />

              {!compactScrollLayout ? (
                <span className="flex min-w-0 flex-col">
                  <span className="font-mono-meta hidden text-[9px] tracking-[0.28em] text-[var(--ink-secondary)] sm:block">
                    MOKUROKU // 2026
                  </span>
                  <span className="font-editorial truncate text-base italic font-semibold tracking-tight text-[var(--ink-primary)] transition-opacity group-hover:opacity-75 sm:text-xl">
                    {PROFILE.signature}
                  </span>
                </span>
              ) : null}

              {!compactScrollLayout ? (
                <span
                  aria-hidden="true"
                  data-kanji="目録"
                  className="noren-vertical-cartouche hidden xl:inline-flex"
                />
              ) : null}
            </a>

            {/* Mobile docked active Kifuda indicator */}
            {compactScrollLayout ? (
              <span
                data-kanji={DAIJI_NUMERALS[activeIndex] ?? '壱'}
                className="noren-mobile-active font-mono-meta truncate text-[11px] font-medium text-[var(--ink-primary)] lg:hidden"
              >
                {activeNav.index} {activeNav.label}
              </span>
            ) : null}

            {/* Desktop Center: Hanging Japanese Kifuda / Noren Talisman Slips */}
            <nav
              aria-label="Navigasi utama"
              className={`noren-kifuda-rail hidden items-stretch lg:flex ${
                compactScrollLayout ? 'gap-1.5' : 'gap-2'
              }`}
            >
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeId === item.id;
                const kanji = DAIJI_NUMERALS[idx] ?? '壱';
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveId(item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    data-active={isActive ? 'true' : 'false'}
                    data-step={idx % 2 === 0 ? 'even' : 'odd'}
                    className="dock-item kifuda-slip group relative inline-flex min-h-[46px] items-center gap-2 px-3.5 text-xs font-medium tracking-[0.09em] no-underline"
                  >
                    {/* Hanging cord hole & knot at the top of each Kifuda wooden plaque */}
                    <span aria-hidden="true" className="kifuda-cord-hole" />

                    {/* Decorative Japanese Daiji numeral stamp via CSS attr(data-kanji) */}
                    <span
                      aria-hidden="true"
                      data-kanji={kanji}
                      className="kifuda-kanji-badge"
                    />

                    <span className="flex flex-col items-start leading-none">
                      <span
                        className={`font-mono-meta text-[9px] tracking-[0.18em] ${
                          isActive
                            ? 'text-[var(--bg-canvas)] opacity-80'
                            : 'text-[var(--ink-secondary)]'
                        }`}
                      >
                        {item.index}
                      </span>
                      <span className="mt-0.5 text-[11px] font-semibold tracking-[0.12em]">
                        {item.label}
                      </span>
                    </span>

                    {/* Bottom carved seal notch indicator */}
                    <span aria-hidden="true" className="kifuda-bottom-notch" />
                  </a>
                );
              })}
            </nav>

            {/* Right Controls: Andon Lantern Theme Switch + Mobile Mokuroku Talisman Drawer Trigger */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={(event) => onToggleTheme(event.currentTarget)}
                aria-label={themeLabel}
                aria-pressed={theme === 'dark'}
                data-kanji={theme === 'light' ? '夜' : '昼'}
                className="dock-item andon-theme-switch inline-flex min-h-[46px] min-w-[46px] items-center justify-center gap-2 px-3 text-xs font-medium text-[var(--ink-primary)]"
              >
                <span key={theme} className="theme-icon-swap">
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </span>
                {!compactScrollLayout ? (
                  <span className="font-mono-meta hidden text-[11px] tracking-[0.12em] sm:inline">
                    {theme === 'light' ? 'Gelap' : 'Terang'}
                  </span>
                ) : null}
              </button>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-panel"
                data-kanji={menuOpen ? '閉' : '目'}
                className="dock-item andon-menu-trigger inline-flex min-h-[46px] items-center gap-2 px-3 text-sm font-medium text-[var(--ink-primary)] lg:hidden"
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
                <span>{menuOpen ? 'Tutup' : 'Menu'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel unfolds like a Japanese Byobu / Shoji screen grid */}
        {menuOpen ? (
          <div
            id="mobile-nav-panel"
            ref={menuPanelRef}
            role="dialog"
            aria-label="Menu navigasi"
            className={`noren-mobile-drawer surface-card absolute inset-x-0 p-3.5 shadow-xl lg:hidden ${
              docked ? 'bottom-full mb-3' : 'top-full mt-2.5'
            }`}
          >
            <div
              aria-hidden="true"
              className="mb-2.5 flex items-center justify-between border-b border-[var(--border-subtle)] pb-2"
            >
              <span className="font-mono-meta text-[10px] tracking-[0.24em] text-[var(--ink-secondary)]">
                [MOKUROKU // INDEKS]
              </span>
              <span
                data-kanji="目録"
                className="kifuda-kanji-badge text-[11px] text-[var(--ink-secondary)]"
              />
            </div>

            <nav aria-label="Navigasi mobile" className="grid grid-cols-1 gap-1.5">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeId === item.id;
                const kanji = DAIJI_NUMERALS[idx] ?? '壱';
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveId(item.id);
                      closeMenu();
                    }}
                    aria-current={isActive ? 'location' : undefined}
                    data-active={isActive ? 'true' : 'false'}
                    className="kifuda-mobile-row flex min-h-[46px] items-center justify-between px-3.5 text-sm font-medium tracking-[0.08em] no-underline"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        data-kanji={kanji}
                        className="kifuda-kanji-badge"
                      />
                      <span
                        className={`font-mono-meta text-xs ${
                          isActive
                            ? 'text-[var(--bg-canvas)] opacity-85'
                            : 'text-[var(--ink-secondary)]'
                        }`}
                      >
                        {item.index}
                      </span>
                      <span>{item.label}</span>
                    </span>
                    {isActive ? (
                      <span className="font-mono-meta text-[11px] tracking-[0.16em] text-[var(--bg-canvas)]">
                        [AKTIF]
                      </span>
                    ) : null}
                  </a>
                );
              })}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
