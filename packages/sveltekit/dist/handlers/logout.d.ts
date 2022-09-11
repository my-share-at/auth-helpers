import type { Handle } from '@sveltejs/kit';
import { type CookieOptions } from '@supabase/auth-helpers-shared';
export interface HandleOptions {
    cookieOptions?: CookieOptions;
    returnTo?: string;
    endpointPrefix?: string;
}
export declare const handleLogout: (options?: HandleOptions) => Handle;
