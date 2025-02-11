import { NextMiddleware } from 'next/server';

interface withMiddlewareAuthOptions {
    /**
     * Path relative to the site root to redirect an
     * unauthenticated visitor.
     *
     * The original request route will be appended via
     * a `redirectedFrom` query parameter, ex: `?redirectedFrom=%2Fdashboard`
     */
    redirectTo?: string;
    cookieOptions?: CookieOptions;
    tokenRefreshMargin?: number;
    authGuard?: {
        isPermitted: (user: User) => Promise<boolean>;
        redirectTo: string;
    };
}
declare type withMiddlewareAuth = (options?: withMiddlewareAuthOptions) => NextMiddleware;
declare const withMiddlewareAuth: withMiddlewareAuth;

export { withMiddlewareAuth };
