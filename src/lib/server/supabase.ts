import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { isSupabaseConfigured } from '$lib/supabase/client';
import type { RequestEvent } from '@sveltejs/kit';

type CookieOptions = Record<string, unknown>;

/**
 * Creates a request-scoped Supabase server client that reads/writes
 * auth cookies via SvelteKit's cookie API. Returns null in demo mode.
 */
export function createSupabaseServerClient(event: RequestEvent) {
	if (!isSupabaseConfigured) return null;

	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookies: { name: string; value: string; options: CookieOptions }[]) => {
				cookies.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, {
						...(options as object),
						path: '/'
					});
				});
			}
		}
	});
}
