/** Shared TypeScript interfaces for the Cimahi Smart City platform. */

export type TicketStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved';

export interface Category {
	id: number;
	slug: string;
	name: string;
	description: string;
	icon: string;
}

export interface Profile {
	id: string;
	full_name: string | null;
	nik: string | null;
	district: string | null;
	phone: string | null;
	created_at: string;
}

export interface Ticket {
	id: string;
	code: string;
	user_id: string | null;
	category_id: number;
	title: string;
	description: string;
	latitude: number;
	longitude: number;
	address: string | null;
	photo_url: string | null;
	status: TicketStatus;
	is_public: boolean;
	created_at: string;
	updated_at: string;
	category?: Category;
	updates?: TicketUpdate[];
}

export interface TicketUpdate {
	id: number;
	ticket_id: string;
	status: TicketStatus;
	message: string;
	author_name: string;
	created_at: string;
}

export interface Amenity {
	id: number;
	name: string;
	type: 'government' | 'health' | 'emergency' | 'park' | 'transport' | 'education';
	address: string | null;
	latitude: number;
	longitude: number;
	phone: string | null;
	hours: string | null;
	description: string | null;
}

export interface TicketDraft {
	categoryId: number;
	title: string;
	description: string;
	latitude: number;
	longitude: number;
	address: string;
	photo: File | null;
	isPublic: boolean;
}

/** Kota Cimahi geographic constants */
export const CIMAHI_CENTER: [number, number] = [-6.8722, 107.5427];
export const CIMAHI_BOUNDS: [[number, number], [number, number]] = [
	[-6.935, 107.505],
	[-6.815, 107.6]
];

export const TICKET_STATUSES: { id: TicketStatus; label: string }[] = [
	{ id: 'submitted', label: 'Submitted' },
	{ id: 'under_review', label: 'Under Review' },
	{ id: 'in_progress', label: 'In Progress' },
	{ id: 'resolved', label: 'Resolved' }
];
