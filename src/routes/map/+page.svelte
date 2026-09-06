<script lang="ts">
	import CityMap from '$lib/components/map/CityMap.svelte';
	import { reports } from '$lib/stores/reports';
	import { Landmark, Siren, Stethoscope, Bus, TreePine, GraduationCap, Layers } from 'lucide-svelte';

	let showOpen = $state(true);
	let showResolved = $state(true);
	let showAmenities = $state(true);
	let showTraffic = $state(true);

	const amenityLegend = [
		{ icon: Landmark, label: 'Pemerintahan', color: 'bg-teal-700' },
		{ icon: Stethoscope, label: 'Kesehatan', color: 'bg-red-600' },
		{ icon: Siren, label: 'Darurat', color: 'bg-orange-600' },
		{ icon: TreePine, label: 'Taman', color: 'bg-green-600' },
		{ icon: Bus, label: 'Transportasi', color: 'bg-blue-600' },
		{ icon: GraduationCap, label: 'Pendidikan', color: 'bg-violet-600' }
	];
</script>

<svelte:head>
	<title>Peta Kota KotaKitaHub</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Peta Kota Kota Cimahi</h1>
			<p class="mt-1 text-slate-500">Insiden warga, fasilitas kota, dan simulasi arus lalu lintas.</p>
		</div>
	</div>

	<div class="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
		<!-- Layer controls -->
		<aside class="h-fit rounded-2xl border border-slate-200 bg-white p-5">
			<h2 class="flex items-center gap-2 text-sm font-semibold text-slate-900">
				<Layers class="h-4 w-4 text-primary" /> Lapisan Peta
			</h2>
			<div class="mt-4 space-y-2.5 text-sm">
				<label class="flex items-center gap-2 text-slate-600">
					<input type="checkbox" bind:checked={showOpen} class="h-4 w-4 accent-rose-500" />
					Laporan aktif <span class="ml-auto inline-block h-3 w-3 rounded-full bg-rose-500"></span>
				</label>
				<label class="flex items-center gap-2 text-slate-600">
					<input type="checkbox" bind:checked={showResolved} class="h-4 w-4 accent-green-500" />
					Laporan selesai <span class="ml-auto inline-block h-3 w-3 rounded-full bg-green-500"></span>
				</label>
				<label class="flex items-center gap-2 text-slate-600">
					<input type="checkbox" bind:checked={showAmenities} class="h-4 w-4 accent-teal-700" />
					Fasilitas kota
				</label>
				<label class="flex items-center gap-2 text-slate-600">
					<input type="checkbox" bind:checked={showTraffic} class="h-4 w-4 accent-amber-500" />
					Lalu lintas (simulasi)
				</label>
			</div>

			<h3 class="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Legenda Simulasi Lalu Lintas</h3>
			<div class="mt-2 space-y-1.5 text-xs text-slate-600">
				<p class="flex items-center gap-2"><span class="h-1.5 w-6 rounded bg-green-500"></span> Lancar</p>
				<p class="flex items-center gap-2"><span class="h-1.5 w-6 rounded bg-amber-500"></span> Padat</p>
				<p class="flex items-center gap-2"><span class="h-1.5 w-6 rounded bg-red-500"></span> Macet</p>
			</div>

			<h3 class="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Legenda Fasilitas</h3>
			<div class="mt-2 space-y-1.5 text-xs text-slate-600">
				{#each amenityLegend as l (l.label)}
					{@const Icon = l.icon}
					<p class="flex items-center gap-2">
						<span class="flex h-5 w-5 items-center justify-center rounded-full text-white {l.color}">
							<Icon class="h-3 w-3" />
						</span>
						{l.label}
					</p>
				{/each}
			</div>
		</aside>

		<CityMap
			tickets={$reports.tickets.filter((t) => t.is_public)}
			amenities={$reports.amenities}
			{showOpen}
			{showResolved}
			{showAmenities}
			{showTraffic}
		/>
	</div>
</div>
