<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import TicketCard from '$lib/components/reports/TicketCard.svelte';
	import TicketTimeline from '$lib/components/reports/TicketTimeline.svelte';
	import { reports } from '$lib/stores/reports';
	import type { Ticket, TicketStatus } from '$lib/types';
	import { Plus, Search } from 'lucide-svelte';

	let search = $state('');
	let statusFilter = $state<'all' | TicketStatus>('all');
	let trackCode = $state('');
	let trackResult = $state<Ticket | null | 'not-found'>(null);
	let trackBusy = $state(false);
	let selected = $state<Ticket | null>(null);

	const filtered = $derived(
		$reports.tickets.filter((t) => {
			const q = search.toLowerCase();
			const matchQ = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.code.toLowerCase().includes(q);
			const matchS = statusFilter === 'all' || t.status === statusFilter;
			return matchQ && matchS && t.is_public;
		})
	);

	async function track() {
		if (!trackCode.trim()) return;
		trackBusy = true;
		trackResult = 'not-found';
		const found = await reports.trackByCode(trackCode);
		trackResult = found ?? 'not-found';
		trackBusy = false;
	}
</script>

<svelte:head>
	<title>Laporan Warga â€” KotaKitaHub</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Lapor Kuy!</h1>
			<p class="mt-1 text-slate-500">Direktori laporan publik Kota Cimahi dan pelacakan tiket.</p>
		</div>
		<a
			href="/reports/new"
			class="poly-btn flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
		>
			<Plus class="h-4 w-4" /> Buat Laporan
		</a>
	</div>

	<!-- Ticket tracking -->
	<section class="poly-card mt-8 p-5">
		<h2 class="text-sm font-semibold text-slate-900">Lacak Tiket Anda</h2>
		<form onsubmit={(e) => { e.preventDefault(); track(); }} class="mt-3 flex gap-2">
			<input
				bind:value={trackCode}
				placeholder="CMH-2026-XXXX"
				class="flex-1 rounded-full border border-slate-300 px-4 py-2.5 font-mono text-sm uppercase focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
			/>
			<button type="submit" disabled={trackBusy} class="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
				{#if trackBusy}<Spinner size={16} />{:else}<Search class="h-4 w-4" />{/if}
				Lacak
			</button>
		</form>

		{#if trackResult === 'not-found'}
			<p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
				Tiket tidak ditemukan. Periksa kembali kode tiket Anda.
			</p>
		{:else if trackResult}
			<div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
				<TicketTimeline ticket={trackResult} />
			</div>
		{/if}
	</section>

	<!-- Filters -->
	<div class="mt-8 flex flex-wrap items-center gap-3">
		<div class="relative flex-1 sm:max-w-xs">
			<Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
			<input
				bind:value={search}
				placeholder="Cari laporanâ€¦"
				class="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
			/>
		</div>
		<div class="flex flex-wrap gap-1.5">
			{#each [['all', 'Semua'], ['submitted', 'Submitted'], ['under_review', 'Review'], ['in_progress', 'Diproses'], ['resolved', 'Selesai']] as [id, label] (id)}
				<button
					onclick={() => (statusFilter = id as 'all' | TicketStatus)}
					class="rounded-full px-3.5 py-1.5 text-xs font-medium transition {statusFilter === id
						? 'bg-primary text-white'
						: 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
				>
					{label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Directory -->
	{#if $reports.loading}
		<div class="flex justify-center py-20"><Spinner size={28} /></div>
	{:else if filtered.length === 0}
		<p class="py-16 text-center text-slate-400">Tidak ada laporan yang cocok dengan filter.</p>
	{:else}
		<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as ticket (ticket.id)}
				<TicketCard {ticket} onSelect={(t) => (selected = t)} />
			{/each}
		</div>
	{/if}
</div>

<!-- Detail modal -->
<Modal open={!!selected} title={selected?.code ?? ''} onClose={() => (selected = null)}>
	{#if selected}
		<h3 class="font-semibold text-slate-900">{selected.title}</h3>
		<p class="mt-1 text-sm text-slate-600">{selected.description}</p>
		{#if selected.photo_url}
			<img src={selected.photo_url} alt="Foto laporan" class="mt-3 max-h-56 w-full rounded-lg object-cover" />
		{/if}
		<div class="mt-4">
			<TicketTimeline ticket={selected} />
		</div>
	{/if}
</Modal>
