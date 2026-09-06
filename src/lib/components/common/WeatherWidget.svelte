<script lang="ts">
	import { CIMAHI_CENTER } from '$lib/types';
	import {
		Cloud,
		CloudDrizzle,
		CloudFog,
		CloudLightning,
		CloudRain,
		CloudSnow,
		CloudSun,
		Cloudy,
		Droplets,
		MapPin,
		Sun,
		Wind
	} from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface WeatherState {
		current: { temperature: number; weatherCode: number; humidity: number; wind: number };
		daily: { date: string; max: number; min: number; code: number }[];
	}

	let weather = $state<WeatherState | null>(null);
	let failed = $state(false);

	/** WMO weather-code -> label + icon */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const WMO: Record<number, { label: string; icon: any }> = {
		0: { label: 'Cerah', icon: Sun },
		1: { label: 'Cerah Berawan', icon: CloudSun },
		2: { label: 'Berawan Sebagian', icon: CloudSun },
		3: { label: 'Mendung', icon: Cloud },
		45: { label: 'Berkabut', icon: CloudFog },
		48: { label: 'Kabut Dingin', icon: CloudFog },
		51: { label: 'Gerimis Ringan', icon: CloudDrizzle },
		53: { label: 'Gerimis', icon: CloudDrizzle },
		55: { label: 'Gerimis Lebat', icon: CloudDrizzle },
		61: { label: 'Hujan Ringan', icon: CloudRain },
		63: { label: 'Hujan Sedang', icon: CloudRain },
		65: { label: 'Hujan Lebat', icon: CloudRain },
		71: { label: 'Hujan Es Ringan', icon: CloudSnow },
		80: { label: 'Hujan Lokal', icon: CloudRain },
		81: { label: 'Hujan Lokal Sedang', icon: CloudRain },
		82: { label: 'Hujan Lokal Lebat', icon: CloudRain },
		95: { label: 'Badai Petir', icon: CloudLightning },
		96: { label: 'Badai + Es', icon: CloudLightning },
		99: { label: 'Badai Petir Kuat', icon: CloudLightning }
	};

	function describe(code: number) {
		return WMO[code] ?? { label: 'Berawan', icon: Cloudy };
	}

	onMount(async () => {
		try {
			const res = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${CIMAHI_CENTER[0]}&longitude=${CIMAHI_CENTER[1]}` +
					'&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
					'&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=3&timezone=Asia%2FJakarta'
			);
			const json = await res.json();
			weather = {
				current: {
					temperature: json.current.temperature_2m,
					weatherCode: json.current.weather_code,
					humidity: json.current.relative_humidity_2m,
					wind: json.current.wind_speed_10m
				},
				daily: json.daily.time.map((date: string, i: number) => ({
					date,
					max: Math.round(json.daily.temperature_2m_max[i]),
					min: Math.round(json.daily.temperature_2m_min[i]),
					code: json.daily.weather_code[i]
				}))
			};
		} catch {
			failed = true;
		}
	});

	const dayName = (iso: string) =>
		new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short' });
</script>

<div class="poly-card overflow-hidden !p-0">
	<div class="bg-gradient-to-br from-primary to-teal-600 p-5 text-white">
		<div class="flex items-center justify-between">
			<p class="flex items-center gap-1.5 text-sm font-medium text-emerald-100">
				<MapPin class="h-4 w-4" /> Cuaca Kota Cimahi
			</p>
			<span class="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium">Langsung</span>
		</div>

		{#if weather}
			{@const current = describe(weather.current.weatherCode)}
			{@const CurrentIcon = current.icon}
			<div class="mt-5 flex items-center justify-between">
				<div>
					<p class="text-5xl font-extrabold tracking-tight">{Math.round(weather.current.temperature)}°</p>
					<p class="mt-1 text-sm text-emerald-100">{current.label}</p>
				</div>
				<CurrentIcon class="h-20 w-20 text-white/80 drop-shadow-lg" strokeWidth={1.25} />
			</div>

			<div class="mt-5 flex gap-3 text-xs">
				<span class="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
					<Droplets class="h-3.5 w-3.5" /> {weather.current.humidity}%
				</span>
				<span class="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
					<Wind class="h-3.5 w-3.5" /> {Math.round(weather.current.wind)} km/j
				</span>
			</div>
		{:else if failed}
			<p class="mt-6 text-sm text-emerald-100">Gagal memuat data cuaca. Periksa koneksi Anda.</p>
		{:else}
			<div class="mt-6 flex items-center gap-3 text-sm text-emerald-100">
				<div class="h-8 w-8 animate-pulse rounded-full bg-white/20"></div> Memuat cuaca…
			</div>
		{/if}
	</div>

	{#if weather}
		<div class="grid grid-cols-3 divide-x divide-slate-100 bg-white/90">
			{#each weather.daily as day (day.date)}
				{@const meta = describe(day.code)}
				{@const DayIcon = meta.icon}
				<div class="flex flex-col items-center gap-1 py-3.5">
					<p class="text-xs font-medium capitalize text-slate-500">{dayName(day.date)}</p>
					<DayIcon class="h-5 w-5 text-primary" />
					<p class="text-xs font-bold text-slate-800">{day.max}°<span class="font-normal text-slate-400">/{day.min}°</span></p>
				</div>
			{/each}
		</div>
	{/if}
</div>
