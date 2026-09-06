<script lang="ts">
	import type { Ticket, TicketStatus } from '$lib/types';
	import { Check, CircleAlert, FileText, Loader, Wrench } from 'lucide-svelte';

	let { ticket }: { ticket: Ticket } = $props();

	const pipeline: { id: TicketStatus; label: string }[] = [
		{ id: 'submitted', label: 'Submitted' },
		{ id: 'under_review', label: 'Under Review' },
		{ id: 'in_progress', label: 'In Progress' },
		{ id: 'resolved', label: 'Resolved' }
	];

	const currentIndex = $derived(pipeline.findIndex((s) => s.id === ticket.status));

	const icons = {
		submitted: FileText,
		under_review: CircleAlert,
		in_progress: Loader,
		resolved: Check
	};

	const sortedUpdates = $derived(
		[...(ticket.updates ?? [])].sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		)
	);
</script>

<!-- Status pipeline -->
<ol class="flex items-center">
	{#each pipeline as step, i (step.id)}
		{@const StepIcon = icons[step.id]}
		<li class="flex flex-1 items-center {i === pipeline.length - 1 ? 'flex-none' : ''}">
			<div class="flex flex-col items-center text-center">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full border-2 {i <= currentIndex
						? 'border-primary bg-primary text-white'
						: 'border-slate-200 bg-white text-slate-300'}"
				>
					<StepIcon class="h-4 w-4" />
				</div>
				<span
					class="mt-1 text-[10px] font-medium {i <= currentIndex ? 'text-primary' : 'text-slate-400'}"
				>
					{step.label}
				</span>
			</div>
			{#if i < pipeline.length - 1}
				<div class="mx-1 mb-4 h-0.5 flex-1 {i < currentIndex ? 'bg-primary' : 'bg-slate-200'}"></div>
			{/if}
		</li>
	{/each}
</ol>

<!-- Update log -->
<div class="mt-5 space-y-3 border-t border-slate-100 pt-4">
	<h4 class="text-sm font-semibold text-slate-700">Riwayat Pembaruan</h4>
	{#if sortedUpdates.length}
		{#each sortedUpdates as u (u.id)}
			<div class="flex gap-3 text-sm">
				<div class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/60"></div>
				<div>
					<p class="font-medium capitalize text-slate-800">
						{u.status.replace('_', ' ')} <span class="font-normal text-slate-400">— {u.author_name}</span>
					</p>
					{#if u.message}<p class="text-slate-600">{u.message}</p>{/if}
					<p class="text-xs text-slate-400">
						{new Date(u.created_at).toLocaleString('id-ID')}
					</p>
				</div>
			</div>
		{/each}
	{:else}
		<p class="text-sm text-slate-400">Belum ada pembaruan untuk tiket ini.</p>
	{/if}
</div>
