<script lang="ts">
	import { FAQ_CATEGORIES, FAQ_ENTRIES } from '$lib/data/faq';
	import { ChevronDown, CircleHelp, Search } from 'lucide-svelte';

	let search = $state('');
	let activeCategory = $state<string | null>(null);
	let openIndex = $state<number | null>(0);

	const filtered = $derived(
		FAQ_ENTRIES.filter((f) => {
			const q = search.toLowerCase();
			return (
				(!activeCategory || f.category === activeCategory) &&
				(!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
			);
		})
	);
</script>

<svelte:head>
	<title>FAQ — KotaKitaHub</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
	<div class="text-center">
		<span class="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-primary-light text-primary">
			<CircleHelp class="h-7 w-7" />
		</span>
		<h1 class="mt-4 text-3xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan</h1>
		<p class="mt-2 text-slate-500">
			Jawaban cepat seputar layanan Kota Cimahi — sama seperti yang dijawab asisten virtual kami.
		</p>
	</div>

	<!-- Search -->
	<div class="relative mx-auto mt-8 max-w-md">
		<Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
		<input
			bind:value={search}
			placeholder="Cari pertanyaan…"
			class="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
		/>
	</div>

	<!-- Category pills -->
	<div class="mt-5 flex flex-wrap justify-center gap-2">
		<button
			onclick={() => (activeCategory = null)}
			class="rounded-full px-4 py-1.5 text-xs font-medium transition {activeCategory === null
				? 'bg-primary text-white shadow'
				: 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}"
		>
			Semua
		</button>
		{#each FAQ_CATEGORIES as cat (cat)}
			<button
				onclick={() => (activeCategory = activeCategory === cat ? null : cat)}
				class="rounded-full px-4 py-1.5 text-xs font-medium transition {activeCategory === cat
					? 'bg-primary text-white shadow'
					: 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}"
			>
				{cat}
			</button>
		{/each}
	</div>

	<!-- Accordion -->
	<div class="mt-8 space-y-3">
		{#each filtered as faq (faq.question)}
			{@const idx = FAQ_ENTRIES.indexOf(faq)}
			<div class="poly-card overflow-hidden !rounded-3xl">
				<button
					onclick={() => (openIndex = openIndex === idx ? null : idx)}
					class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
					aria-expanded={openIndex === idx}
				>
					<span class="text-sm font-semibold text-slate-800">{faq.question}</span>
					<ChevronDown
						class="h-4 w-4 shrink-0 text-slate-400 transition-transform {openIndex === idx ? 'rotate-180' : ''}"
					/>
				</button>
				{#if openIndex === idx}
					<div class="border-t border-slate-100 px-5 py-4">
						<span class="mb-2 inline-block rounded-full bg-primary-light px-2.5 py-0.5 text-[10px] font-semibold text-primary">
							{faq.category}
						</span>
						<p class="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
					</div>
				{/if}
			</div>
		{:else}
			<p class="py-12 text-center text-sm text-slate-400">Tidak ada pertanyaan yang cocok.</p>
		{/each}
	</div>

	<p class="mt-10 rounded-3xl bg-primary-light/60 px-6 py-5 text-center text-sm text-slate-600">
		Tidak menemukan jawaban? Tanya langsung <strong>Asisten Kota</strong> (ikon chat di kanan bawah)
		atau <a href="/reports/feedback" class="font-semibold text-primary hover:underline">kirim masukan</a>.
	</p>
</div>
