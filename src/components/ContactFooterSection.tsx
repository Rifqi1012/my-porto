import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { PROFILE, SOCIAL_LINKS } from "../data/portfolio";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import {
  AlertIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
} from "./Icons";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  message: "",
};

const CHANNEL_KANJI_MAP: Record<
  string,
  { kanji: string; code: string; numeral: string }
> = {
  email: { kanji: "郵", code: "DENSHIN // MAIL", numeral: "壱" },
  github: { kanji: "源", code: "GENRYU // CODE", numeral: "弐" },
  linkedin: { kanji: "脈", code: "JINMYAKU // NET", numeral: "参" },
  instagram: { kanji: "景", code: "FUKEI // VISUAL", numeral: "肆" },
};

function resolveSocialUrl(
  id: string,
  handle: string,
  url?: string | null,
): string | null {
  const rawUrl = (url || "").trim();
  if (rawUrl && !rawUrl.includes("[") && !rawUrl.includes("]")) {
    return /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  }

  const rawHandle = (handle || "").trim();
  if (!rawHandle || rawHandle.includes("[") || rawHandle.includes("]")) {
    return null;
  }

  if (/^https?:\/\//i.test(rawHandle)) {
    return rawHandle;
  }

  if (
    rawHandle.includes("github.com") ||
    rawHandle.includes("linkedin.com") ||
    rawHandle.includes("instagram.com") ||
    rawHandle.includes(".")
  ) {
    return `https://${rawHandle.replace(/^\/+/, "")}`;
  }

  const cleanUser = rawHandle.replace(/^@/, "");
  const key = id.toLowerCase();
  if (key === "github") return `https://github.com/${cleanUser}`;
  if (key === "linkedin") return `https://linkedin.com/in/${cleanUser}`;
  if (key === "instagram") return `https://instagram.com/${cleanUser}`;
  return `https://${cleanUser}`;
}

export function ContactFooterSection() {
  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, revealState } = useRevealOnScroll<HTMLElement>();
  const isVisible = revealState === "visible";
  const year = new Date().getFullYear();
  const wordmarkChars = Array.from(PROFILE.displayWordmark);

  const validate = (draft: FormValues): FormErrors => {
    const next: FormErrors = {};
    if (draft.name.trim().length < 2) {
      next.name = "Masukkan nama minimal 2 karakter.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      next.email = "Masukkan alamat email yang valid (contoh: nama@email.com).";
    }
    if (draft.message.trim().length < 10) {
      next.message = "Tulis pesan minimal 10 karakter agar konteksnya jelas.";
    }
    return next;
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setCopyFeedback(`Alamat email ${PROFILE.email} disalin ke papan klip.`);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopyFeedback(
        `Salin otomatis tidak tersedia. Gunakan ${PROFILE.email} secara langsung.`,
      );
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else if (nextErrors.message) messageRef.current?.focus();
      return;
    }

    setSubmitState("submitting");
    window.setTimeout(() => {
      setSubmitState("success");
    }, 400);
  };

  const mailtoHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    `Pesan Portofolio dari ${values.name.trim() || "Pengunjung"}`,
  )}&body=${encodeURIComponent(
    `Nama: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`,
  )}`;

  return (
    <footer
      id="kontak"
      ref={ref}
      className="contact-shoin-footer relative overflow-hidden border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] pt-20 pb-28 text-[var(--ink-primary)] sm:pt-24 sm:pb-32"
    >
      <div className="page-shell">
        {/* Minimalist Japanese Chapter Header Bar (aligned with 01 PROFIL & 02 PROYEK) */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-3.5">
          <div className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              data-kanji="肆"
              className="profile-chapter-seal"
            />
            <p className="font-mono-meta m-0 text-xs font-semibold tracking-[0.22em] text-[var(--ink-primary)] uppercase">
              04 KONTAK
            </p>
            <span
              aria-hidden="true"
              className="font-mono-meta hidden text-[10px] tracking-[0.2em] text-[var(--ink-secondary)] sm:inline"
            >
              // 結縁・通信
            </span>
          </div>

          <div
            aria-hidden="true"
            className="font-mono-meta flex items-center gap-2 text-[10px] tracking-[0.2em] text-[var(--ink-secondary)]"
          >
            <span className="hidden sm:inline">[MUSUBI // 結び・最終章]</span>
            <span className="tech-rack-diamond" />
          </div>
        </div>

        {/* Out-of-the-Box Japanese Shoin-zukuri & Fumi-bako (書院造・文箱) Correspondence Pavilion */}
        <div className="contact-fumibako-pavilion relative mt-8 overflow-hidden sm:mt-10">
          {/* Four Kumiko Corner Registration Ticks */}
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

          {/* Top Architectural Ranma Lintel with Mizuhiki Knot Seal (結) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-hairline)] bg-[var(--bg-recessed)] px-5 py-3 sm:px-7">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                data-kanji="結"
                className="hanga-daiji-seal"
              />
              <span className="font-mono-meta text-[10.5px] font-semibold tracking-[0.2em] text-[var(--ink-primary)] uppercase">
                FUMI-BAKO // KOTAK KORESPONDENSI
              </span>
            </div>

            <div
              aria-hidden="true"
              className="hidden items-center gap-2.5 md:flex"
            >
              <span className="tech-rack-diamond" />
              <span className="h-px w-16 bg-[var(--border-control)]" />
              <span className="tech-rack-chigiri" />
              <span className="h-px w-16 bg-[var(--border-control)]" />
              <span className="tech-rack-diamond" />
            </div>

            <div className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="koseki-status-dot" />
              <span className="font-mono-meta text-[10px] font-semibold tracking-[0.18em] text-[var(--ink-primary)] uppercase">
                TERBUKA UNTUK KOLABORASI
              </span>
            </div>
          </div>

          {/* Main 2-Wing Japanese Dispatch Layout (7 cols Greeting & Dispatch + 5 cols Ema/Kifuda Channel Rack) */}
          <div className="grid grid-cols-1 items-stretch gap-0 lg:grid-cols-12">
            {/* Left Wing (7 cols): Ceremonial Greeting, Direct Hikyaku Email Plaque, & Action Triggers */}
            <div className="relative flex flex-col justify-between gap-7 border-b border-[var(--border-hairline)] p-6 sm:p-8 lg:col-span-7 lg:border-r lg:border-b-0">
              {/* Background Decorative Maru-mado Compass Watermark */}
              <svg
                viewBox="0 0 240 240"
                fill="none"
                aria-hidden="true"
                className="contact-marumado-watermark pointer-events-none"
              >
                <circle
                  cx="120"
                  cy="120"
                  r="108"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="86"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <rect
                  x="56"
                  y="56"
                  width="128"
                  height="128"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  transform="rotate(45 120 120)"
                />
              </svg>

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono-meta m-0 text-[10px] tracking-[0.24em] text-[var(--ink-secondary)] uppercase">
                      [ICHI-GO ICHI-E // 一期一会 ・ DISKUSI &amp; PROYEK]
                    </p>

                    <h2 className="font-editorial m-0 mt-2 text-[clamp(2.35rem,5vw,4.35rem)] font-medium leading-[1.02] tracking-[-0.02em] text-[var(--ink-primary)]">
                      <span className="split-mask block">
                        <span
                          className="split-line"
                          data-entered={isVisible ? "true" : "false"}
                          style={{ "--stagger": "60ms" } as CSSProperties}
                        >
                          Terima kasih sudah
                        </span>
                      </span>
                      <span className="split-mask mt-0.5 block">
                        <span
                          className="split-line italic font-normal"
                          data-entered={isVisible ? "true" : "false"}
                          style={{ "--stagger": "160ms" } as CSSProperties}
                        >
                          mampir!
                        </span>
                      </span>
                    </h2>
                  </div>

                  <div
                    aria-hidden="true"
                    className="koseki-vertical-watermark hidden sm:flex"
                  >
                    <span data-kanji="一期一会" />
                  </div>
                </div>

                <p className="m-0 mt-4 max-w-[48ch] text-sm leading-[1.8] text-[var(--ink-secondary)] sm:text-[0.95rem]">
                  Tertarik mendiskusikan pengembangan aplikasi web{" "}
                  <em>full-stack</em>, arsitektur sistem, atau peluang
                  kolaborasi baru? Kirimkan surat langsung melalui plakat di
                  bawah ini.
                </p>

                {/* Direct Hikyaku (飛脚) Official Email Seal Plaque */}
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="contact-hikyaku-box group mt-6 flex min-h-[60px] flex-wrap items-center justify-between gap-3 p-3.5 no-underline transition-colors hover:bg-[var(--bg-hover)] sm:p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      data-kanji="郵"
                      className="kakejiku-hanko-solid shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-mono-meta block text-[9px] tracking-[0.22em] text-[var(--ink-secondary)] uppercase">
                        SURAT LANGSUNG // DENSHIN
                      </span>
                      <span className="font-mono-meta block truncate text-xs font-semibold tracking-[0.06em] text-[var(--ink-primary)] group-hover:underline sm:text-sm">
                        {PROFILE.email}
                      </span>
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="font-mono-meta border border-[var(--border-control)] bg-[var(--bg-canvas)] px-2 py-0.5 text-[9px] font-semibold tracking-[0.18em] text-[var(--ink-secondary)]"
                  >
                    BANDUNG // ID
                  </span>
                </a>
              </div>

              {/* Carved Japanese Kifuda Action Buttons + Live Status Feedback */}
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormOpen((prev) => !prev)}
                    aria-expanded={formOpen}
                    aria-controls="contact-form-panel"
                    className="hanga-action-plaque font-mono-meta inline-flex min-h-[46px] items-center gap-2.5 px-4 text-xs font-semibold tracking-[0.14em] uppercase"
                  >
                    <span
                      aria-hidden="true"
                      data-kanji={formOpen ? "閉" : "文"}
                      className="hanga-action-seal"
                    />
                    <span>
                      {formOpen
                        ? "Tutup Formulir Pesan"
                        : "Buka Formulir Pesan"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="contact-secondary-plaque font-mono-meta inline-flex min-h-[46px] items-center gap-2.5 px-4 text-xs font-semibold tracking-[0.14em] uppercase"
                  >
                    <span
                      aria-hidden="true"
                      data-kanji={copied ? "済" : "写"}
                      className="hanga-action-seal"
                    />
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    <span>
                      {copied ? "Email Tersalin" : "Salin Alamat Email"}
                    </span>
                  </button>
                </div>

                <p
                  role="status"
                  aria-live="polite"
                  className="font-mono-meta mt-2.5 mb-0 min-h-[1.25rem] text-[11px] tracking-[0.06em] text-[var(--ink-secondary)]"
                >
                  {copyFeedback}
                </p>
              </div>
            </div>

            {/* Right Wing (5 cols): Japanese Kifuda-kake (木札掛け) Communication Channel Shrine Rack */}
            <div className="flex flex-col justify-between bg-[var(--bg-recessed)] p-6 sm:p-8 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                  <div className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      data-kanji="縁"
                      className="koseki-mini-seal"
                    />
                    <span className="font-mono-meta text-[10px] font-semibold tracking-[0.2em] text-[var(--ink-primary)] uppercase">
                      KANAL KOMUNIKASI
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="font-mono-meta text-[9.5px] tracking-[0.18em] text-[var(--ink-secondary)]"
                  >
                    通信目録
                  </span>
                </div>

                {/* Four Hanging Kifuda Channel Plaques (Email + Social Links) */}
                <div className="mt-4 flex flex-col gap-2.5">
                  {/* 01 Email Kifuda Plaque */}
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="contact-kifuda-tile group no-underline"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        data-kanji={CHANNEL_KANJI_MAP.email.kanji}
                        className="contact-kifuda-seal shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-meta text-[9px] tracking-[0.18em] opacity-70">
                            01 // {CHANNEL_KANJI_MAP.email.code}
                          </span>
                        </div>
                        <span className="mt-0.5 block text-sm font-semibold tracking-[0.02em]">
                          Email
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono-meta hidden text-[10px] tracking-[0.12em] opacity-75 sm:inline">
                        KIRIM SURAT
                      </span>
                      <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </a>

                  {/* 02..04 Social Kifuda Plaques from SOCIAL_LINKS */}
                  {SOCIAL_LINKS.map((item, idx) => {
                    const meta = CHANNEL_KANJI_MAP[item.id.toLowerCase()] ?? {
                      kanji: "印",
                      code: `CHANNEL // 0${idx + 2}`,
                      numeral: "弐",
                    };
                    const numStr = `0${idx + 2}`;
                    const resolvedHref = resolveSocialUrl(
                      item.id,
                      item.handle,
                      item.url,
                    );

                    if (resolvedHref) {
                      return (
                        <a
                          key={item.id}
                          href={resolvedHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-kifuda-tile group no-underline"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              aria-hidden="true"
                              data-kanji={meta.kanji}
                              className="contact-kifuda-seal shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-mono-meta block text-[9px] tracking-[0.18em] opacity-70">
                                {numStr} // {meta.code}
                              </span>
                              <span className="mt-0.5 block text-sm font-semibold tracking-[0.02em]">
                                {item.label}
                              </span>
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-2">
                            <span className="font-mono-meta hidden truncate max-w-[11rem] text-[10px] tracking-[0.06em] opacity-75 sm:inline">
                              {item.handle}
                            </span>
                            <ArrowUpRightIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </a>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="contact-kifuda-tile contact-kifuda-tile-muted"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            aria-hidden="true"
                            data-kanji={meta.kanji}
                            className="contact-kifuda-seal shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-mono-meta block text-[9px] tracking-[0.18em] opacity-70">
                              {numStr} // {meta.code}
                            </span>
                            <span className="mt-0.5 block text-sm font-semibold tracking-[0.02em]">
                              {item.label}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono-meta border border-[var(--border-control)] px-2 py-0.5 text-[9.5px] tracking-[0.14em] opacity-75">
                          {item.handle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Stamp Footer inside Right Wing */}
              <div
                aria-hidden="true"
                className="font-mono-meta mt-6 flex items-center justify-between border-t border-[var(--border-hairline)] pt-3 text-[9.5px] tracking-[0.18em] text-[var(--ink-secondary)]"
              >
                <span>KIFUDA-KAKE // 木札掛け</span>
                <span>04 KANAL</span>
              </div>
            </div>
          </div>

          {/* Expandable Japanese Shoin Manuscript Contact Form (#contact-form-panel) */}
          {formOpen ? (
            <div
              id="contact-form-panel"
              className="border-t border-[var(--ink-primary)] bg-[var(--bg-recessed)] p-6 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="mb-5 flex items-center justify-between border-b border-[var(--border-hairline)] pb-3"
              >
                <div className="inline-flex items-center gap-2">
                  <span data-kanji="書" className="koseki-mini-seal" />
                  <span className="font-mono-meta text-[10px] font-semibold tracking-[0.22em] text-[var(--ink-primary)] uppercase">
                    SHOIN FUMI // LEMBAR SURAT KORESPONDENSI
                  </span>
                </div>
                <span className="font-mono-meta text-[10px] tracking-[0.18em] text-[var(--ink-secondary)]">
                  巻肆・書簡
                </span>
              </div>

              {submitState === "success" ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="border-[1.5px] border-[var(--ink-primary)] bg-[var(--bg-canvas)] p-5 sm:p-6"
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      data-kanji="済"
                      className="kakejiku-hanko-solid mt-0.5 shrink-0"
                    />
                    <div>
                      <h3 className="font-editorial m-0 text-2xl font-semibold text-[var(--ink-primary)]">
                        Pesan siap dikirim
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
                        Klik plakat di bawah untuk membuka draf email terisi
                        otomatis ke{" "}
                        <strong className="text-[var(--ink-primary)]">
                          {PROFILE.email}
                        </strong>
                        .
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href={mailtoHref}
                          className="hanga-action-plaque font-mono-meta inline-flex min-h-[44px] items-center gap-2 px-5 text-xs font-semibold tracking-[0.14em] uppercase no-underline"
                        >
                          <span
                            aria-hidden="true"
                            data-kanji="送"
                            className="hanga-action-seal"
                          />
                          <span>Buka di Aplikasi Email</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setValues(INITIAL_VALUES);
                            setErrors({});
                            setSubmitState("idle");
                          }}
                          className="contact-secondary-plaque font-mono-meta inline-flex min-h-[44px] items-center gap-2 px-5 text-xs font-semibold tracking-[0.14em] uppercase"
                        >
                          <span>Tulis Pesan Baru</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="font-mono-meta mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[var(--ink-primary)] uppercase"
                      >
                        <span
                          aria-hidden="true"
                          data-kanji="壱"
                          className="koseki-mini-seal !h-4 !w-4 !text-[8.5px]"
                        />
                        <span>Nama Anda</span>
                      </label>
                      <input
                        ref={nameRef}
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={(event) => {
                          setValues((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }));
                          if (errors.name)
                            setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder="Nama lengkap Anda"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? "contact-name-error" : undefined
                        }
                        className="shoin-field-input"
                      />
                      {errors.name ? (
                        <p
                          id="contact-name-error"
                          role="alert"
                          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--status-error)]"
                        >
                          <AlertIcon className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="font-mono-meta mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[var(--ink-primary)] uppercase"
                      >
                        <span
                          aria-hidden="true"
                          data-kanji="弐"
                          className="koseki-mini-seal !h-4 !w-4 !text-[8.5px]"
                        />
                        <span>Alamat Email</span>
                      </label>
                      <input
                        ref={emailRef}
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={(event) => {
                          setValues((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }));
                          if (errors.email)
                            setErrors((prev) => ({
                              ...prev,
                              email: undefined,
                            }));
                        }}
                        placeholder="nama@email.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "contact-email-error" : undefined
                        }
                        className="shoin-field-input"
                      />
                      {errors.email ? (
                        <p
                          id="contact-email-error"
                          role="alert"
                          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--status-error)]"
                        >
                          <AlertIcon className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="font-mono-meta mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[var(--ink-primary)] uppercase"
                    >
                      <span
                        aria-hidden="true"
                        data-kanji="参"
                        className="koseki-mini-seal !h-4 !w-4 !text-[8.5px]"
                      />
                      <span>Pesan</span>
                    </label>
                    <textarea
                      ref={messageRef}
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={(event) => {
                        setValues((prev) => ({
                          ...prev,
                          message: event.target.value,
                        }));
                        if (errors.message)
                          setErrors((prev) => ({
                            ...prev,
                            message: undefined,
                          }));
                      }}
                      placeholder="Ceritakan singkat proyek atau hal yang ingin didiskusikan..."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? "contact-message-error" : undefined
                      }
                      className="shoin-field-input resize-y"
                    />
                    {errors.message ? (
                      <p
                        id="contact-message-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--status-error)]"
                      >
                        <AlertIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitState === "submitting"}
                      className="hanga-action-plaque font-mono-meta inline-flex min-h-[46px] items-center gap-2.5 px-6 text-xs font-semibold tracking-[0.14em] uppercase disabled:opacity-55"
                    >
                      <span
                        aria-hidden="true"
                        data-kanji="印"
                        className="hanga-action-seal"
                      />
                      <span>
                        {submitState === "submitting"
                          ? "Menyiapkan pesan..."
                          : "Siapkan Pesan"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : null}
        </div>

        {/* Grand Finale Japanese Ukiyo-e Woodblock Colophon & Monumental Katakana Seal Stage */}
        <div className="contact-colophon-stage group relative mt-10 overflow-hidden border border-[var(--ink-primary)] bg-[var(--bg-recessed)] px-5 pt-6 pb-8 sm:mt-12 sm:px-8 sm:pt-8 sm:pb-10">
          {/* Four Corner Registration Ticks */}
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

          {/* Top Colophon Bar & Back-to-Top Japanese Kifuda Trigger */}
          <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-[var(--border-hairline)] pb-5 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                data-kanji="リ"
                className="kakejiku-hanko-solid"
              />
              <div>
                <p className="font-mono-meta m-0 text-[11px] font-semibold tracking-[0.16em] text-[var(--ink-primary)] uppercase">
                  {PROFILE.creditLine}
                </p>
                <p className="font-mono-meta m-0 mt-0.5 text-[9.5px] tracking-[0.2em] text-[var(--ink-secondary)]">
                  OKU付 // COLOPHON &amp; SEAL REGISTRY
                </p>
              </div>
            </div>

            <p className="font-editorial m-0 text-xl italic text-[var(--ink-primary)]">
              {PROFILE.locationDate}
            </p>

            <a
              href="#top"
              className="hanga-action-plaque font-mono-meta inline-flex min-h-[44px] items-center gap-2.5 px-4 text-xs font-semibold tracking-[0.14em] uppercase no-underline"
            >
              <span
                aria-hidden="true"
                data-kanji="昇"
                className="hanga-action-seal"
              />
              <span>Kembali ke Atas</span>
              <ArrowUpIcon className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Monumental Interactive Japanese Katakana Wordmark (リフキ) with Rotating Maru-mado Sun Halo */}
          <div className="relative mt-8 flex flex-col items-center justify-center py-4 sm:py-6">
            {/* Rotating Sun / Maru-mado Ring Behind the Giant Wordmark */}
            <div
              aria-hidden="true"
              className="contact-sun-halo pointer-events-none"
            >
              <svg
                viewBox="0 0 280 280"
                fill="none"
                className="h-full w-full text-[var(--ink-primary)]"
              >
                <circle
                  cx="140"
                  cy="140"
                  r="128"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="5 5"
                />
                <circle
                  cx="140"
                  cy="140"
                  r="104"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="64"
                  y="64"
                  width="152"
                  height="152"
                  stroke="currentColor"
                  strokeWidth="1"
                  transform="rotate(45 140 140)"
                />
              </svg>
            </div>

            <p
              aria-hidden="true"
              className="contact-monumental-wordmark font-editorial relative z-10 m-0 select-none text-center text-[clamp(4.4rem,18vw,15rem)] font-medium leading-[0.88] tracking-[0.12em] text-[var(--ink-primary)] uppercase"
            >
              {wordmarkChars.map((char, idx) => {
                const side =
                  idx === 0
                    ? "left"
                    : idx === wordmarkChars.length - 1
                      ? "right"
                      : "center";
                return (
                  <span
                    key={`${char}-${idx}`}
                    data-side={side}
                    className="contact-fusuma-char split-mask inline-block"
                  >
                    <span
                      className="split-char"
                      data-entered={isVisible ? "true" : "false"}
                      style={
                        { "--stagger": `${120 + idx * 75}ms` } as CSSProperties
                      }
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  </span>
                );
              })}
            </p>
          </div>

          {/* Bottom Colophon Seal Strip */}
          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-hairline)] pt-4">
            <span className="font-mono-meta text-[10.5px] tracking-[0.16em] text-[var(--ink-secondary)]">
              &copy; {year} {PROFILE.name}
            </span>

            <div
              aria-hidden="true"
              className="hidden items-center gap-2 sm:flex"
            >
              <span className="tech-rack-diamond" />
              <span className="font-mono-meta text-[9.5px] tracking-[0.22em] text-[var(--ink-secondary)]">
                [完 // KAN]
              </span>
              <span className="tech-rack-diamond" />
            </div>

            <span className="font-mono-meta text-[10.5px] tracking-[0.16em] text-[var(--ink-secondary)]">
              EDISI 2026 // BANDUNG
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
