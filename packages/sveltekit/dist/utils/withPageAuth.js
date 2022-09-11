import { isFunction } from './guards.js';
/**
 *
 * @param {Object} options
 * @param {string} options.redirectTo
 * @param {Object} options.user
 * @param {number} options.status
 * @param fn
 * @returns
 */
export default async function withPageAuth({ redirectTo = '/', user, status = 303 }, fn) {
    if (!user) {
        return {
            redirect: redirectTo,
            status
        };
    }
    if (isFunction(fn)) {
        return fn();
    }
    return {
        status: 200
    };
}
