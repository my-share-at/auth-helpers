import type { Handle } from '@sveltejs/kit';
import { type CookieOptions } from '@supabase/auth-helpers-shared';
export interface HandleUserOptions {
    cookieOptions?: CookieOptions;
    tokenRefreshMargin?: number;
}
export declare const handleSession: (options?: HandleUserOptions) => Handle;
