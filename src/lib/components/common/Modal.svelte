<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title?: string;
		onClose?: () => void;
		children: Snippet;
	}

	let { open, title, onClose, children }: Props = $props();
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
		role="dialog"
		aria-modal="true"
		aria-label={title}
	>
		<div class="w-full max-w-lg rounded-[2rem] bg-white shadow-2xl">
			<div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
				<h2 class="font-semibold text-slate-900">{title}</h2>
				<button
					onclick={onClose}
					class="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
					aria-label="Tutup"
				>
					<X class="h-5 w-5" />
				</button>
			</div>
			<div class="px-6 py-5">{@render children()}</div>
		</div>
	</div>
{/if}
