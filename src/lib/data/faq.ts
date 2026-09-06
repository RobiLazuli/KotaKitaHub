/** FAQ entries mirroring the chatbot knowledge base (Kota Cimahi branch). */

export interface FaqEntry {
	category: string;
	question: string;
	answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
	{
		category: 'Layanan Adminisitrasi',
		question: 'Bagaimana cara mengurus KTP-el di Kota Cimahi?',
		answer:
			'Bawa fotokopi Kartu Keluarga (KK) asli ke Disdukcapil Kota Cimahi, Jl. Rd. Demang Hardjakusumah (kompleks Pemkot Cimahi). Perekaman dilakukan bagi warga berusia 17 tahun ke atas. Layanan buka Senin–Jumat pukul 08.00–15.30 dan tidak dipungut biaya.'
	},
	{
		category: 'Layanan Adminisitrasi',
		question: 'Apa saja jam layanan kantor pemerintah Kota Cimahi?',
		answer:
			'Senin–Kamis 08.00–15.00 WIB, Jumat 08.00–11.30 & 13.00–15.30 WIB. RSUD Cibabat, Polres Cimahi, dan Pemadam Kebakaran melayani 24 jam.'
	},
	{
		category: 'Perizinan & Retribusi',
		question: 'Di mana mengurus perizinan usaha di Cimahi?',
		answer:
			'Layanan perizinan dikelola DPMPTSP (Mal Pelayanan Perizinan) di kompleks Pemkot Cimahi, telp (022) 6653550. Perizinan usaha kini terintegrasi melalui sistem OSS-RBA di oss.go.id.'
	},
	{
		category: 'Perizinan & Retribusi',
		question: 'Bagaimana cara membayar retribusi dan pajak daerah?',
		answer:
			'Pembayaran retribusi dan pajak daerah (PBB-P2, BPHTB, dll.) dilakukan melalui Bapenda Kota Cimahi, dapat melalui bank mitra atau kanal pembayaran resmi pemerintah daerah.'
	},
	{
		category: 'Pelaporan Warga',
		question: 'Bagaimana cara membuat laporan warga?',
		answer:
			'Buka menu "Lapor Kuy!" > "Buat Laporan", pilih kategori (Jalan Rusak, Penerangan Jalan, Sampah & Lingkungan, Fasilitas Umum), tandai lokasi di peta atau gunakan GPS, lampirkan foto bila ada, lalu kirim. Anda akan menerima kode tiket unik seperti CMH-2026-XXXX.'
	},
	{
		category: 'Pelaporan Warga',
		question: 'Bagaimana melacak status laporan saya?',
		answer:
			'Masukkan kode tiket (format CMH-2026-XXXX) pada kolom "Lacak Tiket" di halaman Lapor Kuy!, atau lihat riwayat dan pembaruan lengkap di Dashboard setelah masuk ke akun. Setiap status akan mengalir: Submitted → Under Review → In Progress → Resolved.'
	},
	{
		category: 'Fasilitas Kota',
		question: 'Fasilitas kesehatan apa saja yang tersedia di Cimahi?',
		answer:
			'Antara lain RSUD Cibabat (Jl. Raya Cibabat, 24 jam) dan Puskesmas Cimahi Tengah (Jl. Encep Kartawiria). Rumah sakit dan puskesmas dapat dilihat lengkap di Peta Kota.'
	},
	{
		category: 'Fasilitas Kota',
		question: 'Taman dan ruang terbuka hijau di Cimahi ada di mana saja?',
		answer:
			'Beberapa yang populer: Taman Alun-Alun Cimahi (pusat kota, 06.00–21.00) dan Taman Kehat Kejutan di Jl. Sriwijaya, Cibeber. Lihat layer "Fasilitas kota" pada Peta Kota untuk lokasi lainnya.'
	},
	{
		category: 'Transportasi',
		question: 'Apa simpul transportasi utama di Kota Cimahi?',
		answer:
			'Stasiun Cimahi (Jl. Stasiun, Cimahi Utara) untuk kereta api dan Terminal Cibeureum (Jl. Raya Cibeureum, Cimahi Selatan) untuk angkutan antar kota.'
	},
	{
		category: 'Darurat',
		question: 'Nomor darurat apa saja yang bisa dihubungi?',
		answer:
			'Layanan Darurat Terpadu: 112 · Polisi: 110 · Pemadam Kebakaran: 113 · Ambulans: 118 / PSC: 119. Semua aktif 24 jam dan bebas pulsa.'
	},
	{
		category: 'Tentang Platform',
		question: 'Apa itu KotaKitaHub?',
		answer:
			'KotaKitaHub adalah portal kota berkelanjutan (SDGs 11) versi cabang Kota Cimahi — menghubungkan warga dengan pemerintah daerah untuk pelaporan masalah, informasi layanan publik, dan partisipasi perencanaan kota.'
	}
];

export const FAQ_CATEGORIES = [...new Set(FAQ_ENTRIES.map((f) => f.category))];

/** Developer team placeholders — ganti nama, peran, kontak, dan foto sesuka Anda. */
export const DEVELOPERS = [
	{
		name: 'Adelard Mikaeel Muzakki',
		role: 'Project Lead & Backend',
		contact: 'adelardmikaeel10 @gmail.com',
		photo: '/developers/dev-1.svg'
	},
	{
		name: 'Agustian Nurdiansyah',
		role: 'Frontend & Design',
		contact: 'agustiannurdiansyah02222 @gmail.com',
		photo: '/developers/dev-2.svg'
	},
	{
		name: 'M. Robi Aditya',
		role: 'Frontend & Design',
		contact: 'robya1529 @gmail.com',
		photo: '/developers/dev-3.svg'
	}
] as const;
