<script lang="ts">
	import '../app.css';
	import ChatWidget from '$lib/components/ai/ChatWidget.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import Navbar from '$lib/components/common/Navbar.svelte';
	import { auth } from '$lib/stores/auth';
	import { reports } from '$lib/stores/reports';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		void auth.initialize();
		void reports.loadAll();
	});
</script>

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

<ChatWidget />
