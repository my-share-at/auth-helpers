import { SvelteComponentTyped } from "svelte";
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Writable } from 'svelte/store';
import { type Session } from './helpers';
declare const __propDef: {
    props: {
        supabaseClient: SupabaseClient;
        endpointPrefix?: string;
        callbackUrl?: string;
        profileUrl?: string;
        autoRefreshToken?: boolean;
        session: Writable<Session>;
        onUserUpdate?: (user: User | null) => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type SupaAuthHelperProps = typeof __propDef.props;
export declare type SupaAuthHelperEvents = typeof __propDef.events;
export declare type SupaAuthHelperSlots = typeof __propDef.slots;
export default class SupaAuthHelper extends SvelteComponentTyped<SupaAuthHelperProps, SupaAuthHelperEvents, SupaAuthHelperSlots> {
}
export {};
