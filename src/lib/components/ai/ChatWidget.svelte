<script lang="ts">
	import { getAnswer, GREETING, type ChatMessage } from '$lib/components/ai/chatEngine';
	import { Bot, MessageCircle, Send, X } from 'lucide-svelte';

	let open = $state(false);
	let input = $state('');
	let msgId = 0;
	let messages = $state<ChatMessage[]>([
		{
			id: msgId++,
			role: 'assistant',
			text: GREETING,
			suggestions: ['Cara buat laporan?', 'Jam layanan Disdukcapil?', 'Puskesmas terdekat']
		}
	]);
	let thinking = $state(false);
	let scrollEl: HTMLDivElement | undefined = $state();

	function scrollToBottom() {
		requestAnimationFrame(() => scrollEl?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' }));
	}

	function send(text: string) {
		const clean = text.trim();
		if (!clean || thinking) return;

		messages.push({ id: msgId++, role: 'user', text: clean });
		input = '';
		thinking = true;
		scrollToBottom();

		// Simulated "typing" latency
		setTimeout(() => {
			const answer = getAnswer(clean);
			messages.push({ id: msgId++, role: 'assistant', text: answer.text, suggestions: answer.suggestions });
			thinking = false;
			scrollToBottom();
		}, 550);
	}
</script>

<!-- Floating launcher -->
<button
	onclick={() => (open = !open)}
	aria-label="Buka asisten kota"
	class="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105 hover:bg-primary-dark"
>
	{#if open}<X class="h-6 w-6" />{:else}<MessageCircle class="h-6 w-6" />{/if}
</button>

{#if open}
	<div
		class="fixed bottom-24 right-5 z-50 flex h-[28rem] w-80 flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl sm:w-96"
	>
		<header class="flex items-center gap-2.5 bg-primary px-4 py-3 text-white">
			<Bot class="h-5 w-5" />
			<div>
				<p class="text-sm font-semibold leading-tight">Asisten Kota Cimahi</p>
				<p class="text-[11px] text-primary-light">Siap membantu 24 jam</p>
			</div>
		</header>

		<div bind:this={scrollEl} class="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3">
			{#each messages as msg (msg.id)}
				<div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed {msg.role === 'user'
							? 'rounded-br-sm bg-primary text-white'
							: 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'}"
					>
						{msg.text}
						{#if msg.suggestions?.length}
							<div class="mt-2 flex flex-wrap gap-1.5">
								{#each msg.suggestions as s (s)}
									<button
										onclick={() => send(s)}
										class="rounded-full border border-primary/30 bg-white px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary-light"
									>
										{s}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
			{#if thinking}
				<div class="flex justify-start">
					<div class="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400">
						Mengetik…
					</div>
				</div>
			{/if}
		</div>

		<form
			onsubmit={(e) => { e.preventDefault(); send(input); }}
			class="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
		>
			<input
				bind:value={input}
				placeholder="Tulis pertanyaan Anda…"
				class="flex-1 rounded-full border border-slate-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
				aria-label="Ketik pesan"
			/>
			<button
				type="submit"
				aria-label="Kirim pesan"
				class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
				disabled={!input.trim()}
			>
				<Send class="h-4 w-4" />
			</button>
		</form>
	</div>
{/if}
