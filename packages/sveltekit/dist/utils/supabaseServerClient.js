import { createSupabaseClient } from '../instance.js';
import { COOKIE_OPTIONS, parseCookie } from '@supabase/auth-helpers-shared';
/**
 * This is a helper method to wrap your SupabaseClient to inject a user's access_token to make use of RLS on the server side.
 *
 * ```js
 * import { supabaseServerClient } from '@supabase/auth-helpers-sveltekit';
 *
 * export const get: RequestHandler = ({ request }) => {
 *   // Run queries with RLS on the server
 *   const { data } = await supabaseServerClient(request)
 *     .from('test')
 *     .select('*');
 *   return {
 *     body: { data }, // will be passed to the page component as props
 *   }
 * }
 * ```
 */
function supabaseServerClient(requestOrAccessToken, cookieOptions = COOKIE_OPTIONS) {
    const { supabaseClient } = createSupabaseClient();
    const access_token = typeof requestOrAccessToken !== 'string'
        ? parseCookie(requestOrAccessToken?.headers.get('cookie'))?.[`${cookieOptions.name}-access-token`]
        : requestOrAccessToken;
    if (access_token !== null) {
        supabaseClient?.auth.setAuth(access_token);
    }
    return supabaseClient;
}
export default supabaseServerClient;
