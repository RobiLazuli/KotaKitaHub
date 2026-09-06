<script lang="ts">
	import { Landmark, Mail, MapPin, Phone } from 'lucide-svelte';
</script>

<footer class="border-t border-slate-100 bg-white/70 backdrop-blur">
	<div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
		<div>
			<div class="flex items-center gap-2.5 font-bold text-primary">
				<span class="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
					<Landmark class="h-4 w-4" />
				</span>
				<span>
					KotaKitaHub
					<span class="block text-[10px] font-medium uppercase tracking-widest text-slate-400">Cabang Kota Cimahi</span>
				</span>
			</div>
			<p class="mt-3 text-sm leading-relaxed text-slate-500">
				Portal kota berkelanjutan — jembatan antara warga dan pemerintah daerah untuk pelayanan
				publik yang lebih baik, inklusif, dan berkelanjutan.
			</p>
		</div>

		<div>
			<h3 class="text-sm font-semibold uppercase tracking-wide text-slate-900">Navigasi</h3>
			<ul class="mt-3 space-y-2 text-sm text-slate-500">
				<li><a href="/reports" class="hover:text-primary">Laporan Warga</a></li>
				<li><a href="/map" class="hover:text-primary">Peta Kota</a></li>
				<li><a href="/faq" class="hover:text-primary">FAQ</a></li>
				<li><a href="/dashboard" class="hover:text-primary">Dashboard</a></li>
				<li><a href="/about" class="hover:text-primary">Tentang</a></li>
			</ul>
		</div>

		<div>
			<h3 class="text-sm font-semibold uppercase tracking-wide text-slate-900">Kontak</h3>
			<ul class="mt-3 space-y-2 text-sm text-slate-500">
				<li class="flex items-center gap-2"><MapPin class="h-4 w-4 shrink-0" /> Jl. Rd. Demang Hardjakusumah, Cimahi</li>
				<li class="flex items-center gap-2"><Phone class="h-4 w-4 shrink-0" /> Darurat: 112</li>
				<li class="flex items-center gap-2"><Mail class="h-4 w-4 shrink-0" /> halo@kotakitahub.id</li>
			</ul>
		</div>
	</div>

	<div class="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
		© 2026 KotaKitaHub — Proyek Eksperimental, bukan situs resmi Pemkot Cimahi.
	</div>
</footer>
