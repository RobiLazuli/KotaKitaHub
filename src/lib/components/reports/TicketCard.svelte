<script lang="ts">
	import StatusBadge from '$lib/components/reports/StatusBadge.svelte';
	import type { Ticket } from '$lib/types';
	import { MapPin } from 'lucide-svelte';

	let { ticket, onSelect }: { ticket: Ticket; onSelect?: (t: Ticket) => void } = $props();

	const formattedDate = $derived(
		new Date(ticket.created_at).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	);
</script>

<button
	type="button"
	onclick={() => onSelect?.(ticket)}
	class="poly-card w-full !rounded-3xl p-4 text-left transition hover:-translate-y-0.5"
>
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0">
			<p class="truncate font-semibold text-slate-900">{ticket.title}</p>
			<p class="mt-0.5 font-mono text-xs text-slate-400">{ticket.code}</p>
		</div>
		<StatusBadge status={ticket.status} />
	</div>

	<p class="mt-2 line-clamp-2 text-sm text-slate-600">{ticket.description}</p>

	<div class="mt-3 flex items-center justify-between text-xs text-slate-400">
		<span class="flex items-center gap-1">
			<MapPin class="h-3.5 w-3.5" />
			<span class="max-w-56 truncate">{ticket.address ?? 'Cimahi'}</span>
		</span>
		<span>{formattedDate}</span>
	</div>
</button>
