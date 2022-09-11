import type { Handle } from '@sveltejs/kit';
import { type CookieOptions } from '@supabase/auth-helpers-shared';
export interface HandleCallbackOptions {
    cookieOptions?: CookieOptions;
    endpointPrefix?: string;
}
export declare const handleCallback: (options?: HandleCallbackOptions) => Handle;
