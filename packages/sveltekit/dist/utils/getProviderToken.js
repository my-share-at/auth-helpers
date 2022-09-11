import { COOKIE_OPTIONS, parseCookie, ProviderTokenNotFound } from '@supabase/auth-helpers-shared';
/**
 * Retrieve provider token from cookies
 * @param { Request } req FetchAPI request object
 * @param { GetProviderTokenOptions } options
 * @returns {string}
 */
export function getProviderToken(req, options = {}) {
    const cookieOptions = { ...COOKIE_OPTIONS, ...options.cookieOptions };
    const cookies = parseCookie(req.headers.get('cookie'));
    const providerToken = cookies[`${cookieOptions.name}-provider-token`];
    if (!providerToken) {
        throw new ProviderTokenNotFound();
    }
    return providerToken;
}
