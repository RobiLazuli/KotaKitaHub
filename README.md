# KotaKitaHub - Website Layanan Masyarakat

KotaKitaHub adalah sebuah platform digital yang menjadi pusat informasi, layanan publik, lingkungan, mobilitas, dan komunitas dalam satu tempat. Terdapat fitur seperti Live Report Map, Widget informasi cuaca dan kalender, Lapor Kuy! (Form lapor kota), dan Chat Helper

Website ini berfungsi untuk menghubungkan masyarakat, komunitas, dan pengelola kota sehingga masyarakat tidak hanya mendapatkan informasi mengenai kondisi kotanya, tetapi juga dapat berpartisipasi langsung dalam menjaga dan mengembangkan lingkungan tempat mereka tinggal.

> Proyek eksperimental

## Fitur

| Modul | Deskripsi |
| --- | --- |
| `/reports` | Direktori laporan publik + pelacakan tiket (`CMH-2026-XXXX`) dengan pipeline status `Submitted → Under Review → In Progress → Resolved` |
| `/reports/new` | Form laporan berkategori (Jalan Rusak, Penerangan, Sampah, Fasilitas Umum) dengan pemilih lokasi GPS/peta dan lampiran foto |
| `/reports/feedback` | Form usulan pembangunan kota & masukan kebijakan publik |
| `/auth` | Login/register email + OTP nomor HP via Supabase Auth |
| `/dashboard` | Riwayat laporan milik user, log notifikasi perubahan status, manajemen profil (NIK, kecamatan, kontak) |
| `/map` | Leaflet map (OpenStreetMap) berpusat di Cimahi: marker laporan, lapisan fasilitas kota, simulasi lalu lintas |
| Floating widget | Asisten virtual berbasis aturan yang menjawab FAQ layanan (KTP, perizinan, retribusi, puskesmas, dll.) |

**Mode demo:** bila `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` belum diisi, aplikasi berjalan penuh dengan data mock (auth tiruan via localStorage, laporan sampel, fasilitas lokal).

## Tech Stack

- **SvelteKit (Svelte 5, runes)** + TypeScript
- **Tailwind CSS v4** (`@tailwindcss/vite`) + **lucide-svelte**
- **Supabase** — PostgreSQL, Row Level Security, Auth, Storage (bucket `report-photos`)
- **Leaflet** + OpenStreetMap tiles
- **Vercel** — `@sveltejs/adapter-vercel`

## Menjalankan Secara Lokal

```bash
npm install
cp .env.example .env    # isi kredensial Supabase (opsional — ada mode demo)
npm run dev
```

## Setup Supabase

1. Buat proyek baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → jalankan seluruh isi [`supabase/schema.sql`](supabase/schema.sql). Ini membuat tabel (`profiles`, `tickets`, `ticket_updates`, `categories`, `amenities`), trigger, RLS policy, bucket storage `report-photos`, dan data sampel.
3. Salin `Project URL` dan `anon public key` dari **Project Settings → API** ke file `.env`:

```bash
PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

4. (Opsional, untuk login OTP SMS) Aktifkan provider Phone di **Authentication → Providers** dan sambungkan Twilio/MessageBird.

## Environment Variables

| Variabel | Keterangan |
| --- | --- |
| `PUBLIC_SUPABASE_URL` | URL proyek Supabase |
| `PUBLIC_SUPABASE_ANON_KEY` | Public anon key (aman di klien karena RLS) |

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Import di [vercel.com/new](https://vercel.com/new) — adapter Vercel terdeteksi otomatis.
3. Tambahkan kedua env var di **Project Settings → Environment Variables**.
4. Deploy. Build command `vite build`, output dihasilkan adapter.

## Skrip

```bash
npm run dev      # dev server
npm run check    # type-check (svelte-check)
npm run build    # build produksi
npm run preview  # pratinjau hasil build
```

## Struktur Proyek

```
src/
├── lib/
│   ├── components/
│   │   ├── ai/         # ChatWidget + mesin jawab berbasis aturan (chatEngine.ts)
│   │   ├── common/     # Navbar, Footer, Modal, Spinner
│   │   ├── map/        # CityMap (layered) & LocationPicker (GPS + drag pin)
│   │   └── reports/    # ReportForm, TicketCard, TicketTimeline, StatusBadge
│   ├── data/mock.ts    # Data demo & simulasi lalu lintas
│   ├── server/         # Supabase server client (SSR, cookie-based session)
│   ├── stores/         # auth.ts & reports.ts (Svelte stores)
│   ├── supabase/       # Browser client + deteksi mode demo
│   └── types/          # Interface bersama + konstanta geo Cimahi
├── routes/             # / , /about, /auth, /dashboard, /map, /reports[/new|/feedback]
└── supabase/schema.sql # Skema DB + RLS + seed
```
