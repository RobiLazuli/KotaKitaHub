<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/common/Modal.svelte';
	import ReportForm from '$lib/components/reports/ReportForm.svelte';
	import { auth } from '$lib/stores/auth';
	import type { Ticket } from '$lib/types';
	import { CircleCheck, Megaphone } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let created = $state<Ticket | null>(null);

	// Prompt login first (demo mode allows instant fake login via store, but require a user object).
	onMount(() => {
		if (!$auth.loading && !$auth.user) {
			// Keep on page but gently redirect unauthenticated users to auth.
			goto('/auth');
		}
	});
</script>

<svelte:head>
	<title>Buat Laporan â€” KotaKitaHub</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-10 sm:px-6">
	<div class="flex items-center gap-3">
		<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
			<Megaphone class="h-5 w-5" />
		</div>
		<div>
			<h1 class="text-2xl font-bold text-slate-900">Buat Laporan Warga</h1>
			<p class="text-sm text-slate-500">Laporkan masalah infrastruktur & lingkungan di sekitar Anda.</p>
		</div>
	</div>

	<div class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<ReportForm onSuccess={(t) => (created = t)} />
	</div>
</div>

<!-- Success modal with tracking code -->
<Modal open={!!created} title="Laporan Terkirim" onClose={() => goto('/reports')}>
	{#if created}
		<div class="text-center">
			<CircleCheck class="mx-auto h-14 w-14 text-emerald-500" />
			<p class="mt-3 font-semibold text-slate-900">Terima kasih! Laporan Anda telah diterima.</p>
			<p class="mt-1 text-sm text-slate-500">Simpan kode tiket berikut untuk melacak status laporan:</p>
			<p class="mt-3 inline-block rounded-lg bg-primary-light px-4 py-2 font-mono text-lg font-bold text-primary">
				{created.code}
			</p>
			<div class="mt-6 flex justify-center gap-3">
				<a href="/dashboard" class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">Ke Dashboard</a>
				<a href="/reports" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Lihat Direktori</a>
			</div>
		</div>
	{/if}
</Modal>
