import { CATEGORIES, DEMO_AMENITIES, DEMO_TICKETS } from '$lib/data/mock';
import { getSupabase } from '$lib/supabase/client';
import type { Amenity, Category, Ticket, TicketDraft } from '$lib/types';
import { get, writable } from 'svelte/store';
import { auth } from './auth';

export interface ReportsState {
	tickets: Ticket[];
	categories: Category[];
	amenities: Amenity[];
	loading: boolean;
}

function generateCode(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
	let suffix = '';
	for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
	return `CMH-2026-${suffix}`;
}

function createReportsStore() {
	const { subscribe, set, update } = writable<ReportsState>({
		tickets: [],
		categories: CATEGORIES,
		amenities: DEMO_AMENITIES,
		loading: true
	});

	return {
		subscribe,

		/** Load tickets, categories & amenities (Supabase when configured, demo data otherwise). */
		async loadAll() {
			const supabase = getSupabase();

			if (!supabase) {
				set({ tickets: DEMO_TICKETS, categories: CATEGORIES, amenities: DEMO_AMENITIES, loading: false });
				return;
			}

			const [{ data: tickets }, { data: categories }, { data: amenities }] = await Promise.all([
				supabase
					.from('tickets')
					.select('*, updates:ticket_updates(*)')
					.order('created_at', { ascending: false }),
				supabase.from('categories').select('*').order('id'),
				supabase.from('amenities').select('*').order('type')
			]);

			set({
				tickets: (tickets as Ticket[]) ?? [],
				categories: (categories as Category[]) ?? CATEGORIES,
				amenities: (amenities as Amenity[]) ?? DEMO_AMENITIES,
				loading: false
			});
		},

		/** Create a new report: uploads the photo (if any) then inserts the ticket. */
		async createTicket(draft: TicketDraft): Promise<{ ticket: Ticket | null; error: string | null }> {
			const supabase = getSupabase();
			const { user } = get(auth);

			if (!supabase) {
				// Demo mode: keep the ticket in memory for the session.
				const now = new Date().toISOString();
				const ticket: Ticket = {
					id: crypto.randomUUID(),
					code: generateCode(),
					user_id: user?.id ?? 'demo-user-001',
					category_id: draft.categoryId,
					title: draft.title,
					description: draft.description,
					latitude: draft.latitude,
					longitude: draft.longitude,
					address: draft.address,
					photo_url: null,
					status: 'submitted',
					is_public: draft.isPublic,
					created_at: now,
					updated_at: now,
					updates: [
						{
							id: Date.now(),
							ticket_id: '',
							status: 'submitted',
							message: 'Laporan diterima sistem.',
							author_name: 'Sistem',
							created_at: now
						}
					]
				};
				update((s) => ({ ...s, tickets: [ticket, ...s.tickets] }));
				return { ticket, error: null };
			}

			if (!user) return { ticket: null, error: 'Silakan masuk terlebih dahulu.' };

			let photoUrl: string | null = null;
			if (draft.photo) {
				const ext = draft.photo.name.split('.').pop() ?? 'jpg';
				const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
				const { error: uploadError } = await supabase.storage
					.from('report-photos')
					.upload(path, draft.photo);
				if (uploadError) return { ticket: null, error: `Gagal mengunggah foto: ${uploadError.message}` };

				const {
					data: { publicUrl }
				} = supabase.storage.from('report-photos').getPublicUrl(path);
				photoUrl = publicUrl;
			}

			const { data, error } = await supabase
				.from('tickets')
				.insert({
					code: generateCode(),
					user_id: user.id,
					category_id: draft.categoryId,
					title: draft.title,
					description: draft.description,
					latitude: draft.latitude,
					longitude: draft.longitude,
					address: draft.address,
					photo_url: photoUrl,
					is_public: draft.isPublic
				})
				.select()
				.single();

			if (error) return { ticket: null, error: error.message };

			const ticket = data as Ticket;
			update((s) => ({ ...s, tickets: [ticket, ...s.tickets] }));
			return { ticket, error: null };
		},

		/** Find a ticket by its public tracking code (e.g. CMH-2026-7K21). */
		async trackByCode(code: string): Promise<Ticket | null> {
			const normalized = code.trim().toUpperCase();
			const supabase = getSupabase();

			if (!supabase) {
				const local = get({ subscribe }).tickets.find((t) => t.code === normalized);
				return local ?? null;
			}

			const { data } = await supabase
				.from('tickets')
				.select('*, updates:ticket_updates(*)')
				.eq('code', normalized)
				.maybeSingle();
			return (data as Ticket) ?? null;
		},

		/** All tickets owned by the currently signed-in user. */
		myTickets(): Ticket[] {
			const { user } = get(auth);
			if (!user) return [];
			return get({ subscribe }).tickets.filter((t) => t.user_id === user.id);
		}
	};
}

export const reports = createReportsStore();
