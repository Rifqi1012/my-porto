interface IconProps {
  className?: string;
}

export function SunIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" />
    </svg>
  );
}

export function MoonIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M15.8 11.9A6.2 6.2 0 0 1 8.1 4.2a6.4 6.4 0 1 0 7.7 7.7Z" />
    </svg>
  );
}

export function MenuIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 6.5h13M3.5 13.5h13" />
    </svg>
  );
}

export function CloseIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  );
}

export function CopyIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="7" y="7" width="9.5" height="9.5" rx="2" />
      <path d="M13 7V5.2A1.7 1.7 0 0 0 11.3 3.5H5.2A1.7 1.7 0 0 0 3.5 5.2v6.1A1.7 1.7 0 0 0 5.2 13H7" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.5 10.5 8.2 14.2 15.5 6.5" />
    </svg>
  );
}

export function AlertIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6.5v4.2M10 13.6h.01" />
    </svg>
  );
}

export function ExternalIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M11 4.5h4.5V9M15.5 4.5 9 11M14.5 12v2.3a1.2 1.2 0 0 1-1.2 1.2H5.7a1.2 1.2 0 0 1-1.2-1.2V6.7a1.2 1.2 0 0 1 1.2-1.2H8" />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M15.5 10h-11M9 5.5 4.5 10 9 14.5" />
    </svg>
  );
}

export function ArrowUpIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 15.5v-11M5.5 9 10 4.5 14.5 9" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 14 14 6M7.5 6H14v6.5" />
    </svg>
  );
}

export function PauseIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7.5 5v10M12.5 5v10" />
    </svg>
  );
}

export function PlayIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M6.5 4.8 15 10l-8.5 5.2V4.8Z" />
    </svg>
  );
}

export function DiamondDividerIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 1 9.8 6.2 15 8 9.8 9.8 8 15 6.2 9.8 1 8 6.2 6.2 8 1Z" />
    </svg>
  );
}
