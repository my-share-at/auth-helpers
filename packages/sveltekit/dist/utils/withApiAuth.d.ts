import type { User } from '@supabase/supabase-js';
interface ApiAuthOpts {
    redirectTo?: string;
    status?: number;
    user: User;
}
export default function withApiAuth<T>({ redirectTo, user, status }: ApiAuthOpts, fn: () => T): Promise<T | {
    status: number;
    headers: {
        location: string;
    };
} | {
    status: number;
    headers?: undefined;
}>;
export {};
