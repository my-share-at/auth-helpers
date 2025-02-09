var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SupabaseClient: () => import_supabase_js3.SupabaseClient,
  getProviderToken: () => getProviderToken,
  getUser: () => getUser,
  handleAuth: () => handleAuth,
  logger: () => log_default,
  supabaseClient: () => supabaseClient,
  supabaseServerClient: () => supabaseServerClient,
  withApiAuth: () => withApiAuth,
  withPageAuth: () => withPageAuth
});
module.exports = __toCommonJS(src_exports);

// src/handlers/auth.ts
var import_auth_helpers_shared5 = require("@supabase/auth-helpers-shared");

// src/handlers/callback.ts
var import_auth_helpers_shared2 = require("@supabase/auth-helpers-shared");

// src/utils/getUser.ts
var import_supabase_js = require("@supabase/supabase-js");
var import_auth_helpers_shared = require("@supabase/auth-helpers-shared");

// src/utils/log.ts
var dev = process.env.NODE_ENV !== "production";
var logger = {
  log: (message, ...optionalParams) => {
    dev ? console.log(message, ...optionalParams) : null;
  },
  error: (message, ...optionalParams) => {
    console.error(message, ...optionalParams);
  },
  info: (message, ...optionalParams) => {
    logger.log(message, ...optionalParams);
  },
  debug: (message, ...optionalParams) => {
    logger.log(message, ...optionalParams);
  },
  warn: (message, ...optionalParams) => {
    dev ? logger.error(message, ...optionalParams) : null;
  }
};
var log_default = logger;

// src/constants.ts
var PKG_NAME = "@supabase/auth-helpers-nextjs";
var PKG_VERSION = "0.2.7";

// src/utils/getUser.ts
async function getUser(context, options = { forceRefresh: false }) {
  var _a;
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables are required!");
    }
    if (!context.req.cookies) {
      throw new import_auth_helpers_shared.CookieNotFound();
    }
    const supabase = (0, import_supabase_js.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      headers: {
        "X-Client-Info": `${PKG_NAME}@${PKG_VERSION}`
      }
    });
    const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared.COOKIE_OPTIONS), options.cookieOptions);
    const tokenRefreshMargin = (_a = options.tokenRefreshMargin) != null ? _a : import_auth_helpers_shared.TOKEN_REFRESH_MARGIN;
    const access_token = context.req.cookies[`${cookieOptions.name}-access-token`];
    const refresh_token = context.req.cookies[`${cookieOptions.name}-refresh-token`];
    if (!access_token) {
      throw new import_auth_helpers_shared.AccessTokenNotFound();
    }
    const jwtUser = (0, import_auth_helpers_shared.jwtDecoder)(access_token);
    if (!(jwtUser == null ? void 0 : jwtUser.exp)) {
      throw new import_auth_helpers_shared.JWTPayloadFailed();
    }
    const timeNow = Math.round(Date.now() / 1e3);
    if (options.forceRefresh || jwtUser.exp < timeNow + tokenRefreshMargin) {
      if (!refresh_token)
        throw new import_auth_helpers_shared.RefreshTokenNotFound();
      log_default.info("Refreshing access token...");
      const { data, error } = await supabase.auth.api.refreshAccessToken(refresh_token);
      if (error) {
        throw error;
      } else {
        log_default.info("Saving tokens to cookies...");
        (0, import_auth_helpers_shared.setCookies)(new import_auth_helpers_shared.NextRequestAdapter(context.req), new import_auth_helpers_shared.NextResponseAdapter(context.res), [
          { key: "access-token", value: data.access_token },
          { key: "refresh-token", value: data.refresh_token }
        ].map((token) => {
          var _a2;
          return {
            name: `${cookieOptions.name}-${token.key}`,
            value: token.value,
            domain: cookieOptions.domain,
            maxAge: (_a2 = cookieOptions.lifetime) != null ? _a2 : 0,
            path: cookieOptions.path,
            sameSite: cookieOptions.sameSite
          };
        }));
        return { user: data.user, accessToken: data.access_token };
      }
    } else {
      log_default.info("Getting the user object from the database...");
      const { user, error: getUserError } = await supabase.auth.api.getUser(access_token);
      if (getUserError) {
        throw getUserError;
      }
      return { user, accessToken: access_token };
    }
  } catch (e) {
    let response = { user: null, accessToken: null };
    if (e instanceof import_auth_helpers_shared.JWTPayloadFailed) {
      log_default.info("JWTPayloadFailed error has happened!");
      response.error = e.toObj();
    } else if (e instanceof import_auth_helpers_shared.AuthHelperError) {
    } else {
      const error = e;
      log_default.error(error.message);
    }
    return response;
  }
}

// src/handlers/callback.ts
async function handleCallback(req, res, options = {}) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
  const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared2.COOKIE_OPTIONS), options.cookieOptions);
  const { event, session } = req.body;
  if (!event)
    throw new Error("Auth event missing!");
  if (event === "USER_UPDATED") {
    await getUser({ req, res }, { forceRefresh: true });
  }
  if (event === "SIGNED_IN") {
    if (!session)
      throw new Error("Auth session missing!");
    (0, import_auth_helpers_shared2.setCookies)(new import_auth_helpers_shared2.NextRequestAdapter(req), new import_auth_helpers_shared2.NextResponseAdapter(res), [
      session.access_token ? { key: "access-token", value: session.access_token } : null,
      session.refresh_token ? { key: "refresh-token", value: session.refresh_token } : null,
      session.provider_token ? { key: "provider-token", value: session.provider_token } : null
    ].reduce((acc, token) => {
      var _a;
      if (token) {
        acc.push({
          name: `${cookieOptions.name}-${token.key}`,
          value: token.value,
          domain: cookieOptions.domain,
          maxAge: (_a = cookieOptions.lifetime) != null ? _a : 0,
          path: cookieOptions.path,
          sameSite: cookieOptions.sameSite
        });
      }
      return acc;
    }, []));
  }
  if (event === "SIGNED_OUT" || event === "USER_DELETED") {
    (0, import_auth_helpers_shared2.setCookies)(new import_auth_helpers_shared2.NextRequestAdapter(req), new import_auth_helpers_shared2.NextResponseAdapter(res), ["access-token", "refresh-token", "provider-token"].map((key) => ({
      name: `${cookieOptions.name}-${key}`,
      value: "",
      maxAge: -1
    })));
  }
  res.status(200).json({});
}

// src/handlers/user.ts
var import_auth_helpers_shared3 = require("@supabase/auth-helpers-shared");
async function handleUser(req, res, options = {}) {
  var _a;
  try {
    if (!req.cookies) {
      throw new import_auth_helpers_shared3.CookieNotFound();
    }
    const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared3.COOKIE_OPTIONS), options.cookieOptions);
    const tokenRefreshMargin = (_a = options.tokenRefreshMargin) != null ? _a : import_auth_helpers_shared3.TOKEN_REFRESH_MARGIN;
    const access_token = req.cookies[`${cookieOptions.name}-access-token`];
    if (!access_token) {
      throw new import_auth_helpers_shared3.AccessTokenNotFound();
    }
    const jwtUser = (0, import_auth_helpers_shared3.jwtDecoder)(access_token);
    if (!(jwtUser == null ? void 0 : jwtUser.exp)) {
      throw new import_auth_helpers_shared3.JWTPayloadFailed();
    }
    const timeNow = Math.round(Date.now() / 1e3);
    if (jwtUser.exp < timeNow + tokenRefreshMargin) {
      const response = await getUser({ req, res }, { cookieOptions, tokenRefreshMargin });
      res.status(200).json(response);
    } else {
      const user = {
        id: jwtUser.sub,
        aud: null,
        role: null,
        email: null,
        email_confirmed_at: null,
        phone: null,
        confirmed_at: null,
        last_sign_in_at: null,
        app_metadata: {},
        user_metadata: {},
        identities: [],
        created_at: null,
        updated_at: null,
        "supabase-auth-helpers-note": "This user payload is retrieved from the cached JWT and might be stale. If you need up to date user data, please call the `getUser` method in a server-side context!"
      };
      const mergedUser = __spreadValues(__spreadValues({}, user), jwtUser);
      res.status(200).json({ user: mergedUser, accessToken: access_token });
    }
  } catch (e) {
    let response = { user: null, accessToken: null };
    if (e instanceof import_auth_helpers_shared3.JWTPayloadFailed) {
      log_default.info("JWTPayloadFailed error has happened!");
      response.error = e.toObj();
    } else if (e instanceof import_auth_helpers_shared3.AuthHelperError) {
    } else {
      const error = e;
      log_default.error(error.message);
    }
    res.status(200).json(response);
  }
}

// src/handlers/logout.ts
var import_auth_helpers_shared4 = require("@supabase/auth-helpers-shared");

// src/utils/initSupabase.ts
var import_supabase_js2 = require("@supabase/supabase-js");
var import_supabase_js3 = require("@supabase/supabase-js");
var getClientWithEnvCheck = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables are required!");
  }
  return (0, import_supabase_js2.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    autoRefreshToken: false,
    persistSession: false,
    headers: {
      "X-Client-Info": `${PKG_NAME.replace("@", "").replace("/", "-")}/${PKG_VERSION}`
    }
  });
};
var supabaseClient = getClientWithEnvCheck();

// src/handlers/logout.ts
function handleLogout(req, res, options = {}) {
  var _a;
  let { returnTo } = req.query;
  if (!returnTo)
    returnTo = (_a = options == null ? void 0 : options.returnTo) != null ? _a : "/";
  returnTo = Array.isArray(returnTo) ? returnTo[0] : returnTo;
  returnTo = returnTo.charAt(0) === "/" ? returnTo : `/${returnTo}`;
  const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared4.COOKIE_OPTIONS), options.cookieOptions);
  const access_token = req.cookies[`${cookieOptions.name}-access-token`];
  if (access_token)
    supabaseClient.auth.api.signOut(access_token);
  (0, import_auth_helpers_shared4.setCookies)(new import_auth_helpers_shared4.NextRequestAdapter(req), new import_auth_helpers_shared4.NextResponseAdapter(res), ["access-token", "refresh-token", "provider-token"].map((key) => ({
    name: `${cookieOptions.name}-${key}`,
    value: "",
    maxAge: -1
  })));
  res.redirect(returnTo);
}

// src/handlers/auth.ts
function handleAuth(options = {}) {
  return async (req, res) => {
    var _a;
    const { logout } = options;
    const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared5.COOKIE_OPTIONS), options.cookieOptions);
    const tokenRefreshMargin = (_a = options.tokenRefreshMargin) != null ? _a : import_auth_helpers_shared5.TOKEN_REFRESH_MARGIN;
    let {
      query: { supabase: route }
    } = req;
    route = Array.isArray(route) ? route[0] : route;
    switch (route) {
      case "callback":
        return handleCallback(req, res, { cookieOptions });
      case "user":
        return await handleUser(req, res, {
          cookieOptions,
          tokenRefreshMargin
        });
      case "logout":
        return handleLogout(req, res, __spreadValues({
          cookieOptions
        }, logout));
      default:
        res.status(404).end();
    }
  };
}

// src/utils/getProviderToken.ts
var import_auth_helpers_shared6 = require("@supabase/auth-helpers-shared");
function getProviderToken(context, options = {}) {
  const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared6.COOKIE_OPTIONS), options.cookieOptions);
  const providerToken = context.req.cookies[`${cookieOptions.name}-provider-token`];
  if (!providerToken) {
    throw new import_auth_helpers_shared6.ProviderTokenNotFound();
  }
  return providerToken;
}

// src/utils/withPageAuth.ts
var import_auth_helpers_shared7 = require("@supabase/auth-helpers-shared");
function withPageAuth({
  authRequired = true,
  redirectTo = "/",
  getServerSideProps = void 0,
  cookieOptions = {},
  tokenRefreshMargin = import_auth_helpers_shared7.TOKEN_REFRESH_MARGIN
} = {}) {
  return async (context) => {
    try {
      if (!context.req.cookies) {
        throw new import_auth_helpers_shared7.CookieNotParsed();
      }
      cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared7.COOKIE_OPTIONS), cookieOptions);
      const access_token = context.req.cookies[`${cookieOptions.name}-access-token`];
      if (!access_token) {
        throw new import_auth_helpers_shared7.AccessTokenNotFound();
      }
      let user, accessToken;
      const jwtUser = (0, import_auth_helpers_shared7.jwtDecoder)(access_token);
      if (!(jwtUser == null ? void 0 : jwtUser.exp)) {
        throw new import_auth_helpers_shared7.JWTPayloadFailed();
      }
      const timeNow = Math.round(Date.now() / 1e3);
      if (jwtUser.exp < timeNow + tokenRefreshMargin) {
        const response = await getUser(context, { cookieOptions });
        user = response.user;
        accessToken = response.accessToken;
      } else {
        user = {
          id: jwtUser.sub,
          aud: null,
          role: null,
          email: null,
          email_confirmed_at: null,
          phone: null,
          confirmed_at: null,
          last_sign_in_at: null,
          app_metadata: {},
          user_metadata: {},
          identities: [],
          created_at: null,
          updated_at: null,
          "supabase-auth-helpers-note": "This user payload is retrieved from the cached JWT and might be stale. If you need up to date user data, please call the `getUser` method in a server-side context!"
        };
        const mergedUser = __spreadValues(__spreadValues({}, user), jwtUser);
        user = mergedUser;
        accessToken = access_token;
      }
      if (!user) {
        throw new Error("No user found!");
      }
      let ret = { props: {} };
      if (getServerSideProps) {
        try {
          ret = await getServerSideProps(context);
        } catch (error) {
          ret = {
            props: {
              error: String(error)
            }
          };
        }
      }
      return __spreadProps(__spreadValues({}, ret), {
        props: __spreadProps(__spreadValues({}, ret.props), { user, accessToken })
      });
    } catch (e) {
      if (authRequired) {
        return {
          redirect: {
            destination: redirectTo,
            permanent: false
          }
        };
      }
      let props = { user: null, accessToken: null, error: "" };
      if (e instanceof import_auth_helpers_shared7.AuthHelperError) {
        log_default.debug(e.toObj());
      } else {
        log_default.debug(String(e));
        props.error = String(e);
      }
      return {
        props
      };
    }
  };
}

// src/utils/withApiAuth.ts
var import_auth_helpers_shared9 = require("@supabase/auth-helpers-shared");

// src/utils/getAccessToken.ts
var import_auth_helpers_shared8 = require("@supabase/auth-helpers-shared");
async function getAccessToken(context, options = {}) {
  var _a;
  if (!context.req.cookies) {
    throw new import_auth_helpers_shared8.CookieNotParsed();
  }
  const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared8.COOKIE_OPTIONS), options.cookieOptions);
  const tokenRefreshMargin = (_a = options.tokenRefreshMargin) != null ? _a : import_auth_helpers_shared8.TOKEN_REFRESH_MARGIN;
  const access_token = context.req.cookies[`${cookieOptions.name}-access-token`];
  if (!access_token) {
    throw new import_auth_helpers_shared8.AccessTokenNotFound();
  }
  const jwtUser = (0, import_auth_helpers_shared8.jwtDecoder)(access_token);
  if (!(jwtUser == null ? void 0 : jwtUser.exp)) {
    throw new import_auth_helpers_shared8.JWTPayloadFailed();
  }
  const timeNow = Math.round(Date.now() / 1e3);
  if (jwtUser.exp < timeNow + tokenRefreshMargin) {
    const { accessToken } = await getUser(context, {
      cookieOptions,
      tokenRefreshMargin
    });
    return accessToken;
  } else {
    return access_token;
  }
}

// src/utils/withApiAuth.ts
function withApiAuth(handler, options = {}) {
  return async (req, res) => {
    var _a;
    try {
      const cookieOptions = __spreadValues(__spreadValues({}, import_auth_helpers_shared9.COOKIE_OPTIONS), options.cookieOptions);
      const tokenRefreshMargin = (_a = options.tokenRefreshMargin) != null ? _a : import_auth_helpers_shared9.TOKEN_REFRESH_MARGIN;
      const accessToken = await getAccessToken({ req, res }, { cookieOptions, tokenRefreshMargin });
      if (!accessToken)
        throw new Error("No access token!");
      try {
        await handler(req, res);
      } catch (error) {
        res.status(500).json({
          error: String(error)
        });
        return;
      }
    } catch (error) {
      res.status(401).json({
        error: "not_authenticated",
        description: "The user does not have an active session or is not authenticated"
      });
      return;
    }
  };
}

// src/utils/supabaseServerClient.ts
function supabaseServerClient(context, cookieOptions = {
  name: "sb"
}) {
  if (!context.req.cookies) {
    return supabaseClient;
  }
  const access_token = context.req.cookies[`${cookieOptions.name}-access-token`];
  supabaseClient.auth.setAuth(access_token);
  return supabaseClient;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SupabaseClient,
  getProviderToken,
  getUser,
  handleAuth,
  logger,
  supabaseClient,
  supabaseServerClient,
  withApiAuth,
  withPageAuth
});
//# sourceMappingURL=index.js.map