import type { SupabaseClient } from '@supabase/supabase-js';
import { type CookieOptions } from '@supabase/auth-helpers-shared';
/**
 * This is a helper method to wrap your SupabaseClient to inject a user's access_token to make use of RLS on the server side.
 * @param accessToken
 * @param cookieOptions
 */
declare function supabaseServerClient(accessToken: string, cookieOptions?: CookieOptions): SupabaseClient;
/**
 * This is a helper method to wrap your SupabaseClient to inject a user's access_token from the request header to make use of RLS on the server side.
 * @param request
 * @param cookieOptions
 * @returns SupabaseClient
 */
declare function supabaseServerClient(request: Request, cookieOptions?: CookieOptions): SupabaseClient;
export default supabaseServerClient;
