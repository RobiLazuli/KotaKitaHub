<script lang="ts">
	import LocationPicker from '$lib/components/map/LocationPicker.svelte';
	import { reports } from '$lib/stores/reports';
	import { CIMAHI_CENTER, type Ticket } from '$lib/types';
	import { Camera, CircleX, Send } from 'lucide-svelte';

	let { onSuccess }: { onSuccess?: (ticket: Ticket) => void } = $props();

	let title = $state('');
	let description = $state('');
	let categoryId = $state(1);
	let latitude = $state(CIMAHI_CENTER[0]);
	let longitude = $state(CIMAHI_CENTER[1]);
	let address = $state('');
	let photo = $state<File | null>(null);
	let photoPreview = $state<string | null>(null);
	let isPublic = $state(true);
	let submitError = $state<string | null>(null);
	let submitting = $state(false);

	function handlePhoto(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0] ?? null;
		if (photoPreview) URL.revokeObjectURL(photoPreview);
		photo = file;
		photoPreview = file ? URL.createObjectURL(file) : null;
	}

	async function submit() {
		submitError = null;
		if (title.trim().length < 5) {
			submitError = 'Judul laporan minimal 5 karakter.';
			return;
		}
		if (description.trim().length < 20) {
			submitError = 'Deskripsi minimal 20 karakter agar petugas memahami masalahnya.';
			return;
		}

		submitting = true;
		const { ticket, error } = await reports.createTicket({
			categoryId,
			title: title.trim(),
			description: description.trim(),
			latitude,
			longitude,
			address: address.trim(),
			photo,
			isPublic
		});
		submitting = false;

		if (error) {
			submitError = error;
			return;
		}
		if (ticket) onSuccess?.(ticket);
	}
</script>

<form onsubmit={(e) => { e.preventDefault(); submit(); }} class="space-y-5">
	<!-- Category -->
	<div>
		<label for="report-category" class="mb-1.5 block text-sm font-medium text-slate-700">Kategori Laporan</label>
		<select
			id="report-category"
			bind:value={categoryId}
			class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
		>
			{#each $reports.categories as cat (cat.id)}
				<option value={cat.id}>{cat.name} — {cat.description}</option>
			{/each}
		</select>
	</div>

	<!-- Title -->
	<div>
		<label for="report-title" class="mb-1.5 block text-sm font-medium text-slate-700">Judul Laporan</label>
		<input
			id="report-title"
			type="text"
			bind:value={title}
			placeholder="Contoh: Lampu jalan mati di Jl. Ciawitali"
			class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
		/>
	</div>

	<!-- Description -->
	<div>
		<label for="report-description" class="mb-1.5 block text-sm font-medium text-slate-700">Deskripsi Masalah</label>
		<textarea
			id="report-description"
			bind:value={description}
			rows="4"
			placeholder="Jelaskan kondisi, sejak kapan, dan dampaknya bagi warga…"
			class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
		></textarea>
	</div>

	<!-- Location -->
	<div>
		<span class="mb-1.5 block text-sm font-medium text-slate-700">Lokasi Kejadian</span>
		<LocationPicker
			lat={latitude}
			lng={longitude}
			onChange={(la, ln) => {
				latitude = la;
				longitude = ln;
			}}
		/>
		<input
			type="text"
			bind:value={address}
			placeholder="Alamat patokan (opsional), mis. dekat Taman Alun-Alun"
			aria-label="Alamat patokan"
			class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
		/>
	</div>

	<!-- Photo -->
	<div>
		<span class="mb-1.5 block text-sm font-medium text-slate-700">Foto Pendukung (opsional)</span>
		{#if photoPreview}
			<div class="relative w-fit">
				<img src={photoPreview} alt="Pratinjau foto laporan" class="h-32 rounded-lg border border-slate-200 object-cover" />
				<button
					type="button"
					aria-label="Hapus foto"
					onclick={() => { photo = null; photoPreview = null; }}
					class="absolute -right-2 -top-2 rounded-full bg-white shadow"
				>
					<CircleX class="h-5 w-5 text-rose-500" />
				</button>
			</div>
		{:else}
			<label
				class="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-sm text-slate-500 hover:border-primary hover:text-primary"
			>
				<Camera class="h-5 w-5" /> Unggah foto
				<input type="file" accept="image/*" class="hidden" onchange={handlePhoto} />
			</label>
		{/if}
	</div>

	<!-- Visibility -->
	<label class="flex items-center gap-2 text-sm text-slate-600">
		<input type="checkbox" bind:checked={isPublic} class="h-4 w-4 rounded border-slate-300 accent-teal-700" />
		Tampilkan laporan ini di direktori publik & peta kota
	</label>

	{#if submitError}
		<p class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{submitError}</p>
	{/if}

	<button
		type="submit"
		disabled={submitting}
		class="poly-btn flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
	>
		<Send class="h-4 w-4" />
		{submitting ? 'Mengirim laporan…' : 'Kirim Laporan'}
	</button>
</form>
