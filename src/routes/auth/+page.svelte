<script lang="ts">
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import { auth } from '$lib/stores/auth';
	import { Landmark, Mail, Smartphone } from 'lucide-svelte';

	type Mode = 'login' | 'register' | 'otp';
	let mode = $state<Mode>('login');

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let phone = $state('');
	let otpToken = $state('');
	let otpSent = $state(false);

	let busy = $state(false);
	let errorMsg = $state<string | null>(null);
	let infoMsg = $state<string | null>(null);

	async function submit() {
		errorMsg = null;
		infoMsg = null;
		busy = true;

		if (mode === 'login') {
			const { error } = await auth.signInWithEmail(email.trim(), password);
			busy = false;
			if (error) errorMsg = error;
			else await goto('/dashboard');
		} else if (mode === 'register') {
			if (name.trim().length < 3) {
				busy = false;
				errorMsg = 'Nama lengkap wajib diisi.';
				return;
			}
			const { error } = await auth.signUp(email.trim(), password, name.trim());
			busy = false;
			if (error) errorMsg = error;
			else {
				if ($auth.demoMode) await goto('/dashboard');
				else infoMsg = 'Pendaftaran berhasil! Periksa email Anda untuk verifikasi.';
			}
		} else {
			// Phone OTP flow
			if (!otpSent) {
				const { error } = await auth.signInWithPhoneOtp(phone.trim());
				busy = false;
				if (error) errorMsg = error;
				else {
					otpSent = true;
					infoMsg = 'Kode OTP telah dikirim ke nomor Anda.';
				}
			} else {
				const { error } = await auth.verifyOtp(phone.trim(), otpToken.trim());
				busy = false;
				if (error) errorMsg = error;
				else await goto('/dashboard');
			}
		}
	}

	const submitLabel = $derived(
		busy ? 'Memproses ¦'
		: mode === 'login' ? 'Masuk'
		: mode === 'register' ? 'Daftar'
		: otpSent ? 'Verifikasi OTP' : 'Kirim Kode OTP'
	);
</script>

<svelte:head>
	<title>Masuk  ” KotaKitaHub</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col items-center px-4 py-16">
	<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
		<Landmark class="h-7 w-7" />
	</div>
	<h1 class="mt-4 text-2xl font-bold text-slate-900">
		{mode === 'register' ? 'Buat Akun Warga' : 'Selamat Datang Kembali'}
	</h1>
	<p class="mt-1 text-center text-sm text-slate-500">
		{#if $auth.demoMode}
			Mode demo aktif  ” gunakan email & kata sandi apa pun untuk masuk.
		{:else}
			Masuk untuk mengelola laporan dan memantau layanan kota.
		{/if}
	</p>

	<!-- Mode switcher -->
	<div class="mt-6 grid w-full grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
		{#each [['login', 'Login'], ['register', 'Daftar'], ['otp', 'OTP / HP']] as [m, label] (m)}
			<button
				onclick={() => { mode = m as Mode; errorMsg = null; infoMsg = null; }}
				class="rounded-lg py-2 text-sm font-medium transition {mode === m
					? 'bg-white text-primary shadow-sm'
					: 'text-slate-500 hover:text-slate-700'}"
			>
				{label}
			</button>
		{/each}
	</div>

	<form onsubmit={(e) => { e.preventDefault(); submit(); }} class="mt-6 w-full space-y-4">
		{#if mode === 'register'}
			<input
				type="text"
				bind:value={name}
				placeholder="Nama lengkap"
				required
				class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
			/>
		{/if}

		{#if mode === 'otp'}
			<div class="relative">
				<Smartphone class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
				<input
					type="tel"
					bind:value={phone}
					placeholder="+62 812 ¦"
					required
					disabled={otpSent}
					class="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50"
				/>
			</div>
			{#if otpSent}
				<input
					type="text"
					bind:value={otpToken}
					placeholder="Kode OTP 6 digit"
					required
					inputmode="numeric"
					maxlength="6"
					class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center text-lg tracking-[0.5em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
			{/if}
		{:else}
			<div class="relative">
				<Mail class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
				<input
					type="email"
					bind:value={email}
					placeholder="Alamat email"
					required
					class="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
			</div>
			<input
				type="password"
				bind:value={password}
				placeholder="Kata sandi (min. 6 karakter)"
				required
				minlength="6"
				class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
			/>
		{/if}

		{#if errorMsg}
			<p class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{errorMsg}</p>
		{/if}
		{#if infoMsg}
			<p class="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{infoMsg}</p>
		{/if}

		<button
			type="submit"
			disabled={busy}
			class="poly-btn flex w-full items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
		>
			{#if busy}<Spinner size={16} />{/if}
			{submitLabel}
		</button>
	</form>
</div>
