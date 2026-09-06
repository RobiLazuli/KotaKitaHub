<script lang="ts">
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import TicketCard from '$lib/components/reports/TicketCard.svelte';
	import { auth } from '$lib/stores/auth';
	import { reports } from '$lib/stores/reports';
	import { Bell, Save } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let fullName = $state('');
	let nik = $state('');
	let district = $state('');
	let phone = $state('');
	let profileMsg = $state<string | null>(null);
	let saving = $state(false);

	const districts = ['Cimahi Utara', 'Cimahi Tengah', 'Cimahi Selatan'];

	const myTickets = $derived(
		$auth.user ? $reports.tickets.filter((t) => t.user_id === $auth.user!.id) : []
	);

	// In-app notification log: authority updates on my own tickets.
	const notifications = $derived(
		myTickets
			.flatMap((t) =>
				(t.updates ?? []).map((u) => ({
					...u,
					ticketCode: t.code,
					ticketTitle: t.title
				}))
			)
			.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			.slice(0, 10)
	);

	onMount(() => {
		if (!$auth.loading && !$auth.user) {
			goto('/auth');
			return;
		}
		if ($auth.profile) {
			fullName = $auth.profile.full_name ?? '';
			nik = $auth.profile.nik ?? '';
			district = $auth.profile.district ?? '';
			phone = $auth.profile.phone ?? '';
		}
	});

	async function saveProfile() {
		saving = true;
		profileMsg = null;
		const { error } = await auth.updateProfile({
			full_name: fullName.trim(),
			nik: nik.trim() || null,
			district: district || null,
			phone: phone.trim() || null
		});
		saving = false;
		profileMsg = error ?? 'Profil berhasil disimpan.';
	}
</script>

<svelte:head>
	<title>Dashboard â€” KotaKitaHub</title>
</svelte:head>

{#if $auth.loading}
	<div class="flex justify-center py-24"><Spinner size={30} /></div>
{:else if !$auth.user}
	<div class="mx-auto max-w-md px-4 py-20 text-center">
		<p class="text-slate-500">Anda diarahkan ke halaman masukâ€¦</p>
	</div>
{:else}
	<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
		<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard Warga</h1>
		<p class="mt-1 text-slate-500">Halo, {$auth.profile?.full_name || $auth.user.email}.</p>

		<div class="mt-8 grid gap-8 lg:grid-cols-3">
			<!-- Left column: my reports + notifications -->
			<div class="space-y-8 lg:col-span-2">
				<section>
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold text-slate-900">Laporan Saya</h2>
						<a href="/reports/new" class="text-sm font-medium text-primary hover:underline">+ Laporan baru</a>
					</div>
					{#if myTickets.length === 0}
						<p class="mt-4 rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
							Belum ada laporan. Buat laporan pertama Anda!
						</p>
					{:else}
						<div class="mt-4 grid gap-4 sm:grid-cols-2">
							{#each myTickets as t (t.id)}
								<TicketCard ticket={t} />
							{/each}
						</div>
					{/if}
				</section>

				<section class="rounded-2xl border border-slate-200 bg-white p-5">
					<h2 class="flex items-center gap-2 text-lg font-semibold text-slate-900">
						<Bell class="h-5 w-5 text-primary" /> Notifikasi Status
					</h2>
					{#if notifications.length === 0}
						<p class="mt-3 text-sm text-slate-400">Belum ada notifikasi dari petugas.</p>
					{:else}
						<ul class="mt-4 space-y-3">
							{#each notifications as n (n.id)}
								<li class="rounded-lg bg-slate-50 px-3.5 py-2.5 text-sm">
									<p class="font-medium text-slate-800">
										{n.ticketCode} â€” status: <span class="capitalize text-primary">{n.status.replace('_', ' ')}</span>
									</p>
									<p class="text-slate-600">{n.message}</p>
									<p class="mt-0.5 text-xs text-slate-400">
										{n.author_name} Â· {new Date(n.created_at).toLocaleString('id-ID')}
									</p>
								</li>
							{/each}
						</ul>
					{/if}
				</section>
			</div>

			<!-- Right column: profile -->
			<section class="h-fit rounded-2xl border border-slate-200 bg-white p-5">
				<h2 class="text-lg font-semibold text-slate-900">Profil Saya</h2>
				<form onsubmit={(e) => { e.preventDefault(); saveProfile(); }} class="mt-4 space-y-3">
					<div>
						<label for="pf-name" class="mb-1 block text-xs font-medium text-slate-600">Nama Lengkap</label>
						<input id="pf-name" bind:value={fullName} class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
					</div>
					<div>
						<label for="pf-nik" class="mb-1 block text-xs font-medium text-slate-600">NIK (opsional)</label>
						<input id="pf-nik" bind:value={nik} maxlength="16" placeholder="16 digit" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
					</div>
					<div>
						<label for="pf-district" class="mb-1 block text-xs font-medium text-slate-600">Kecamatan</label>
						<select id="pf-district" bind:value={district} class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
							<option value="">Pilih kecamatanâ€¦</option>
							{#each districts as d (d)}<option value={d}>{d}</option>{/each}
						</select>
					</div>
					<div>
						<label for="pf-phone" class="mb-1 block text-xs font-medium text-slate-600">No. HP</label>
						<input id="pf-phone" bind:value={phone} type="tel" placeholder="08xx" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
					</div>

					{#if profileMsg}
						<p class="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{profileMsg}</p>
					{/if}

					<button type="submit" disabled={saving} class="poly-btn flex w-full items-center justify-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
						<Save class="h-4 w-4" /> {saving ? 'Menyimpanâ€¦' : 'Simpan Profil'}
					</button>
				</form>
			</section>
		</div>
	</div>
{/if}
