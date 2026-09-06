import { browser } from '$app/environment';
import { getSupabase, isSupabaseConfigured } from '$lib/supabase/client';
import type { Profile } from '$lib/types';
import type { User } from '@supabase/supabase-js';
import { derived, writable } from 'svelte/store';

export interface AuthState {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	/** True when the app runs without configured Supabase credentials. */
	demoMode: boolean;
}

const DEMO_USER_KEY = 'cimahi-demo-user';

function readDemoUser(): User | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(DEMO_USER_KEY);
		return raw ? (JSON.parse(raw) as User) : null;
	} catch {
		return null;
	}
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		profile: null,
		loading: true,
		demoMode: !isSupabaseConfigured
	});

	return {
		subscribe,

		/** Bootstrap auth state — call once from the root layout. */
		async initialize() {
			const supabase = getSupabase();

			if (!supabase) {
				const demoUser = readDemoUser();
				set({ user: demoUser, profile: null, loading: false, demoMode: true });
				return;
			}

			const {
				data: { session }
			} = await supabase.auth.getSession();
			const user = session?.user ?? null;
			set({ user, profile: null, loading: false, demoMode: false });
			if (user) void this.loadProfile();

			supabase.auth.onAuthStateChange((_event, nextSession) => {
				update((s) => ({ ...s, user: nextSession?.user ?? null, loading: false }));
				if (nextSession?.user) void this.loadProfile();
			});
		},

		async loadProfile() {
			const supabase = getSupabase();
			if (!supabase) return;
			const { data, error } = await supabase.from('profiles').select('*').single();
			if (!error && data) update((s) => ({ ...s, profile: data as Profile }));
		},

		async signInWithEmail(email: string, password: string): Promise<{ error: string | null }> {
			const supabase = getSupabase();

			if (!supabase) {
				// Demo mode: simulate an instant local login.
				const demoUser = {
					id: 'demo-user-001',
					email,
					aud: 'authenticated',
					role: 'authenticated',
					created_at: new Date().toISOString()
				} as User;
				if (browser) localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
				update((s) => ({ ...s, user: demoUser }));
				return { error: null };
			}

			const { error } = await supabase.auth.signInWithPassword({ email, password });
			return { error: error?.message ?? null };
		},

		async signUp(email: string, password: string, fullName: string): Promise<{ error: string | null }> {
			const supabase = getSupabase();
			if (!supabase) return this.signInWithEmail(email, password);

			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: { data: { full_name: fullName } }
			});
			return { error: error?.message ?? null };
		},

		/** Passwordless phone OTP login (requires Twilio/etc. configured in Supabase). */
		async signInWithPhoneOtp(phone: string): Promise<{ error: string | null }> {
			const supabase = getSupabase();
			if (!supabase) return { error: 'OTP memerlukan konfigurasi Supabase (mode demo aktif).' };

			const { error } = await supabase.auth.signInWithOtp({ phone });
			return { error: error?.message ?? null };
		},

		async verifyOtp(phone: string, token: string): Promise<{ error: string | null }> {
			const supabase = getSupabase();
			if (!supabase) return { error: 'OTP memerlukan konfigurasi Supabase (mode demo aktif).' };

			const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
			return { error: error?.message ?? null };
		},

		async updateProfile(profile: Partial<Profile>): Promise<{ error: string | null }> {
			const supabase = getSupabase();
			if (!supabase) {
				update((s) =>
					s.profile
						? { ...s, profile: { ...s.profile, ...profile } }
						: {
								...s,
								profile: {
									id: 'demo-user-001',
									full_name: profile.full_name ?? 'Warga Demo',
									nik: null,
									district: null,
									phone: null,
									created_at: new Date().toISOString(),
									...profile
								} as Profile
							}
				);
				return { error: null };
			}

			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (!user) return { error: 'Sesi berakhir, silakan masuk kembali.' };

			const { error } = await supabase.from('profiles').update(profile).eq('id', user.id);
			if (!error) await this.loadProfile();
			return { error: error?.message ?? null };
		},

		async signOut() {
			const supabase = getSupabase();
			if (supabase) await supabase.auth.signOut();
			if (browser) localStorage.removeItem(DEMO_USER_KEY);
			update((s) => ({ ...s, user: null, profile: null }));
		}
	};
}

export const auth = createAuthStore();
export const isLoggedIn = derived(auth, ($auth) => $auth.user !== null);
