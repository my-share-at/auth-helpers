var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middleware/index.ts
var middleware_exports = {};
__export(middleware_exports, {
  withMiddlewareAuth: () => withMiddlewareAuth
});
module.exports = __toCommonJS(middleware_exports);

// src/middleware/withMiddlewareAuth.ts
var import_server = require("next/server");
var import_auth_helpers_shared = require("@supabase/auth-helpers-shared");
var NoPermissionError = class extends Error {
  constructor(message) {
    super(message);
  }
  get name() {
    return this.constructor.name;
  }
};
var withMiddlewareAuth = (options = {}) => async (req) => {
  var _a, _b;
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables are required!");
    }
    if (!req.cookies) {
      throw new Error("Not able to parse cookies!");
    }
    const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared.COOKIE_OPTIONS), options.cookieOptions);
    const tokenRefreshMargin = (_a = options.tokenRefreshMargin) != null ? _a : import_auth_helpers_shared.TOKEN_REFRESH_MARGIN;
    const access_token = req.cookies[`${cookieOptions.name}-access-token`];
    const refresh_token = req.cookies[`${cookieOptions.name}-refresh-token`];
    const res = import_server.NextResponse.next();
    const getUser = async () => {
      var _a2;
      if (!access_token) {
        throw new Error("No cookie found!");
      }
      const jwtUser = (0, import_auth_helpers_shared.jwtDecoder)(access_token);
      if (!(jwtUser == null ? void 0 : jwtUser.exp)) {
        throw new Error("Not able to parse JWT payload!");
      }
      const timeNow = Math.round(Date.now() / 1e3);
      if (jwtUser.exp < timeNow + tokenRefreshMargin) {
        if (!refresh_token) {
          throw new Error("No refresh_token cookie found!");
        }
        const requestHeaders = new Headers();
        requestHeaders.set("accept", "json");
        requestHeaders.set("apiKey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        requestHeaders.set("authorization", `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
        const data = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({ refresh_token })
        }).then((res2) => res2.json()).catch((e) => ({
          error: String(e)
        }));
        (0, import_auth_helpers_shared.setCookies)(new import_auth_helpers_shared.NextRequestMiddlewareAdapter(req), new import_auth_helpers_shared.NextResponseMiddlewareAdapter(res), [
          { key: "access-token", value: data.access_token },
          { key: "refresh-token", value: data.refresh_token }
        ].map((token) => {
          var _a3;
          return {
            name: `${cookieOptions.name}-${token.key}`,
            value: token.value,
            domain: cookieOptions.domain,
            maxAge: (_a3 = cookieOptions.lifetime) != null ? _a3 : 0,
            path: cookieOptions.path,
            sameSite: cookieOptions.sameSite
          };
        }));
        return { user: (_a2 = data == null ? void 0 : data.user) != null ? _a2 : null, error: data == null ? void 0 : data.error };
      }
      return { user: jwtUser, error: null };
    };
    const authResult = await getUser();
    if (authResult.error) {
      throw new Error(`Authorization error, redirecting to login page: ${authResult.error.message}`);
    } else if (!authResult.user) {
      throw new Error("No auth user, redirecting");
    } else if (options.authGuard && !await options.authGuard.isPermitted(authResult.user)) {
      throw new NoPermissionError("User is not permitted, redirecting");
    }
    return res;
  } catch (err) {
    let { redirectTo = "/" } = options;
    if (err instanceof NoPermissionError && !!((_b = options == null ? void 0 : options.authGuard) == null ? void 0 : _b.redirectTo)) {
      redirectTo = options.authGuard.redirectTo;
    }
    if (err instanceof Error) {
      console.log(`Could not authenticate request, redirecting to ${redirectTo}:`, err);
    }
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = redirectTo;
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return import_server.NextResponse.redirect(redirectUrl);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  withMiddlewareAuth
});
//# sourceMappingURL=index.js.map