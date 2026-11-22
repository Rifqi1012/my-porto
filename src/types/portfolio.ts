export interface NavItem {
  id: string;
  index: string;
  label: string;
  href: `#${string}`;
}

export interface ProfileMeta {
  label: string;
  value: string;
}

export interface ProfileInfo {
  signature: string;
  preloaderTitle: string;
  displayWordmark: string;
  verticalAccent: string;
  name: string;
  role: string;
  locationDate: string;
  creditLine: string;
  greetingPrefix: string;
  greetingItalic: string;
  bio: string;
  portraitNoteLeft: string;
  portraitNoteRight: string;
  metadata: ProfileMeta[];
  techStack: string[];
  email: string;
  heroVisual: {
    src: string;
    darkSrc: string;
    alt: string;
  };
  profileVisual: {
    src: string;
    darkSrc: string;
    alt: string;
  };
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  year: string;
  role: string;
  client?: string;
  isPrivate?: boolean;
  summary: string;
  stack: string[];
  image: {
    src: string;
    alt: string;
  };
  liveUrl: string | null;
  repoUrl?: string | null;
}

export interface QuoteInfo {
  eyebrow: string;
  highlightText: string;
  mutedText: string;
  attribution: string;
}

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url?: string | null;
}
