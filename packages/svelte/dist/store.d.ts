import type { User } from '@supabase/supabase-js';
import type { ErrorPayload } from '@supabase/auth-helpers-shared';
export declare type UserExtra = User & {
    exp?: number;
};
declare const user: import("svelte/store").Writable<User>;
declare const setUser: (usr: User | null) => void;
declare const accessToken: import("svelte/store").Writable<string>;
declare const setAccessToken: (token: string) => void;
declare const isLoading: import("svelte/store").Writable<boolean>;
declare const setIsLoading: (loading: boolean) => void;
declare const error: import("svelte/store").Writable<ErrorPayload>;
declare const setError: (err: ErrorPayload) => void;
declare const resetAll: () => void;
export { user, setUser, accessToken, setAccessToken, isLoading, setIsLoading, error, setError, resetAll };
