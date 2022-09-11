import { COOKIE_OPTIONS, TOKEN_REFRESH_MARGIN, ENDPOINT_PREFIX } from '@supabase/auth-helpers-shared';
import { handleSession } from './session.js';
import { handleCallback } from './callback.js';
import { handleLogout } from './logout.js';
import { handleUser } from './user.js';
export const handleAuth = (options = {}) => {
    const { logout } = options;
    const cookieOptions = { ...COOKIE_OPTIONS, ...options.cookieOptions };
    const tokenRefreshMargin = options.tokenRefreshMargin ?? TOKEN_REFRESH_MARGIN;
    const endpointPrefix = options.endpointPrefix ?? ENDPOINT_PREFIX;
    return [
        handleSession({ cookieOptions, tokenRefreshMargin }),
        handleCallback({ cookieOptions, endpointPrefix }),
        handleUser({ endpointPrefix }),
        handleLogout({ cookieOptions, endpointPrefix, ...logout })
    ];
};
