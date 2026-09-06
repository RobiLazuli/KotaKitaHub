<script lang="ts">
	import { MOCK_TRAFFIC } from '$lib/data/mock';
	import type { Amenity, Ticket } from '$lib/types';
	import { CIMAHI_CENTER } from '$lib/types';
	import type { LayerGroup, Map as LeafletMap } from 'leaflet';
	import { onMount } from 'svelte';

	interface Props {
		tickets: Ticket[];
		amenities: Amenity[];
		showOpen?: boolean;
		showResolved?: boolean;
		showAmenities?: boolean;
		showTraffic?: boolean;
	}

	let {
		tickets,
		amenities,
		showOpen = true,
		showResolved = true,
		showAmenities = true,
		showTraffic = true
	}: Props = $props();

	let mapEl: HTMLDivElement;
	let map: LeafletMap;
	let openLayer: LayerGroup;
	let resolvedLayer: LayerGroup;
	let amenityLayer: LayerGroup;
	let trafficLayer: LayerGroup;

	const AMENITY_COLORS: Record<Amenity['type'], string> = {
		government: '#0f766e',
		health: '#dc2626',
		emergency: '#ea580c',
		park: '#16a34a',
		transport: '#2563eb',
		education: '#7c3aed'
	};

	function dotIcon(L: typeof import('leaflet'), color: string, size = 14) {
		return L.divIcon({
			className: '',
			html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
			iconSize: [size, size],
			iconAnchor: [size / 2, size / 2]
		});
	}

	function escapeHtml(s: string): string {
		return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
	}

	onMount(() => {
		let disposed = false;
		(async () => {
			await import('leaflet/dist/leaflet.css');
			const L = await import('leaflet');
			if (disposed) return;

			map = L.map(mapEl).setView(CIMAHI_CENTER, 13);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);

			openLayer = L.layerGroup().addTo(map);
			resolvedLayer = L.layerGroup().addTo(map);
			amenityLayer = L.layerGroup().addTo(map);
			trafficLayer = L.layerGroup().addTo(map);

			// --- Amenity markers
			for (const a of amenities) {
				L.marker([a.latitude, a.longitude], { icon: dotIcon(L, AMENITY_COLORS[a.type]) })
					.bindPopup(
						`<strong>${escapeHtml(a.name)}</strong><br/>${escapeHtml(a.address ?? '')}` +
							(a.hours ? `<br/>🕒 ${escapeHtml(a.hours)}` : '') +
							(a.phone ? `<br/>☎ ${escapeHtml(a.phone)}` : '')
					)
					.addTo(amenityLayer);
			}

			// --- Mock traffic polylines
			const trafficColors = { smooth: '#22c55e', moderate: '#f59e0b', heavy: '#ef4444' };
			for (const road of MOCK_TRAFFIC) {
				L.polyline(road.path, { color: trafficColors[road.level], weight: 6, opacity: 0.65 })
					.bindTooltip(
						`${road.road} — ${road.level === 'smooth' ? 'Lancar' : road.level === 'moderate' ? 'Padat' : 'Macet'}`
					)
					.addTo(trafficLayer);
			}

			renderTickets(L);
		})();

		return () => {
			disposed = true;
			map?.remove();
		};
	});

	/** (Re)render report markers whenever tickets change. */
	async function renderTickets(L?: typeof import('leaflet')) {
		const Leaflet = L ?? (await import('leaflet'));
		if (!openLayer || !resolvedLayer) return;
		openLayer.clearLayers();
		resolvedLayer.clearLayers();

		for (const t of tickets) {
			const layer = t.status === 'resolved' ? resolvedLayer : openLayer;
			Leaflet.marker([t.latitude, t.longitude], {
				icon: dotIcon(Leaflet, t.status === 'resolved' ? '#22c55e' : '#f43f5e', 16)
			})
				.bindPopup(
					`<strong>${escapeHtml(t.title)}</strong><br/>
					 <span style="font-size:11px;color:#94a3b8">${t.code}</span><br/>
					 ${escapeHtml(t.description.slice(0, 120))}`
				)
				.addTo(layer);
		}
	}

	// React to data/visibility changes after mount
	$effect(() => {
		if (!map) return;
		void renderTickets();
	});
	$effect(() => {
		if (!map) return;
		showOpen ? openLayer.addTo(map) : map.removeLayer(openLayer);
	});
	$effect(() => {
		if (!map) return;
		showResolved ? resolvedLayer.addTo(map) : map.removeLayer(resolvedLayer);
	});
	$effect(() => {
		if (!map) return;
		showAmenities ? amenityLayer.addTo(map) : map.removeLayer(amenityLayer);
	});
	$effect(() => {
		if (!map) return;
		showTraffic ? trafficLayer.addTo(map) : map.removeLayer(trafficLayer);
	});
</script>

<div bind:this={mapEl} class="h-[70vh] w-full overflow-hidden rounded-[2rem] border border-slate-200 shadow-[0_24px_48px_-16px_rgba(15,118,110,0.18)]"></div>
