# Portofolio Editorial Minimalis dengan Aksen Liquid Glass

Website portofolio bergaya editorial majalah (preloader curtain, sampul editorial berbingkai, pita marquee miring, daftar karya dengan pratinjau hover, blok kutipan kontras gelap, galeri horizontal, dan footer wordmark monumental) dipadukan aksen optik **Liquid Glass** pada navigasi mengambang dan modal studi kasus/galeri.

## Menjalankan Proyek

```bash
pnpm install
pnpm run dev
```

Build produksi dan pengecekan tipe:

```bash
pnpm run typecheck && pnpm run build
```

## Menyesuaikan Konten Anda

1. Buka [src/data/portfolio.ts](src/data/portfolio.ts) lalu ganti seluruh nilai placeholder (`[NAMA ANDA]`, `displayWordmark`, `scriptSubtitle`, daftar proyek, kutipan prinsip kerja, galeri, dan tautan sosial).
2. Ganti file placeholder visual di folder `public/assets/`:
   - `public/assets/hero-frame.svg` (potret utama pada sampul Hero)
   - `public/assets/profile-portrait.svg` (potret pada bagian `01 PROFIL`)
   - `public/assets/project-01.svg` sampai `project-03.svg` (pratinjau proyek)
   - `public/assets/gallery-01.svg` sampai `gallery-04.svg` (foto/visual pada `04 GALERI`)
3. Perbarui `<title>` dan `<meta name="description">` pada [index.html](index.html).
