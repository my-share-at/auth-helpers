// src/adapters/NextAdapter.ts
var NextRequestAdapter = class {
  constructor(request) {
    this.req = request;
  }
  setRequestCookie(name, value) {
    this.req.cookies[name] = value;
  }
  getHeader(name) {
    return this.req.headers[name];
  }
};
var NextResponseAdapter = class {
  constructor(response) {
    this.res = response;
  }
  getHeader(name) {
    return this.res.getHeader(name);
  }
  setHeader(name, value) {
    this.res.setHeader(name, value);
    return this;
  }
};

// src/adapters/NextMiddlewareAdapter.ts
var NextRequestAdapter2 = class {
  constructor(request) {
    this.req = request;
  }
  setRequestCookie(name, value) {
    this.req.cookies[name] = value;
  }
  getHeader(name) {
    return this.req.headers.get(name);
  }
};
var NextResponseAdapter2 = class {
  constructor(response) {
    this.res = response;
  }
  getHeader(name) {
    return this.res.headers.get(name);
  }
  setHeader(name, value) {
    this.res.headers.set(name, value);
    return this;
  }
};

// src/adapters/SvelteKitAdapter.ts
var SvelteKitRequestAdapter = class {
  constructor(request) {
    this.req = request;
  }
  setRequestCookie(name, value) {
  }
  getHeader(name) {
    return this.req.headers.get(name);
  }
};
var SvelteKitResponseAdapter = class {
  constructor(response) {
    this.res = response;
  }
  getHeader(name) {
    return this.res.headers.get(name);
  }
  setHeader(name, value) {
    if (Array.isArray(value)) {
      value.forEach((val) => {
        this.res.headers.append(name, val);
      });
    } else {
      this.res.headers.set(name, value);
    }
    return this.res;
  }
};

// src/utils/constants.ts
var COOKIE_OPTIONS = {
  name: "sb",
  lifetime: 7 * 24 * 60 * 60,
  domain: "",
  path: "/",
  sameSite: "lax"
};
var TOKEN_REFRESH_MARGIN = 10;
var RETRY_INTERVAL = 2;
var MAX_RETRIES = 10;
var ENDPOINT_PREFIX = "/api/auth";

// src/utils/jwt.ts
import { decodeJwt } from "jose";
var jwtDecoder = (jwt) => decodeJwt(jwt);

// src/utils/cookies.ts
var parseCookie = (str) => {
  if (!str)
    return {};
  const decode = decodeURIComponent;
  return str.split(";").map((v) => v.split("=")).reduce((acc, v) => {
    const [key, val] = v;
    acc[decode(key.trim())] = decode(val.trim());
    return acc;
  }, {});
};
function serialize(name, val, options) {
  const opt = options || {};
  const enc = encodeURIComponent;
  const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + value;
  if (opt.maxAge != null) {
    const maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function isSecureEnvironment(req) {
  if (!req || !req.getHeader("host")) {
    throw new Error('The "host" request header is not available');
  }
  const headerHost = req.getHeader("host");
  const host = headerHost.indexOf(":") > -1 && headerHost.split(":")[0] || headerHost;
  if (["localhost", "127.0.0.1"].indexOf(host) > -1 || host.endsWith(".local")) {
    return false;
  }
  return true;
}
function serializeCookie(cookie, secure) {
  var _a, _b, _c;
  return serialize(cookie.name, cookie.value, {
    maxAge: cookie.maxAge,
    expires: new Date(Date.now() + cookie.maxAge * 1e3),
    httpOnly: true,
    secure,
    path: (_a = cookie.path) != null ? _a : "/",
    domain: (_b = cookie.domain) != null ? _b : "",
    sameSite: (_c = cookie.sameSite) != null ? _c : "lax"
  });
}
function getCookieString(req, res, cookies) {
  const strCookies = cookies.map((c) => serializeCookie(c, isSecureEnvironment(req)));
  const previousCookies = res.getHeader("Set-Cookie");
  if (previousCookies) {
    if (previousCookies instanceof Array) {
      Array.prototype.push.apply(strCookies, previousCookies);
    } else if (typeof previousCookies === "string") {
      strCookies.push(previousCookies);
    }
  }
  return strCookies;
}
function setCookies(req, res, cookies) {
  for (let cookie of cookies) {
    req.setRequestCookie(cookie.name, cookie.value);
  }
  res.setHeader("Set-Cookie", getCookieString(req, res, cookies));
}
function setCookie(req, res, cookie) {
  setCookies(req, res, [cookie]);
}
function deleteCookie(req, res, name) {
  setCookie(req, res, {
    name,
    value: "",
    maxAge: -1
  });
}

// src/utils/errors.ts
var AuthHelperError = class extends Error {
  constructor(message, errorType) {
    super(message);
    this.errorType = errorType;
    this.source = "sb_auth_helpers";
  }
  toObj() {
    return {
      type: this.errorType,
      message: this.message,
      source: this.source
    };
  }
  toString() {
    return JSON.stringify(this.toObj());
  }
};
var CookieNotFound = class extends AuthHelperError {
  constructor() {
    super("No cookie was found!", "cookie_not_found");
  }
};
var CookieNotSaved = class extends AuthHelperError {
  constructor() {
    super("Cookies cannot be saved!", "cookie_not_saved");
  }
};
var AccessTokenNotFound = class extends AuthHelperError {
  constructor() {
    super("No access token was found!", "cookie_not_found");
  }
};
var RefreshTokenNotFound = class extends AuthHelperError {
  constructor() {
    super("No refresh token was found!", "cookie_not_found");
  }
};
var ProviderTokenNotFound = class extends AuthHelperError {
  constructor() {
    super("No provider token was found!", "cookie_not_found");
  }
};
var CookieNotParsed = class extends AuthHelperError {
  constructor() {
    super("Not able to parse cookies!", "cookie_not_parsed");
  }
};
var CallbackUrlFailed = class extends AuthHelperError {
  constructor(callbackUrl) {
    super(`The request to ${callbackUrl} failed!`, "callback_url_failed");
  }
};
var JWTPayloadFailed = class extends AuthHelperError {
  constructor() {
    super("Not able to parse JWT payload!", "jwt_payload_failed");
  }
};
export {
  AccessTokenNotFound,
  AuthHelperError,
  COOKIE_OPTIONS,
  CallbackUrlFailed,
  CookieNotFound,
  CookieNotParsed,
  CookieNotSaved,
  ENDPOINT_PREFIX,
  JWTPayloadFailed,
  MAX_RETRIES,
  NextRequestAdapter,
  NextRequestAdapter2 as NextRequestMiddlewareAdapter,
  NextResponseAdapter,
  NextResponseAdapter2 as NextResponseMiddlewareAdapter,
  ProviderTokenNotFound,
  RETRY_INTERVAL,
  RefreshTokenNotFound,
  SvelteKitRequestAdapter,
  SvelteKitResponseAdapter,
  TOKEN_REFRESH_MARGIN,
  deleteCookie,
  jwtDecoder,
  parseCookie,
  setCookie,
  setCookies
};
//# sourceMappingURL=index.mjs.map