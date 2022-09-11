import type { User } from '@supabase/supabase-js';
import { type CookieOptions, type ErrorPayload } from '@supabase/auth-helpers-shared';
import type { RequestResponse } from '../types';
export interface GetUserOptions {
    cookieOptions?: CookieOptions;
    forceRefresh?: boolean;
    tokenRefreshMargin?: number;
}
interface UserResponse {
    user: User | null;
    accessToken: string | null;
    refreshToken?: string;
    error?: ErrorPayload | string;
}
/**
 * Get a user from a cookie or from the supabase API
 * Note: This function no longer saves the token into a cookie, for this
 * you will need to use the getUserAndSaveTokens function instead.
 * @param req Request
 * @param options GetUserOptions
 * @returns Promise<UserResponse>
 */
export declare function getUser(req: Request, options?: GetUserOptions): Promise<UserResponse>;
export declare function saveTokens({ req, res }: RequestResponse, session: UserResponse, options?: GetUserOptions): UserResponse | undefined;
export default function getUserAndSaveTokens({ req, res }: RequestResponse, options?: GetUserOptions): Promise<UserResponse>;
export {};
