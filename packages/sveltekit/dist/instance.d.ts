export declare const createSupabaseClient: (url?: string, anonKey?: string) => {
    apiInfo: {
        supabaseUrl: string | undefined;
        supabaseAnonKey: string | undefined;
    };
    supabaseClient: import("@supabase/supabase-js").SupabaseClient | undefined;
};
/**
 * @deprecated use `createSupabaseClient` method instead
 */
export declare const skHelper: (url?: string, anonKey?: string) => {
    apiInfo: {
        supabaseUrl: string | undefined;
        supabaseAnonKey: string | undefined;
    };
    supabaseClient: import("@supabase/supabase-js").SupabaseClient | undefined;
};
