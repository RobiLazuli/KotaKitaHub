<script lang="ts">
	import { page } from '$app/state';
	import { auth } from '$lib/stores/auth';
	import { Landmark, LogOut, Map, Menu, User, X } from 'lucide-svelte';

	let mobileOpen = $state(false);

	const links = [
		{ href: '/', label: 'Beranda' },
		{ href: '/reports', label: 'Laporan' },
		{ href: '/map', label: 'Peta Kota' },
		{ href: '/faq', label: 'FAQ' },
		{ href: '/about', label: 'Tentang' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<header class="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-lg">
	<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
		<a href="/" class="flex items-center gap-2.5 font-bold text-primary">
			<span class="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_8px_16px_-6px_rgba(15,118,110,0.5)]">
				<Landmark class="h-5 w-5" />
			</span>
			<span class="leading-tight">
				<span class="block text-base tracking-tight">KotaKitaHub</span>
				<span class="block text-[10px] font-medium uppercase tracking-widest text-slate-400">Cabang Kota Cimahi</span>
			</span>
		</a>

		<!-- Desktop nav -->
		<div class="hidden items-center gap-1 md:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {isActive(link.href)
						? 'bg-primary-light text-primary'
						: 'text-slate-600 hover:bg-slate-100'}"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<div class="hidden items-center gap-2 md:flex">
			{#if $auth.user}
				<a
					href="/dashboard"
					class="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
				>
					<User class="h-4 w-4" /> Dashboard
				</a>
				<button
					onclick={() => auth.signOut()}
					class="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
					title="Keluar"
				>
					<LogOut class="h-4 w-4" />
				</button>
			{:else}
				<a
					href="/auth"
					class="poly-btn flex items-center gap-2 bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
				>
					Masuk
				</a>
			{/if}
		</div>

		<button
			class="rounded-full p-2 hover:bg-slate-100 md:hidden"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Buka menu"
		>
			{#if mobileOpen}<X class="h-6 w-6" />{:else}<Menu class="h-6 w-6" />{/if}
		</button>
	</nav>

	{#if mobileOpen}
		<div class="border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
			{#each links as link (link.href)}
				<a
					href={link.href}
					onclick={() => (mobileOpen = false)}
					class="block rounded-full px-4 py-2 text-sm font-medium {isActive(link.href)
						? 'bg-primary-light text-primary'
						: 'text-slate-600'}"
				>
					{link.label}
				</a>
			{/each}
			<div class="mt-2 border-t border-slate-100 pt-2">
				{#if $auth.user}
					<a
						href="/dashboard"
						onclick={() => (mobileOpen = false)}
						class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700"
					>
						<Map class="h-4 w-4" /> Dashboard
					</a>
					<button
						onclick={() => {
							auth.signOut();
							mobileOpen = false;
						}}
						class="flex w-full items-center gap-2 rounded-full px-4 py-2 text-left text-sm text-slate-500"
					>
						<LogOut class="h-4 w-4" /> Keluar
					</button>
				{:else}
					<a href="/auth" class="block rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white" onclick={() => (mobileOpen = false)}>Masuk</a>
				{/if}
			</div>
		</div>
	{/if}
</header>
