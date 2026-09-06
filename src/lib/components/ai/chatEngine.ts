import { DEMO_AMENITIES } from '$lib/data/mock';
import type { Amenity } from '$lib/types';

export interface ChatMessage {
	id: number;
	role: 'user' | 'assistant';
	text: string;
	suggestions?: string[];
}

interface Rule {
	keywords: string[];
	response: () => string;
	suggestions?: string[];
}

function amenityText(filter: (a: Amenity) => boolean): string {
	const list = DEMO_AMENITIES.filter(filter);
	if (!list.length) return 'Maaf, saya belum menemukan data tersebut untuk Kota Cimahi.';
	return list
		.map(
			(a) =>
				`• ${a.name} — ${a.address ?? 'Cimahi'}` +
				(a.hours ? ` (${a.hours})` : '') +
				(a.phone ? ` Telp ${a.phone}` : '')
		)
		.join('\n');
}

const CREATE_TIP =
	'\n\nJika memerlukan penanganan langsung di lapangan, silakan buat laporan melalui menu "Buat Laporan" — tim saya akan membantu melacaknya dengan kode tiket.';

const RULES: Rule[] = [
	{
		keywords: ['ktp', 'ktp-el', 'ktp elektronik', 'kartu tanda penduduk'],
		response: () =>
			'Untuk pengurusan KTP-el di Kota Cimahi:\n• Bawa fotokopi Kartu Keluarga (KK) asli.\n• Pengambilan dilakukan di Disdukcapil, Jl. Rd. Demang Hardjakusumah (kompleks Pemkot Cimahi).\n• Perekaman bagi warga berusia 17 tahun ke atas.\n• Layanan Senin–Jumat 08.00–15.30, gratis.' +
			CREATE_TIP,
		suggestions: ['Jam layanan Disdukcapil?', 'Cara buat laporan?']
	},
	{
		keywords: ['perizinan', 'izin', 'oss', 'ptsp', 'iumk', 'siup'],
		response: () =>
			'Layanan perizinan Kota Cimahi dikelola oleh DPMPTSP (Mal Pelayanan Perizinan) di kompleks Pemkot Cimahi. Perizinan usaha kini terintegrasi melalui sistem OSS-RBA di oss.go.id. Kantor DPMPTSP buka Senin–Jumat 08.00–15.00, telp (022) 6653550.' +
			CREATE_TIP,
		suggestions: ['Di mana kantor DPMPTSP?', 'Apa itu retribusi?']
	},
	{
		keywords: ['retribusi', 'pajak daerah', 'pbb'],
		response: () =>
			'Pembayaran retribusi dan pajak daerah (PBB-P2, BPHTB, dl.) dilakukan melalui Bapenda Kota Cimahi. Pembayaran bisa via bank mitra atau kanal resmi pemerintah daerah. Untuk rincian nilai retribusi sesuai jenis layanan, silakan cek langsung di loket pelayanan.' +
			CREATE_TIP
	},
	{
		keywords: ['jam kerja', 'jam layanan', 'buka jam', 'apakah buka'],
		response: () =>
			'Jam layanan umum kantor pemerintah Kota Cimahi:\n• Senin–Kamis: 08.00–15.00 WIB\n• Jumat: 08.00–11.30 & 13.00–15.30 WIB\n• RSUD Cibabat, Polres, dan Damkar melayani 24 jam.',
		suggestions: ['Lokasi kantor pemkot?', 'Puskesmas terdekat']
	},
	{
		keywords: ['puskesmas', 'rumah sakit', 'klinik', 'dokter', 'berobat'],
		response: () => 'Fasilitas kesehatan di Kota Cimahi:\n' + amenityText((a) => a.type === 'health'),
		suggestions: ['Lihat peta fasilitas', 'Nomor darurat 112']
	},
	{
		keywords: ['taman', 'ruang terbuka', 'rekreasi', 'jogging', 'alun-alun'],
		response: () => 'Taman & ruang terbuka hijau di Kota Cimahi:\n' + amenityText((a) => a.type === 'park'),
		suggestions: ['Lihat peta kota']
	},
	{
		keywords: ['stasiun', 'terminal', 'kereta', 'angkot', 'transportasi'],
		response: () => 'Simpul transportasi utama:\n' + amenityText((a) => a.type === 'transport'),
		suggestions: ['Lihat peta kota']
	},
	{
		keywords: ['darurat', 'kebakaran', 'polisi', 'ambulans', '112'],
		response: () =>
			'Nomor darurat Kota Cimahi (panggilan 24 jam):\n• Layanan Darurat Terpadu: 112\n• Polres Cimahi: (022) 6657110\n• Pemadam Kebakaran: (022) 6620113\n• RSUD Cibabat (IGD): (022) 6650335',
		suggestions: ['Kantor polisi di mana?']
	},
	{
		keywords: ['lapor', 'laporan', 'aduan', 'pengaduan', 'tiket', 'keluhan'],
		response: () =>
			'Anda dapat melaporkan masalah kota (jalan rusak, lampu PJU mati, sampah menumpuk, fasilitas umum) melalui menu "Buat Laporan". Setiap laporan mendapatkan kode tiket unik seperti CMH-2026-XXXX yang bisa dilacak real-time.',
		suggestions: ['Cara melacak tiket?', 'Kategori laporan apa saja?']
	},
	{
		keywords: ['lacak', 'tracking', 'status tiket', 'kode tiket'],
		response: () =>
			'Masukkan kode tiket Anda (format CMH-2026-XXXX) di halaman Laporan > Lacak Tiket, atau lihat riwayat lengkapnya di Dashboard setelah masuk ke akun.'
	},
	{
		keywords: ['cerdas asri', 'cimahi', 'tentang kota', 'wiki'],
		response: () =>
			'Kota Cimahi adalah kota otonom di Jawa Barat berjuluk "Kota Tentara", terdiri dari 3 kecamatan (Cimahi Utara, Tengah, Selatan) dan 15 kelurahan. Portal ini adalah proyek eksperimental menuju Cimahi yang berkelanjutan: layanan publik lebih mudah, kota lebih bersih, dan mobilitas lebih lancar.'
	}
];

const FALLBACK =
	'Maaf, saya belum menemukan jawaban yang tepat. Saya bisa membantu seputar: layanan KTP & KK, perizinan, retribusi, fasilitas kesehatan, taman, transportasi, dan cara membuat laporan warga.';

/** Rule-based local assistant for Kota Cimahi. */
export function getAnswer(input: string): { text: string; suggestions: string[] } {
	const q = input.toLowerCase();
	for (const rule of RULES) {
		if (rule.keywords.some((k) => q.includes(k))) {
			return { text: rule.response(), suggestions: rule.suggestions ?? [] };
		}
	}
	return {
		text: FALLBACK,
		suggestions: ['Cara membuat laporan?', 'Nomor darurat 112', 'Puskesmas terdekat']
	};
}

export const GREETING =
	'Halo! Saya asisten virtual Kota Cimahi. Tanyakan apa saja seputar layanan publik, fasilitas kota, atau cara membuat laporan warga.';
