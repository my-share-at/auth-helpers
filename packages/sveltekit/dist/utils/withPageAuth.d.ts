import type { User } from '@supabase/supabase-js';
import type { LoadOutput } from '@sveltejs/kit';
interface PageAuthOpts {
    redirectTo?: string;
    status?: number;
    user: User;
}
/**
 *
 * @param {Object} options
 * @param {string} options.redirectTo
 * @param {Object} options.user
 * @param {number} options.status
 * @param fn
 * @returns
 */
export default function withPageAuth({ redirectTo, user, status }: PageAuthOpts, fn?: () => LoadOutput | Promise<LoadOutput>): Promise<LoadOutput<Record<string, any>>>;
export {};
