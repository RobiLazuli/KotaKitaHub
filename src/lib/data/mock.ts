import type { Amenity, Category, Ticket } from '$lib/types';

/** Demo data used when Supabase env vars are not configured yet. */

export const CATEGORIES: Category[] = [
	{ id: 1, slug: 'jalan-rusak', name: 'Jalan Rusak', description: 'Kerusakan jalan, lubang, drainase tersumbat', icon: 'cone' },
	{ id: 2, slug: 'penerangan', name: 'Penerangan Jalan', description: 'Lampu jalan (PJU) mati atau rusak', icon: 'lamp' },
	{ id: 3, slug: 'sampah', name: 'Sampah & Lingkungan', description: 'Tumpukan sampah, TPS liar, kebersihan lingkungan', icon: 'trash-2' },
	{ id: 4, slug: 'fasilitas', name: 'Fasilitas Umum', description: 'Taman, halte, dan fasilitas publik lainnya', icon: 'building' }
];

export const DEMO_TICKETS: Ticket[] = [
	{
		id: 'demo-1', code: 'CMH-2026-7K21', user_id: null, category_id: 1,
		title: 'Jalan berlubang di depan Balai Kota',
		description: 'Lubang besar cukup dalam, membahayakan pengendara motor di malam hari.',
		latitude: -6.8712, longitude: 107.5455, address: 'Jl. Rd. Demang Hardjakusumah',
		photo_url: null, status: 'in_progress', is_public: true,
		created_at: '2026-08-18T08:30:00Z', updated_at: '2026-08-29T10:00:00Z',
		updates: [
			{ id: 1, ticket_id: 'demo-1', status: 'submitted', message: 'Laporan diterima sistem.', author_name: 'Sistem', created_at: '2026-08-18T08:30:00Z' },
			{ id: 2, ticket_id: 'demo-1', status: 'under_review', message: 'Diverifikasi oleh Dinas PUPR.', author_name: 'Dinas PUPR', created_at: '2026-08-20T03:12:00Z' },
			{ id: 3, ticket_id: 'demo-1', status: 'in_progress', message: 'Tim perbaikan diturunkan ke lokasi.', author_name: 'Dinas PUPR', created_at: '2026-08-29T10:00:00Z' }
		]
	},
	{
		id: 'demo-2', code: 'CMH-2026-9P04', user_id: null, category_id: 2,
		title: 'Lampu PJU mati 3 hari',
		description: 'Lampu penerangan jalan mati total sejak 3 hari lalu, area gelap gulita.',
		latitude: -6.8903, longitude: 107.5538, address: 'Jl. Jend. H. Amir Machmud',
		photo_url: null, status: 'under_review', is_public: true,
		created_at: '2026-09-01T13:05:00Z', updated_at: '2026-09-02T09:40:00Z',
		updates: [
			{ id: 4, ticket_id: 'demo-2', status: 'submitted', message: 'Laporan diterima sistem.', author_name: 'Sistem', created_at: '2026-09-01T13:05:00Z' },
			{ id: 5, ticket_id: 'demo-2', status: 'under_review', message: 'Diteruskan ke UPT PJU.', author_name: 'Dinas Perhubungan', created_at: '2026-09-02T09:40:00Z' }
		]
	},
	{
		id: 'demo-3', code: 'CMH-2026-BX18', user_id: null, category_id: 3,
		title: 'TPS liar di Jl. Sriwijaya',
		description: 'Sampah menumpuk dan mengeluarkan bau, belum diangkut seminggu.',
		latitude: -6.9152, longitude: 107.5391, address: 'Jl. Sriwijaya, Cibeber',
		photo_url: null, status: 'submitted', is_public: true,
		created_at: '2026-09-03T02:20:00Z', updated_at: '2026-09-03T02:20:00Z',
		updates: [
			{ id: 6, ticket_id: 'demo-3', status: 'submitted', message: 'Laporan diterima sistem.', author_name: 'Sistem', created_at: '2026-09-03T02:20:00Z' }
		]
	},
	{
		id: 'demo-4', code: 'CMH-2026-DM77', user_id: null, category_id: 1,
		title: 'Retakan bahu jalan The Hive',
		description: 'Aspal retak dan amblas sebagian di dekat kawasan The Hive.',
		latitude: -6.8930, longitude: 107.5562, address: 'Jl. Amir Machmud',
		photo_url: null, status: 'resolved', is_public: true,
		created_at: '2026-07-28T06:10:00Z', updated_at: '2026-08-10T04:45:00Z',
		updates: [
			{ id: 7, ticket_id: 'demo-4', status: 'submitted', message: 'Laporan diterima sistem.', author_name: 'Sistem', created_at: '2026-07-28T06:10:00Z' },
			{ id: 8, ticket_id: 'demo-4', status: 'resolved', message: 'Perbaikan selesai, jalan kembali normal.', author_name: 'Dinas PUPR', created_at: '2026-08-10T04:45:00Z' }
		]
	},
	{
		id: 'demo-5', code: 'CMH-2026-FQ33', user_id: null, category_id: 2,
		title: 'Lampu taman alun-alun rusak',
		description: 'Dua lampu di area taman alun-alun padam sejak minggu lalu.',
		latitude: -6.8763, longitude: 107.5380, address: 'Taman Alun-Alun Cimahi',
		photo_url: null, status: 'resolved', is_public: true,
		created_at: '2026-08-25T11:00:00Z', updated_at: '2026-08-31T07:15:00Z',
		updates: [
			{ id: 9, ticket_id: 'demo-5', status: 'submitted', message: 'Laporan diterima sistem.', author_name: 'Sistem', created_at: '2026-08-25T11:00:00Z' },
			{ id: 10, ticket_id: 'demo-5', status: 'resolved', message: 'Lampu telah diganti petugas.', author_name: 'DLH Kota Cimahi', created_at: '2026-08-31T07:15:00Z' }
		]
	}
];

export const DEMO_AMENITIES: Amenity[] = [
	{ id: 1, name: 'Balai Kota Cimahi', type: 'government', address: 'Jl. Rd. Demang Hardjakusumah', latitude: -6.8722, longitude: 107.5424, phone: '(022) 6632834', hours: 'Senin–Jumat 08.00–15.00', description: 'Pusat pemerintahan Kota Cimahi.' },
	{ id: 2, name: 'DPMPTSP Kota Cimahi', type: 'government', address: 'Jl. Rd. Demang Hardjakusumah', latitude: -6.8729, longitude: 107.5437, phone: '(022) 6653550', hours: 'Senin–Jumat 08.00–15.00', description: 'Layanan perizinan terpadu satu pintu.' },
	{ id: 3, name: 'Disdukcapil Kota Cimahi', type: 'government', address: 'Jl. Rd. Demang Hardjakusumah', latitude: -6.8736, longitude: 107.5420, phone: '(022) 6614726', hours: 'Senin–Jumat 08.00–15.30', description: 'Layanan KTP, KK, dan akta kelahiran.' },
	{ id: 4, name: 'RSUD Cibabat', type: 'health', address: 'Jl. Raya Cibabat No. 391', latitude: -6.8533, longitude: 107.5660, phone: '(022) 6650335', hours: '24 Jam', description: 'Rumah sakit umum daerah Kota Cimahi.' },
	{ id: 5, name: 'Puskesmas Cimahi Tengah', type: 'health', address: 'Jl. Encep Kartawiria', latitude: -6.8836, longitude: 107.5422, phone: '(022) 6652064', hours: 'Senin–Sabtu 07.30–14.00', description: 'Pelayanan kesehatan tingkat pertama.' },
	{ id: 6, name: 'Pemadam Kebakaran Kota Cimahi', type: 'emergency', address: 'Jl. Baros, Baros, Cimahi Tengah', latitude: -6.8916, longitude: 107.5320, phone: '113', hours: '24 Jam', description: 'Damkar Kota Cimahi.' },
	{ id: 7, name: 'Polres Cimahi', type: 'emergency', address: 'Jl. Jend. H. Amir Machmud No. 911', latitude: -6.8973, longitude: 107.5656, phone: '(022) 6657110', hours: '24 Jam', description: 'Kepolisian Resor Kota Cimahi.' },
	{ id: 8, name: 'Taman Alun-Alun Cimahi', type: 'park', address: 'Jl. Rd. Demang Hardjakusumah', latitude: -6.8760, longitude: 107.5370, phone: null, hours: '06.00–21.00', description: 'Ruang terbuka hijau pusat kota.' },
	{ id: 9, name: 'Taman Kehat Kejutan', type: 'park', address: 'Jl. Sriwijaya, Cibeber', latitude: -6.9165, longitude: 107.5407, phone: null, hours: '06.00–18.00', description: 'Taman koleksi tanaman & jogging track.' },
	{ id: 10, name: 'Stasiun Cimahi', type: 'transport', address: 'Jl. Stasiun, Cimahi Utara', latitude: -6.8858, longitude: 107.5361, phone: null, hours: '04.00–22.00', description: 'Stasiun kereta api Cimahi.' },
	{ id: 11, name: 'Terminal Cibeureum', type: 'transport', address: 'Jl. Raya Cibeureum', latitude: -6.9189, longitude: 107.5496, phone: null, hours: '05.00–20.00', description: 'Terminal bus utama Cimahi Selatan.' },
	{ id: 12, name: 'SDN 1 Cimahi', type: 'education', address: 'Jl. Rd. Demang Hardjakusumah', latitude: -6.8740, longitude: 107.5398, phone: null, hours: 'Senin–Jumat 07.00–14.00', description: 'Sekolah dasar negeri pusat kota.' }
];

/** Simulated congestion on Cimahi's main arteries (mock traffic layer). */
export const MOCK_TRAFFIC: { id: number; road: string; level: 'smooth' | 'moderate' | 'heavy'; path: [number, number][] }[] = [
	{
		id: 1, road: 'Jl. Raya Barat', level: 'heavy',
		path: [[-6.8698, 107.5120], [-6.8712, 107.5260], [-6.8722, 107.5424], [-6.8735, 107.5640], [-6.8751, 107.5810]]
	},
	{
		id: 2, road: 'Jl. Jend. H. Amir Machmud', level: 'moderate',
		path: [[-6.8790, 107.5360], [-6.8855, 107.5490], [-6.8973, 107.5656], [-6.9128, 107.5845]]
	},
	{
		id: 3, road: 'Jl. Raya Cibabat', level: 'smooth',
		path: [[-6.8533, 107.5660], [-6.8610, 107.5620], [-6.8705, 107.5575]]
	},
	{
		id: 4, road: 'Jl. Raya Cibeureum', level: 'moderate',
		path: [[-6.9189, 107.5496], [-6.9040, 107.5455], [-6.8900, 107.5420]]
	}
];
