import { type CookieOptions } from '@supabase/auth-helpers-shared';
export interface HandleAuthOptions {
    cookieOptions?: CookieOptions;
    logout?: {
        returnTo?: string;
    };
    tokenRefreshMargin?: number;
    endpointPrefix?: string;
}
export declare const handleAuth: (options?: HandleAuthOptions) => import("@sveltejs/kit").Handle[];
