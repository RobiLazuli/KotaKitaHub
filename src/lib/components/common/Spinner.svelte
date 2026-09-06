<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	let { size = 20 }: { size?: number } = $props();
</script>

<LoaderCircle style="width:{size}px;height:{size}px" class="animate-spin text-primary" />
