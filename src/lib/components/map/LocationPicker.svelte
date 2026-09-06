<script lang="ts">
	import { CIMAHI_CENTER } from '$lib/types';
	import { Crosshair } from 'lucide-svelte';
	import type { Map as LeafletMap, Marker } from 'leaflet';
	import { onMount } from 'svelte';

	interface Props {
		lat?: number;
		lng?: number;
		onChange?: (lat: number, lng: number) => void;
	}

	let { lat = CIMAHI_CENTER[0], lng = CIMAHI_CENTER[1], onChange }: Props = $props();

	let mapEl: HTMLDivElement;
	let map: LeafletMap;
	let marker: Marker;
	let locating = $state(false);

	onMount(() => {
		let disposed = false;
		(async () => {
			await import('leaflet/dist/leaflet.css');
			const L = await import('leaflet');
			if (disposed) return;

			map = L.map(mapEl, { zoomControl: false }).setView([lat, lng], 15);
			L.control.zoom({ position: 'bottomright' }).addTo(map);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);

			const icon = L.divIcon({
				className: '',
				html: '<div style="width:18px;height:18px;border-radius:50%;background:#0f766e;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
				iconSize: [18, 18],
				iconAnchor: [9, 9]
			});

			marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);
			marker.on('dragend', () => {
				const p = marker.getLatLng();
				onChange?.(p.lat, p.lng);
			});
			map.on('click', (e) => {
				marker.setLatLng(e.latlng);
				onChange?.(e.latlng.lat, e.latlng.lng);
			});
		})();

		return () => {
			disposed = true;
			map?.remove();
		};
	});

	function useGps() {
		if (!navigator.geolocation) return;
		locating = true;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				locating = false;
				const { latitude, longitude } = pos.coords;
				marker?.setLatLng([latitude, longitude]);
				map?.setView([latitude, longitude], 16);
				onChange?.(latitude, longitude);
			},
			() => {
				locating = false;
				alert('Lokasi GPS tidak tersedia. Silakan tandai manual pada peta.');
			},
			{ enableHighAccuracy: true, timeout: 8000 }
		);
	}
</script>

<div class="relative">
	<div bind:this={mapEl} class="h-56 w-full rounded-2xl border border-slate-200"></div>
	<button
		type="button"
		onclick={useGps}
		disabled={locating}
		class="absolute left-2 top-2 z-[500] flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-primary shadow hover:bg-slate-50 disabled:opacity-60"
	>
		<Crosshair class="h-3.5 w-3.5" />
		{locating ? 'Mencari lokasi…' : 'Gunakan GPS saya'}
	</button>
</div>
<p class="mt-1.5 text-xs text-slate-400">
	Ketik peta atau geser penanda untuk menentukan lokasi kejadian. GPS: {lat.toFixed(5)}, {lng.toFixed(5)}
</p>
