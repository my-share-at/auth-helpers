import * as _supabase_supabase_js from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
export { SupabaseClient, User } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse, GetServerSidePropsContext, GetServerSideProps, NextApiHandler } from 'next';
import { CookieOptions } from '@supabase/auth-helpers-shared';

interface HandleAuthOptions {
    cookieOptions?: CookieOptions;
    logout?: {
        returnTo?: string;
    };
    tokenRefreshMargin?: number;
}
declare function handleAuth(options?: HandleAuthOptions): (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

interface ResponsePayload {
    user: User | null;
    accessToken: string | null;
    error?: ErrorPayload;
}
interface GetUserOptions {
    cookieOptions?: CookieOptions;
    forceRefresh?: boolean;
    tokenRefreshMargin?: number;
}
declare function getUser(context: GetServerSidePropsContext | {
    req: NextApiRequest;
    res: NextApiResponse;
}, options?: GetUserOptions): Promise<ResponsePayload>;

interface GetProviderTokenOptions {
    cookieOptions?: CookieOptions;
}
/**
 * Retrieve provider token from cookies
 * @param context
 * @param { GetProviderTokenOptions } options
 * @returns {string}
 */
declare function getProviderToken(context: GetServerSidePropsContext | {
    req: NextApiRequest;
    res: NextApiResponse;
}, options?: GetProviderTokenOptions): string;

/**
 * ## Protecting Pages with Server Side Rendering (SSR)
 * If you wrap your `getServerSideProps` with {@link withPageAuth} your props object will be augmented with
 * the user object {@link User}
 *
 * ```js
 * // pages/profile.js
 * import { withPageAuth } from '@supabase/auth-helpers-nextjs';
 *
 * export default function Profile({ user }) {
 *   return <div>Hello {user.name}</div>;
 * }
 *
 * export const getServerSideProps = withPageAuth({ redirectTo: '/login' });
 * ```
 *
 * If there is no authenticated user, they will be redirect to your home page, unless you specify the `redirectTo` option.
 *
 * You can pass in your own `getServerSideProps` method, the props returned from this will be merged with the
 * user props. You can also access the user session data by calling `getUser` inside of this method, eg:
 *
 * ```js
 * // pages/protected-page.js
 * import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
 *
 * export default function ProtectedPage({ user, customProp }) {
 *   return <div>Protected content</div>;
 * }
 *
 * export const getServerSideProps = withPageAuth({
 *   redirectTo: '/foo',
 *   async getServerSideProps(ctx) {
 *     // Run queries with RLS on the server
 *     const { data } = await supabaseServerClient(ctx).from('test').select('*');
 *     return { props: { data } };
 *   }
 * });
 * ```
 *
 * @category Server
 */
declare function withPageAuth({ authRequired, redirectTo, getServerSideProps, cookieOptions, tokenRefreshMargin }?: {
    authRequired?: boolean;
    redirectTo?: string;
    getServerSideProps?: GetServerSideProps;
    cookieOptions?: CookieOptions;
    tokenRefreshMargin?: number;
}): (context: GetServerSidePropsContext) => Promise<any>;

/**
 * ## Protecting API routes
 * Wrap an API Route to check that the user has a valid session. If they're not logged in the handler will return a
 * 401 Unauthorized.
 *
 * ```js
 * // pages/api/protected-route.js
 * import { withApiAuth, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
 *
 * export default withApiAuth(async function ProtectedRoute(req, res) {
 *   // Run queries with RLS on the server
 *   const { data } = await supabaseServerClient({ req, res }).from('test').select('*');
 *   res.json(data)
 * });
 * ```
 *
 * If you visit `/api/protected-route` without a valid session cookie, you will get a 401 response.
 *
 * @category Server
 */
declare function withApiAuth(handler: NextApiHandler, options?: {
    cookieOptions?: CookieOptions;
    tokenRefreshMargin?: number;
}): (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

declare const supabaseClient: _supabase_supabase_js.SupabaseClient;

/**
 * This is a helper method to wrap your SupabaseClient to inject a user's access_token to make use of RLS on the server side.
 *
 * ```js
 * import { supabaseServerClient } from '@supabase/auth-helpers-nextjs';
 *
 * export async function getServerSideProps(context) {
 *   // Run queries with RLS on the server
 *   const { data } = await supabaseServerClient(context)
 *     .from('test')
 *     .select('*');
 *   return {
 *     props: { data }, // will be passed to the page component as props
 *   }
 * }
 * ```
 *
 * @param supabaseClient
 * @param context
 * @param cookieOptions
 * @returns supabaseClient
 *
 * @category Server
 */
declare function supabaseServerClient(context: GetServerSidePropsContext | {
    req: NextApiRequest;
}, cookieOptions?: CookieOptions): SupabaseClient;

declare const logger: {
    log: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    info: (message?: any, ...optionalParams: any[]) => void;
    debug: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
};

export { getProviderToken, getUser, handleAuth, logger, supabaseClient, supabaseServerClient, withApiAuth, withPageAuth };
