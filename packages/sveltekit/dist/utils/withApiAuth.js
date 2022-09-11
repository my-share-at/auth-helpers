import { isFunction } from './guards.js';
export default async function withApiAuth({ redirectTo = '/', user, status = 303 }, fn) {
    if (!user) {
        return {
            status,
            headers: {
                location: redirectTo
            }
        };
    }
    if (isFunction(fn)) {
        return fn();
    }
    return {
        status: 200
    };
}
