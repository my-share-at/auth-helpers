import { setCookies, SvelteKitRequestAdapter, SvelteKitResponseAdapter } from "@supabase/auth-helpers-shared";
export function deleteTokens({ req, res }, cookieName) {
    setCookies(new SvelteKitRequestAdapter(req), new SvelteKitResponseAdapter(res), ['access-token', 'refresh-token', 'provider-token'].map((key) => ({
        name: `${cookieName}-${key}`,
        value: '',
        maxAge: -1
    })));
}
