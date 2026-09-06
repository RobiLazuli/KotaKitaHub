<script lang="ts">
	import type { TicketStatus } from '$lib/types';

	let { status }: { status: TicketStatus } = $props();

	const styles: Record<TicketStatus, string> = {
		submitted: 'bg-sky-100 text-sky-700 ring-sky-200',
		under_review: 'bg-amber-100 text-amber-700 ring-amber-200',
		in_progress: 'bg-violet-100 text-violet-700 ring-violet-200',
		resolved: 'bg-emerald-100 text-emerald-700 ring-emerald-200'
	};

	const labels: Record<TicketStatus, string> = {
		submitted: 'Submitted',
		under_review: 'Under Review',
		in_progress: 'In Progress',
		resolved: 'Resolved'
	};
</script>

<span
	class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 {styles[status]}"
>
	{labels[status]}
</span>
