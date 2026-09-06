<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	const today = new Date();
	let viewYear = $state(today.getFullYear());
	let viewMonth = $state(today.getMonth());

	const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });

	function shiftMonth(delta: number) {
		const d = new Date(viewYear, viewMonth + delta, 1);
		viewYear = d.getFullYear();
		viewMonth = d.getMonth();
	}

	/** Calendar grid: weeks of Date|null (null = padding cell). */
	const weeks = $derived.by(() => {
		const first = new Date(viewYear, viewMonth, 1);
		const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
		// Week starts on Sunday (like the reference design)
		const startOffset = first.getDay();
		const cells: (Date | null)[] = Array.from({ length: startOffset }, () => null);
		for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));
		while (cells.length % 7 !== 0) cells.push(null);

		const rows: (Date | null)[][] = [];
		for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
		return rows;
	});

	const isToday = (d: Date | null) =>
		!!d &&
		d.getDate() === today.getDate() &&
		d.getMonth() === today.getMonth() &&
		d.getFullYear() === today.getFullYear();

	const weekdayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
</script>

<div class="poly-card p-5">
	<div class="flex items-center justify-between">
		<button
			onclick={() => shiftMonth(-1)}
			class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-primary-light hover:text-primary"
			aria-label="Bulan sebelumnya"
		>
			<ChevronLeft class="h-4 w-4" />
		</button>
		<p class="text-sm font-bold capitalize text-slate-800">
			{monthFormatter.format(new Date(viewYear, viewMonth, 1))}
		</p>
		<button
			onclick={() => shiftMonth(1)}
			class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-primary-light hover:text-primary"
			aria-label="Bulan berikutnya"
		>
			<ChevronRight class="h-4 w-4" />
		</button>
	</div>

	<table class="mt-4 w-full table-fixed text-center text-xs">
		<thead>
			<tr>
				{#each weekdayHeaders as day (day)}
					<th class="pb-2 font-medium text-slate-400">{day}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each weeks as week, wi (wi)}
				<tr>
					{#each week as day, di (wi * 7 + di)}
						<td class="p-0.5">
							{#if day}
								<span
									class="mx-auto flex h-8 w-8 items-center justify-center rounded-full font-medium transition {isToday(day)
										? 'bg-primary font-bold text-white shadow-[0_6px_14px_-4px_rgba(15,118,110,0.55)]'
										: 'text-slate-600 hover:bg-primary-light'}"
								>
									{day.getDate()}
								</span>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<p class="mt-4 text-center text-[11px] text-slate-400">
		Hari ini: {today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
	</p>
</div>
