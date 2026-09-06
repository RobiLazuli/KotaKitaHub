<script lang="ts">
	import CalendarWidget from '$lib/components/common/CalendarWidget.svelte';
	import WeatherWidget from '$lib/components/common/WeatherWidget.svelte';
	import { reports } from '$lib/stores/reports';
	import {
		FileText,
		Leaf,
		Megaphone,
		MessageSquareHeart,
		Map as MapIcon,
		Sparkles,
		TrendingUp
	} from 'lucide-svelte';

	const stats = $derived({
		total: $reports.tickets.length,
		resolved: $reports.tickets.filter((t) => t.status === 'resolved').length,
		inProgress: $reports.tickets.filter((t) => t.status === 'in_progress').length
	});

	const quickActions = [
		{
			href: '/reports/new',
			icon: Megaphone,
			title: 'Lapor Masalah Kota',
			desc: 'Laporkan jalan rusak, lampu mati, sampah menumpuk, dan fasilitas umum.',
			badge: 'bg-primary',
			card: 'bg-teal-50'
		},
		{
			href: '/reports',
			icon: FileText,
			title: 'Lacak Tiket',
			desc: 'Pantau status laporan Anda dari Submitted hingga Resolved secara real-time.',
			badge: 'bg-sky-500',
			card: 'bg-sky-50'
		},
		{
			href: '/map',
			icon: MapIcon,
			title: 'Peta Kota Live',
			desc: 'Lihat insiden aktif, fasilitas publik, dan simulasi lalu lintas Kota Cimahi.',
			badge: 'bg-amber-500',
			card: 'bg-amber-50'
		},
		{
			href: '/reports/feedback',
			icon: MessageSquareHeart,
			title: 'Usulan & Masukan',
			desc: 'Sampaikan ide peningkatan kota dan masukan kebijakan publik Anda.',
			badge: 'bg-rose-500',
			card: 'bg-rose-50'
		}
	];
</script>

<svelte:head>
	<title>KotaKitaHub — Kota Cimahi Berkelanjutan</title>
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-gradient-to-br from-teal-700 via-primary to-emerald-600 text-white">
	<!-- floating blobs -->
	<div class="blob left-[8%] top-16 h-40 w-40 bg-white/20"></div>
	<div class="blob right-[12%] top-40 h-28 w-28 bg-emerald-300/40" style="animation-delay:1.2s"></div>
	<div class="blob bottom-10 left-[38%] h-32 w-32 bg-teal-300/30" style="animation-delay:2.4s"></div>
	<div class="blob -right-10 top-6 h-52 w-52 bg-emerald-400/25" style="animation-delay:3.1s"></div>

	<div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
		<div class="max-w-2xl">
			<span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium shadow-inner ring-1 ring-white/30 backdrop-blur">
				<Sparkles class="h-3.5 w-3.5" /> KotaKitaHub · Cabang Kota Cimahi
			</span>
			<h1 class="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
				Satu Kota,<br />Satu Aplikasi,<br />Semua Terhubung
			</h1>
			<p class="mt-4 max-w-xl text-lg text-emerald-50/90">
				Portal kota berkelanjutan Kota Cimahi — melaporkan masalah, memantau layanan publik,
				dan menjelajahi kota, semua dalam satu genggaman.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<a
					href="/reports/new"
					class="rounded-full bg-white px-6 py-3 text-sm font-bold text-primary shadow-[0_14px_28px_-8px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5"
				>
					Lapor Kuy!
				</a>
				<a
					href="/map"
					class="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold ring-1 ring-white/40 backdrop-blur transition hover:bg-white/20"
				>
					Jelajahi Peta Kota
				</a>
			</div>
		</div>
	</div>

	<!-- curved divider -->
	<svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="absolute bottom-0 left-0 h-12 w-full text-slate-50" fill="currentColor">
		<path d="M0,48 C360,0 1080,0 1440,48 L1440,60 L0,60 Z" />
	</svg>
</section>

<!-- Widget row: weather + calendar -->
<section class="mx-auto -mt-2 max-w-7xl px-4 pt-8 sm:px-6">
	<div class="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
		<WeatherWidget />
		<CalendarWidget />
	</div>
</section>

<!-- Live metrics -->
<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
	<div class="grid grid-cols-3 gap-4 sm:gap-6">
		{#each [
				{ icon: FileText, value: stats.total, label: 'Total Laporan', badge: 'bg-sky-100 text-sky-600' },
				{ icon: TrendingUp, value: stats.inProgress, label: 'Sedang Diproses', badge: 'bg-amber-100 text-amber-600' },
				{ icon: Leaf, value: stats.resolved, label: 'Tuntas Diselesaikan', badge: 'bg-emerald-100 text-emerald-600' }
			] as metric (metric.label)}
			{@const Icon = metric.icon}
			<div class="poly-card flex flex-col items-center gap-2 p-5 text-center">
				<span class="flex h-11 w-11 items-center justify-center rounded-full {metric.badge}">
					<Icon class="h-5 w-5" />
				</span>
				<p class="text-2xl font-extrabold text-slate-900 sm:text-3xl">{metric.value}</p>
				<p class="text-[11px] text-slate-500 sm:text-xs">{metric.label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Quick actions, pastel pill cards -->
<section class="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
	<h2 class="text-2xl font-bold text-slate-900">Layanan Utama</h2>
	<p class="mt-1 text-slate-500">Akses cepat ke fitur-fitur inti portal kota.</p>

	<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each quickActions as action (action.href)}
			{@const ActionIcon = action.icon}
			<a
				href={action.href}
				class="poly-chip group {action.card} p-5 transition hover:-translate-y-1.5"
			>
				<div class="flex h-11 w-11 items-center justify-center rounded-2xl {action.badge} text-white shadow-lg">
					<ActionIcon class="h-5 w-5" />
				</div>
				<h3 class="mt-4 font-semibold text-slate-900 group-hover:text-primary">{action.title}</h3>
				<p class="mt-1.5 text-sm leading-relaxed text-slate-500">{action.desc}</p>
			</a>
		{/each}
	</div>
</section>

<!-- CTA banner -->
<section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
	<div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-teal-900 to-primary px-6 py-14 text-center text-white sm:px-12">
		<div class="blob left-8 top-6 h-28 w-28 bg-teal-400/30"></div>
		<div class="blob bottom-4 right-10 h-24 w-24 bg-emerald-300/25" style="animation-delay:2s"></div>
		<h2 class="relative text-2xl font-bold sm:text-3xl">Suara Anda Membangun Kota</h2>
		<p class="relative mx-auto mt-3 max-w-xl text-teal-100/80">
			Setiap laporan terverifikasi dan diteruskan ke dinas terkait. Bersama KotaKitaHub, kita
			wujudkan Cimahi yang inklusif, aman, tangguh, dan berkelanjutan.
		</p>
		<a
			href="/auth"
			class="poly-btn relative mt-7 inline-block bg-white px-8 py-3 text-sm font-bold text-primary"
		>
			Gabung Sekarang
		</a>
	</div>
</section>
