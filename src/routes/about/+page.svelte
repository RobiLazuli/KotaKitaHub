<script lang="ts">
	import { DEVELOPERS } from '$lib/data/faq';
	import {
		Ambulance,
		CalendarClock,
		Flame,
		Leaf,
		Mail,
		ShieldCheck,
		Siren,
		Target
	} from 'lucide-svelte';

	// Nomor darurat nasional Indonesia (berlaku di seluruh wilayah, termasuk Cimahi)
	const emergencyContacts = [
		{ icon: Siren, name: 'Layanan Darurat Terpadu', number: '112', note: 'Nasional · 24 jam · bebas pulsa' },
		{ icon: ShieldCheck, name: 'Kepolisian Negara', number: '110', note: 'Nasional · 24 jam' },
		{ icon: Flame, name: 'Pemadam Kebakaran', number: '113', note: 'Nasional · 24 jam' },
		{ icon: Ambulance, name: 'Ambulans Kegawatdaruratan', number: '118 / 119', note: 'Nasional · 24 jam' }
	];

	const changelog = [
		{ version: '0.4.0', date: 'Sep 2026', notes: 'Rebranding KotaKitaHub, rancangan Polymorph baru, widget cuaca & kalender, halaman FAQ.' },
		{ version: '0.3.0', date: 'Sep 2026', notes: 'Peta kota live, simulasi lalu lintas raya & lapisan fasilitas publik.' },
		{ version: '0.2.0', date: 'Sep 2026', notes: 'Asisten virtual kota, dashboard warga, dan pelacakan tiket CMH-2026.' },
		{ version: '0.1.0', date: 'Sep 2026', notes: 'Rilis awal: pelaporan warga berkategori dengan lampiran foto.' }
	];
</script>

<svelte:head>
	<title>Tentang — KotaKitaHub</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-14 px-4 py-14 sm:px-6">
	<!-- Vision -->
	<section class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-700 via-primary to-emerald-600 px-6 py-12 text-white sm:px-10">
		<div class="blob right-8 top-6 h-28 w-28 bg-white/15"></div>
		<div class="blob bottom-8 left-1/3 h-24 w-24 bg-emerald-300/30" style="animation-delay:1.6s"></div>
		<span class="relative text-xs font-semibold uppercase tracking-widest text-emerald-100">KotaKitaHub · Cabang Kota Cimahi</span>
		<h1 class="relative mt-2 text-3xl font-bold sm:text-4xl">Menuju Cimahi yang Berkelanjutan</h1>
		<p class="relative mt-4 max-w-2xl leading-relaxed text-emerald-50/90">
			KotaKitaHub adalah jaringan portal kota pintar — dan versi ini dirancang khusus untuk Kota
			Cimahi, sebuah kota di Jawa Barat yang terdiri dari 3 kecamatan (Cimahi Utara, Tengah, Selatan)
			dan 15 kelurahan.
		</p>

		<div class="relative mt-8 grid gap-4 md:grid-cols-2">
			<div class="rounded-3xl bg-white/10 p-5 backdrop-blur ring-1 ring-white/20">
				<Target class="h-7 w-7 text-emerald-100" />
				<h2 class="mt-3 font-semibold">Visi</h2>
				<p class="mt-2 text-sm leading-relaxed text-emerald-50/85">
					Sejalan dengan SDGs ke-11, mendukung Cimahi sebagai kota yang inklusif, aman, tangguh,
					dan berkelanjutan melalui pelayanan publik partisipatif dan transparan.
				</p>
			</div>
			<div class="rounded-3xl bg-white/10 p-5 backdrop-blur ring-1 ring-white/20">
				<Leaf class="h-7 w-7 text-emerald-100" />
				<h2 class="mt-3 font-semibold">Area Fokus</h2>
				<p class="mt-2 text-sm leading-relaxed text-emerald-50/85">
					Infrastruktur jalan & penerangan, pengelolaan sampah dan lingkungan, fasilitas umum yang
					inklusif, serta mobilitas warga.
				</p>
			</div>
		</div>
	</section>

	<!-- Emergency contacts -->
	<section>
		<h2 class="text-2xl font-bold text-slate-900">Kontak Darurat Nasional</h2>
		<p class="mt-1 text-slate-500">Nomor darurat resmi nasional, juga berlaku di Kota Cimahi.</p>
		<div class="mt-6 grid gap-4 sm:grid-cols-2">
			{#each emergencyContacts as c (c.name)}
				{@const Icon = c.icon}
				<div class="poly-card flex items-center gap-4 p-5">
					<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
						<Icon class="h-5 w-5" />
					</div>
					<div>
						<p class="font-semibold text-slate-900">{c.name}</p>
						<p class="font-bold text-rose-600">{c.number}</p>
						<p class="text-xs text-slate-400">{c.note}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Developer team -->
	<section>
		<h2 class="text-2xl font-bold text-slate-900">Tim Pengembang</h2>
		<p class="mt-1 text-slate-500">Tim di balik KotaKitaHub cabang Cimahi.</p>
		<div class="mt-6 grid gap-5 sm:grid-cols-3">
			{#each DEVELOPERS as dev (dev.photo)}
				<div class="poly-card flex flex-col items-center p-6 text-center">
					<img
						src={dev.photo}
						alt="Foto {dev.name}"
						class="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white"
					/>
					<p class="mt-4 font-bold text-slate-900">{dev.name}</p>
					<p class="text-sm text-primary">{dev.role}</p>
					<a href="mailto:{dev.contact}" class="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary">
						<Mail class="h-3.5 w-3.5" /> {dev.contact}
					</a>
				</div>
			{/each}
		</div>
	</section>

	<!-- Changelog -->
	<section>
		<h2 class="flex items-center gap-2 text-2xl font-bold text-slate-900">
			<CalendarClock class="h-6 w-6 text-primary" /> Pembaruan Aplikasi
		</h2>
		<div class="mt-6 space-y-4">
			{#each changelog as log (log.version)}
				<div class="poly-card flex items-start gap-4 !rounded-3xl p-5">
					<span class="rounded-full bg-primary-light px-3 py-1 font-mono text-xs font-semibold text-primary">v{log.version}</span>
					<div>
						<p class="text-sm text-slate-700">{log.notes}</p>
						<p class="mt-1 text-xs text-slate-400">{log.date}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Privacy -->
	<section class="poly-card p-6">
		<h2 class="text-lg font-bold text-slate-900">Privasi & Data</h2>
		<p class="mt-2 text-sm leading-relaxed text-slate-600">
			Data laporan warga dilindungi oleh Row Level Security pada basis data. Hanya laporan yang Anda
			tandai publik yang tampil di direktori dan peta kota. NIK dan data pribadi tidak pernah
			dibagikan. KotaKitaHub merupakan proyek eksperimental dan bukan situs resmi Pemerintah Kota
			Cimahi.
		</p>
	</section>
</div>
