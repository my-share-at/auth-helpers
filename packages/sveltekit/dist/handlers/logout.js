import { COOKIE_OPTIONS, ENDPOINT_PREFIX, parseCookie } from '@supabase/auth-helpers-shared';
import { createSupabaseClient } from '../instance.js';
import { deleteTokens } from '../utils/deleteTokens.js';
import logger from '../utils/log.js';
export const handleLogout = (options = {}) => {
    const endpointPath = `${options.endpointPrefix ?? ENDPOINT_PREFIX}/logout`;
    const handle = async ({ event, resolve }) => {
        const req = event.request;
        let res = await resolve(event);
        // if not a logout route return
        if (event.url.pathname !== endpointPath) {
            return res;
        }
        // user implemented the route, warn
        if (!(res.status === 405 || res.status === 404)) {
            logger.warn(`@supabase/auth-helpers-sveltekit handles the route '${endpointPath}'`);
        }
        // check request method
        if (req.method !== 'GET') {
            const headers = new Headers({
                Allow: 'GET'
            });
            return new Response('Method Not Allowed', { headers, status: 405 });
        }
        const { supabaseClient } = createSupabaseClient();
        let returnTo = options?.returnTo ?? '/';
        returnTo = returnTo.startsWith('/') ? returnTo : `/${returnTo}`;
        const cookieOptions = { ...COOKIE_OPTIONS, ...options.cookieOptions };
        // Logout request to Gotrue
        const cookies = parseCookie(req.headers.get('cookie'));
        const access_token = cookies[`${cookieOptions.name}-access-token`];
        if (access_token)
            supabaseClient?.auth.api.signOut(access_token);
        deleteTokens({ req, res }, cookieOptions.name);
        const headers = new Headers(res.headers);
        headers.set('Location', returnTo);
        return new Response(null, { status: 303, headers });
    };
    return handle;
};
