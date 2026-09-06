import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

/** True when real Supabase credentials are configured; false -> demo (mock) mode. */
export const isSupabaseConfigured =
	!!PUBLIC_SUPABASE_URL &&
	!!PUBLIC_SUPABASE_ANON_KEY &&
	PUBLIC_SUPABASE_URL.startsWith('https://') &&
	!PUBLIC_SUPABASE_URL.includes('your-project');

let browserClient: SupabaseClient | null = null;

/**
 * Shared browser-side Supabase client (singleton).
 * Returns null when env vars are absent so the app can fall back to demo data.
 */
export function getSupabase(): SupabaseClient | null {
	if (!isSupabaseConfigured) return null;
	if (!browserClient) {
		browserClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	}
	return browserClient;
}
