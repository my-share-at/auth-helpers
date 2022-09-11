import { type CookieOptions } from '@supabase/auth-helpers-shared';
interface GetProviderTokenOptions {
    cookieOptions?: CookieOptions;
}
/**
 * Retrieve provider token from cookies
 * @param { Request } req FetchAPI request object
 * @param { GetProviderTokenOptions } options
 * @returns {string}
 */
export declare function getProviderToken(req: Request, options?: GetProviderTokenOptions): any;
export {};
