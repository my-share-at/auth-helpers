import type { Handle } from '@sveltejs/kit';
export interface HandleUserOptions {
    endpointPrefix?: string;
}
export declare const handleUser: (options?: HandleUserOptions) => Handle;
