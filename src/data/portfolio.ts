import type {
  NavItem,
  ProfileInfo,
  ProjectItem,
  QuoteInfo,
  SocialLink,
} from "../types/portfolio";

export const NAV_ITEMS: NavItem[] = [
  { id: "profil", index: "01", label: "PROFIL", href: "#profil" },
  { id: "karya", index: "02", label: "PROYEK", href: "#karya" },
  { id: "prinsip", index: "03", label: "PRINSIP", href: "#prinsip" },
  { id: "kontak", index: "04", label: "KONTAK", href: "#kontak" },
];

export const PROFILE: ProfileInfo = {
  signature: "RIFQI MUHAMMAD HAMZAH",
  preloaderTitle: "リフキ",
  displayWordmark: "リフキ",
  verticalAccent: "PORTOFOLIO",
  name: "RIFQI MUHAMMAD HAMZAH",
  role: "[FULL-STACK WEB DEVELOPER]",
  locationDate: "[Bandung, 2026]",
  creditLine: "Portofolio oleh RIFQI MUHAMMAD HAMZAH",
  greetingPrefix: "Halo, saya",
  greetingItalic: "RIFQI MUHAMMAD HAMZAH",
  bio: "Saya lulusan S1 Teknik Informatika dengan fokus sebagai Full-Stack Web Developer (React.js, Next.js, Laravel, TypeScript, Tailwind CSS, serta pengelolaan basis data). Memiliki pengalaman merancang dan membangun aplikasi web end-to-end mulai dari arsitektur backend hingga antarmuka pengguna untuk platform pemerintahan, edukasi, sistem pendukung keputusan, dan konservasi. Selain berbekal sertifikasi BNSP Data Analyst serta pemahaman di bidang IoT, C++, dan Python, saya juga terbiasa memimpin tim untuk menghadirkan solusi digital yang andal, fungsional, dan ramah pengguna.",
  portraitNoteLeft: "NO. 001 / POTRET",
  portraitNoteRight: "EDISI 2026",
  metadata: [
    { label: "NAMA", value: "Rifqi Muhammad Hamzah" },
    { label: "DOMISILI", value: "Bandung, Indonesia" },
    { label: "PERAN", value: "Full-Stack Web Developer" },
  ],
  techStack: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Python",
    "C++ / IoT",
  ],
  email: "rifqimh1210@gmail.com",
  heroVisual: {
    src: "/assets/hero-portrait-light.png",
    darkSrc: "/assets/hero-portrait-dark.png",
    alt: "Potret geometris wireframe Rifqi Muhammad Hamzah",
  },
  profileVisual: {
    src: "/assets/profile-portrait-light.png",
    darkSrc: "/assets/profile-portrait-dark.png",
    alt: "Potret profil geometris Rifqi Muhammad Hamzah",
  },
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "proyek-01",
    index: "(01)",
    shortTitle: "Web App",
    title: "Go Turtles",
    year: "2024 - 2025",
    role: "Front-End Developer",
    client: "Dinas Kelautan dan Perikanan Jawa Barat",
    summary:
      "Go-Turtles adalah platform digital komprehensif yang dirancang untuk mendukung program pelestarian penyu di Pantai Pangumbahan, Ujung Genteng, Sukabumi. Website ini berfungsi sebagai pusat informasi, edukasi, sekaligus jembatan interaktif antara masyarakat dan pihak konservasi untuk memfasilitasi ekowisata dan pendanaan.",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image: {
      src: "/assets/go-turtles.png",
      alt: "Pratinjau proyek Go Turtles",
    },
    liveUrl: "https://go-turtle.jabarprov.go.id/",
  },
  {
    id: "proyek-02",
    index: "(02)",
    shortTitle: "Web App",
    title: "Hakordia Bedas Run 2026",
    year: "2026",
    role: "Full-Stack Developer",
    client: "PT. MERAKI DINAMIKA INOVATIF",
    summary:
      "Platform event management dan registrasi resmi untuk acara lari peringatan Hari Antikorupsi Sedunia (HAKORDIA) 2026 di Kabupaten Bandung. Sistem ini dirancang untuk menangani pendaftaran skala besar secara terstruktur bagi peserta umum, ASN, dan penyandang disabilitas.",
    stack: ["Laravel", "React", "TypeScript", "PostgreSQL", "PHP"],
    image: {
      src: "/assets/hakordia.png",
      alt: "Pratinjau proyek Hakordia Bedas Run 2026",
    },
    liveUrl: "https://hakordiabedasrun.bandungkab.go.id/",
  },
  {
    id: "proyek-03",
    index: "(03)",
    shortTitle: "Web App",
    title: "Sistem Penilaian Kinerja Karyawan",
    year: "2026",
    role: "Full-Stack Developer",
    client: "PT. SIDOMULYO SELARAS TBK",
    summary:
      "Aplikasi web portal internal yang mendigitalisasi dan mengotomatisasi proses evaluasi kinerja karyawan berbasis metode Analytical Hierarchy Process (AHP), menggantikan rekapitulasi formulir manual menjadi sistem yang terukur, objektif, dan auditable.",
    stack: ["IoT", "C++", "Next.js", "TypeScript", "Tailwind CSS"],
    image: {
      src: "/assets/ahp.png",
      alt: "Pratinjau proyek Sistem Penilaian Kinerja Karyawan",
    },
    liveUrl: null,
  },
  {
    id: "proyek-04",
    index: "(04)",
    shortTitle: "Web App",
    title: "Sistem Manajemen Bimbel Offline",
    year: "2025",
    role: "Front-End Developer",
    client: "PT. YUKMARI PROJECT INDONESIA",
    summary:
      "SIMBEL (Sistem Manajemen Bimbel Offline) adalah platform web untuk mengelola alur belajar tatap muka di bidang Edutech dan Cybersecurity bagi pelajar, mahasiswa, maupun rombongan sekolah/kampus di bawah YukMari Project. Sistem ini menyatukan proses pendaftaran, pemilihan lokasi dan jadwal sesi, konfirmasi admin via WhatsApp, hingga pemantauan kelas dan presensi peserta dalam satu alur yang terstruktur.",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image: {
      src: "/assets/ymp.png",
      alt: "Pratinjau proyek Sistem Manajemen Bimbel Offline",
    },
    liveUrl: null,
  },
  {
    id: "proyek-05",
    index: "(05)",
    shortTitle: "Web App",
    title: "Sistem Penentuan Lokasi Cabang Baru",
    year: "2026",
    role: "Full-Stack Developer",
    client: "CV. SAUNG GLOBAL CATER INDONESIA",
    summary:
      "Aplikasi web sistem pendukung keputusan untuk membantu manajer menilai dan memetakan kandidat lokasi cabang menggunakan metode TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) serta visualisasi peta interaktif.",
    stack: ["laravel", "PHP", "Tailwind CSS", "MySQL"],
    image: {
      src: "/assets/topsis.png",
      alt: "Pratinjau proyek SPK Penentuan Lokasi Cabang Saung Aqiqah",
    },
    liveUrl: null,
  },
  {
    id: "proyek-06",
    index: "(06)",
    shortTitle: "Web App & IoT",
    title: "Smart Livestock Monitoring System",
    year: "2026",
    role: "Full-Stack Developer",
    client: "SMKN 5 Pangalengan",
    summary:
      "Sistem Internet of Things (IoT) terintegrasi untuk pemantauan lingkungan dan mitigasi risiko pada kandang ternak secara real-time. Proyek ini dirancang untuk menjaga kondisi kandang tetap optimal dan mendukung kesejahteraan hewan melalui peringatan dini berbasis data.",
    stack: ["IoT", "C++", "Next.js", "TypeScript", "Tailwind CSS"],
    image: {
      src: "/assets/slms.png",
      alt: "Pratinjau proyek Smart Livestock Monitoring System",
    },
    liveUrl: null,
  },
  {
    id: "proyek-07",
    index: "(07)",
    shortTitle: "Web App",
    title: "Noshy",
    year: "2026",
    role: "Back-End Developer",
    client: "NOERON LABS",
    summary:
      "NOSHY (Cafe Archive) adalah platform direktori kafe modern yang membantu pengguna menemukan tempat ngopi, bersantai, dan work from cafe (WFC) terbaik di Bandung tanpa perlu membuat akun.",
    stack: ["Nest.js", "TypeScript", "PostgreSQL"],
    image: {
      src: "/assets/noshy.png",
      alt: "Pratinjau proyek Noshy",
    },
    liveUrl: "https://noshy.id/",
  },
  {
    id: "proyek-08",
    index: "(08)",
    shortTitle: "Web App",
    title: "HMIF UNIKOM",
    year: "2025",
    role: "Front-End Developer",
    client: "HMIF UNIKOM",
    summary:
      "Website yang dibangun untuk mengenalkan HMIF Unikom dan memudahkan sistem operasional internal HMIF Unikom mulai dari Cashflow, Sekretariat,Absensi, Mini Event & Mega Event Divisi secara Dinamis",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image: {
      src: "/assets/hmif.png",
      alt: "Pratinjau proyek HMIF UNIKOM",
    },
    liveUrl: "https://hmif.unikom.my.id/",
  },
  {
    id: "proyek-09",
    index: "(09)",
    shortTitle: "Web App",
    title: "Innoventure 2025",
    year: "2025",
    role: "Front-End Developer",
    client: "HMIF UNIKOM",
    summary:
      "Website yang dibangun sebagai landing page, upload hasil lomba dan memperlihatkan leaderboard peserta serta, sistem penilaian serta oleh juri",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image: {
      src: "/assets/inno.png",
      alt: "Pratinjau proyek Innoventure 2025",
    },
    liveUrl: "https://innoventure.unikom.my.id/",
  },
];

export const QUOTE: QuoteInfo = {
  eyebrow: "03 / PRINSIP KERJA",
  highlightText: "Desain yang baik tidak terasa rumit,",
  mutedText: "ia hanya membuat tujuan pengguna terasa jelas.",
  attribution: "RIFQI MUHAMMAD HAMZAH",
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    handle: "",
    url: "https://github.com/Rifqi1012",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "",
    url: "https://www.linkedin.com/in/rfqimhmd",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "",
    url: "https://www.instagram.com/rfqimhmd_",
  },
];
