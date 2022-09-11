import type { SupabaseClient, User } from '@supabase/supabase-js';
export interface Session {
    user: User | null;
    accessToken?: string | null;
    error?: string | null;
}
interface CheckSessionArgs {
    profileUrl: string;
    autoRefreshToken: boolean;
    supabaseClient: SupabaseClient;
}
export declare const checkSession: (props: CheckSessionArgs) => Promise<void>;
export {};
