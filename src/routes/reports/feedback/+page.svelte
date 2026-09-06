<script lang="ts">
	import { reports } from '$lib/stores/reports';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { CIMAHI_CENTER } from '$lib/types';
	import { CircleCheck, MessageSquareHeart, Send } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let topic = $state('');
	let suggestion = $state('');
	let submitted = $state(false);
	let busy = $state(false);
	let error = $state<string | null>(null);

	onMount(() => {
		if (!$auth.loading && !$auth.user) goto('/auth');
	});

	async function submit() {
		error = null;
		if (topic.trim().length < 5 || suggestion.trim().length < 20) {
			error = 'Mohon isi topik (min. 5 karakter) dan usulan yang jelas (min. 20 karakter).';
			return;
		}
		busy = true;
		const result = await reports.createTicket({
			categoryId: 4,
			title: `[USULAN] ${topic.trim()}`,
			description: suggestion.trim(),
			latitude: CIMAHI_CENTER[0],
			longitude: CIMAHI_CENTER[1],
			address: '',
			photo: null,
			isPublic: true
		});
		busy = false;
		if (result.error) error = result.error;
		else submitted = true;
	}
</script>

<svelte:head>
	<title>Usulan & Masukan â€” KotaKitaHub</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-10 sm:px-6">
	<div class="flex items-center gap-3">
		<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white">
			<MessageSquareHeart class="h-5 w-5" />
		</div>
		<div>
			<h1 class="text-2xl font-bold text-slate-900">Usulan & Masukan Kebijakan</h1>
			<p class="text-sm text-slate-500">
				Sampaikan ide peningkatan kota â€” dari taman baru hingga perbaikan layanan publik.
			</p>
		</div>
	</div>

	<div class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		{#if submitted}
			<div class="py-8 text-center">
				<CircleCheck class="mx-auto h-14 w-14 text-emerald-500" />
				<p class="mt-3 font-semibold text-slate-900">Terima kasih atas masukan Anda!</p>
				<p class="mt-1 text-sm text-slate-500">
					Usulan Anda tercatat dan akan ditinjau oleh perangkat daerah terkait.
				</p>
				<a href="/reports" class="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
					Lihat Direktori Laporan
				</a>
			</div>
		{:else}
			<form onsubmit={(e) => { e.preventDefault(); submit(); }} class="space-y-4">
				<div>
					<label for="fb-topic" class="mb-1.5 block text-sm font-medium text-slate-700">Topik Usulan</label>
					<input
						id="fb-topic"
						bind:value={topic}
						placeholder="Contoh: Tambahan halte bus di Cibeureum"
						class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					/>
				</div>
				<div>
					<label for="fb-detail" class="mb-1.5 block text-sm font-medium text-slate-700">Detail Usulan</label>
					<textarea
						id="fb-detail"
						bind:value={suggestion}
						rows="5"
						placeholder="Jelaskan usulan Anda beserta alasan dan dampak positifnya bagi wargaâ€¦"
						class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					></textarea>
				</div>

				{#if error}
					<p class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
				{/if}

				<button type="submit" disabled={busy} class="flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_-8px_rgba(225,29,72,0.45)] hover:bg-rose-700 disabled:opacity-60">
					<Send class="h-4 w-4" /> {busy ? 'Mengirimâ€¦' : 'Kirim Usulan'}
				</button>
			</form>
		{/if}
	</div>
</div>
