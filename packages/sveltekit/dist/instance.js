import { getClientWithEnvCheck } from './utils/initSupabase.js';
let supabaseUrl;
let supabaseAnonKey;
export const createSupabaseClient = (url, anonKey) => {
    if (!supabaseUrl || !supabaseAnonKey) {
        supabaseUrl = url;
        supabaseAnonKey = anonKey;
    }
    return {
        apiInfo: { supabaseUrl, supabaseAnonKey },
        supabaseClient: (function () {
            if (supabaseUrl && supabaseAnonKey) {
                return getClientWithEnvCheck(supabaseUrl, supabaseAnonKey);
            }
        })()
    };
};
/**
 * @deprecated use `createSupabaseClient` method instead
 */
export const skHelper = createSupabaseClient;
