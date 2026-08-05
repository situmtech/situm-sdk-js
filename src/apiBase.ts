/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import axios, {
  type AxiosError,
  type AxiosHeaders,
  type AxiosRequestConfig,
  type Method,
  type RawAxiosRequestHeaders,
} from "axios";

import type {
  AuthApiKey,
  AuthBasic,
  AuthConfiguration,
  AuthJWT,
} from "./types/auth";
import type { SDKConfiguration } from "./types/models";
import AuthSession from "./utils/authSession";
import SitumError, { type SitumErrorType } from "./utils/situmError";
import { keysToCamel, keysToSnake } from "./utils/snakeCaseCamelCaseUtils";

const FALLBACK_LANGUAGE = "en";
const DEFAULT_TIMEOUT = 0; // no timeout
const MAX_TIMEOUT_DELAY_MS = 2 ** 31 - 1;

/**
 * Calculates the HTTP request headers based on the provided configuration, JWT, and headers.
 *
 * @param {SDKConfiguration} configuration - The SDK configuration object.
 * @param {string | null} jwt - The JWT token.
 * @param {RawAxiosRequestHeaders | AxiosHeaders} headers - The headers object.
 * @returns {RawAxiosRequestHeaders | AxiosHeaders} The calculated HTTP request headers.
 */
const calculateHTTPRequestHeaders = (
  configuration: SDKConfiguration,
  jwt: string | null,
  headers: RawAxiosRequestHeaders | AxiosHeaders,
): RawAxiosRequestHeaders | AxiosHeaders => {
  const lang = configuration.lang ? configuration.lang : FALLBACK_LANGUAGE;

  let headersToReturn = {
    "Accept-Language": lang,
    "Content-Type": "application/json",
    ...headers,
    // "x-api-client": "SitumJSSDK/" + configuration.version,
  };

  if (jwt) {
    headersToReturn = {
      ...headersToReturn,
      Authorization: `Bearer ${jwt}`,
    };
  }

  return headersToReturn;
};

/**
 * Generates a complete axios request configuration from a set of parameters
 *
 * @param jwt The JWT to use in the request headers
 * @param method The HTTP verb to use in the request
 * @param requestInfo Additional information to send in the axios request
 * @returns AxiosRequestConfig
 */
const transformRequestInfoToAxiosRequestConfig = (
  configuration: SDKConfiguration,
  jwt: string | null,
  method: string,
  requestInfo: RequestInfo,
): AxiosRequestConfig => {
  const request = {
    baseURL: configuration.domain,
    data: requestInfo.formData ?? keysToSnake(requestInfo.body),
    headers: calculateHTTPRequestHeaders(
      configuration,
      jwt,
      requestInfo.headers,
    ),
    method: method as Method,
    params: keysToSnake(requestInfo.params),
    url: requestInfo.url,
  } as AxiosRequestConfig;

  if (requestInfo.authorization) {
    request.auth = {
      ...requestInfo.authorization,
    };
  }

  if (!configuration.timeouts) {
    return request;
  } else if (requestInfo.url in configuration.timeouts) {
    request.timeout = configuration.timeouts[requestInfo.url];
  } else if ("default" in configuration.timeouts) {
    request.timeout = configuration.timeouts.default;
  }

  return request;
};

export type AccessTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

export type AuthParams =
  | {
      authorization: {
        username: string;
        password: string;
      };
    }
  | {
      headers: {
        "X-API-KEY": string;
      };
    }
  | {
      headers: {
        Authorization: string;
      };
    };

interface BaseRequestInfo {
  readonly url: string;
  readonly params?: Record<string, unknown>;
  readonly headers?: RawAxiosRequestHeaders | AxiosHeaders;
  readonly authorization?: AuthBasic;
  readonly notAuthenticated?: boolean;
}

interface WithBody extends BaseRequestInfo {
  readonly body: unknown;
  readonly formData?: never;
}

interface WithFormData extends BaseRequestInfo {
  readonly formData: FormData;
  readonly body?: never;
}
interface WithoutFormDataOrBody extends BaseRequestInfo {
  readonly formData?: never;
  readonly body?: never;
}

export type RequestInfo = WithFormData | WithBody | WithoutFormDataOrBody;

export default class ApiBase {
  private readonly configuration: SDKConfiguration = {
    compact: false,
    timeouts: {
      default: DEFAULT_TIMEOUT,
    },
  };
  private _authSession: AuthSession | null;
  private _renewal: Promise<AuthSession> | null = null;
  private _renewalTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(configuration: SDKConfiguration) {
    this.configuration = { ...this.configuration, ...configuration };
  }

  /**
   * Wrapper around axios that converts our domain HTTP request parameters
   * to the axios request requirements.
   *
   * @param {string} method - the HTTP verb to use
   * @param {RequestInfo} requestInfo - Parameters to use while performing the request
   * @returns Promise
   */
  private async request<T>(
    method: string,
    requestInfo: RequestInfo,
  ): Promise<T> {
    try {
      const jwt = requestInfo.notAuthenticated ? null : await this.getJwt();
      const config = transformRequestInfoToAxiosRequestConfig(
        this.configuration,
        jwt,
        method,
        requestInfo,
      ) as AxiosRequestConfig;
      const response = await axios.request(config);

      return keysToCamel(response.data);
    } catch (error) {
      throw this.parseRequestException(error);
    }
  }

  /**
   * Performs an HTTP GET request given a parameters hash
   *
   * @param {RequestInfo} requestInfo - Parameters to use while performing the request
   * @returns Promise
   */
  get<T>(requestInfo: RequestInfo): Promise<T> {
    return this.request<T>("get", requestInfo);
  }

  /**
   * Performs an HTTP POST request given a parameters hash
   *
   * @param requestInfo Parameters to use while performing the request
   * @returns Promise
   */
  post<T>(requestInfo: RequestInfo): Promise<T> {
    return this.request<T>("post", requestInfo);
  }

  /**
   * Performs an HTTP POST request given a parameters hash
   *
   * @param {RequestInfo} requestInfo - Parameters to use while performing the request
   * @returns Promise
   */
  put<T>(requestInfo: RequestInfo): Promise<T> {
    return this.request<T>("put", requestInfo);
  }

  /**
   * Performs an HTTP PATCH request given a parameters hash
   *
   * @param requestInfo Parameters to use while performing the request
   * @returns Promise
   */
  patch<T>(requestInfo: RequestInfo): Promise<T> {
    return this.request<T>("patch", requestInfo);
  }

  /**
   * Performs an HTTP DELETE request given a parameters hash
   *
   * @param {RequestInfo} requestInfo - Parameters to use while performing the request
   * @returns Promise
   */
  delete(requestInfo: RequestInfo): Promise<void> {
    return this.request<void>("delete", requestInfo);
  }

  /**
   * Gets the current domain
   *
   * @returns {SDKConfiguration}
   */
  getDomain(): string {
    return this.configuration.domain;
  }

  /**
   * Returns the configuration of the api
   *
   * @returns {SDKConfiguration}
   */
  getConfiguration() {
    return this.configuration;
  }

  /**
   * Converts An AxiosError to SitumError
   *
   * @param {AxiosError<SitumErrorType>} error - The AxiosError to parse
   * @returns {SitumError}
   */
  private parseRequestException(error: AxiosError<SitumErrorType>): SitumError {
    if (error instanceof SitumError) {
      return error;
    }

    if (error.response) {
      if (error.response.data.code === "invalid_credentials") {
        return new SitumError({
          code: error.response.data.code,
          errors: error.response.data.errors,
          message:
            "Invalid credentials, please check your authentication params.",
          status: error.response.data.status,
        });
      }

      return new SitumError({
        code: error.response.data.code,
        errors: error.response.data.errors,
        message: error.response.data.message,
        status: error.response.data.status,
      });
    }

    return new SitumError({
      code: "generic error",
      message: error.message,
      status: 500,
    });
  }

  /**
   * Returns the JWT held by the current session, without waiting for any
   * authentication round trip.
   *
   * @returns {string} - the JWT currently held, undefined if not authenticated yet
   */
  jwt() {
    return this._authSession?.jwt;
  }

  /**
   * Returns a usable JWT, authenticating or renewing the session as needed.
   */
  getValidJwt(): Promise<string> {
    return this.getJwt();
  }

  async getAuthSession() {
    await this.getJwt();

    return this._authSession;
  }

  /**
   * Returns true if the auth configuration object is a BASIC digest
   *
   * @param auth The auth configuration to check from
   * @returns boolean
   */
  private isAuthBasic(auth: AuthConfiguration) {
    return (<AuthBasic>auth).username !== undefined;
  }

  private isAuthJwt(auth: AuthConfiguration) {
    return (<AuthJWT>auth).jwt !== undefined;
  }

  /**
   * Returns a Promise wrapping the JWT string object provided from
   * the authorization params already passed from the constructor
   *
   * @returns Promise<string>
   */
  private async getJwt(): Promise<string> {
    if (this._authSession?.jwt) {
      const canRenew =
        !!this._authSession.refreshToken || this.canAuthenticate();

      if (!canRenew || !this._authSession.isExpired()) {
        return this._authSession.jwt;
      }

      return (await this.renewSession()).jwt;
    }

    // If no auth configuration provided, throw an error
    if (!this.configuration.auth) {
      throw new Error("No auth configuration provided");
    }

    if (this.isAuthJwt(this.configuration.auth)) {
      const authJwt = <AuthJWT>this.configuration.auth;

      return this.setAuthSession(
        new AuthSession(authJwt.jwt, authJwt.refreshToken ?? null),
      ).jwt;
    }

    // If authentication is using BASIC or apikey auth, fetch the JWT and return it
    return (await this.authenticate()).jwt;
  }

  /**
   * Installs a new session and lets the consumer know about the new tokens.
   *
   * @returns {AuthSession} The very same session, for chaining
   */
  private setAuthSession(authSession: AuthSession): AuthSession {
    this._authSession = authSession;
    this.scheduleRenewal(authSession);

    try {
      this.configuration.onAuthSessionChange?.({
        jwt: authSession.jwt,
        refreshToken: authSession.refreshToken,
      });
    } catch {
      // A throwing consumer callback must never break authentication.
    }

    return authSession;
  }

  /**
   * Programs the renewal of a session ahead of its expiration.
   *
   * This is the proactive half of the strategy: an idle session would
   * otherwise only be renewed by the next request, possibly after it expired.
   * The request driven path in `getJwt` stays as the safety net, since
   * browsers throttle timers on background tabs.
   */
  private scheduleRenewal(authSession: AuthSession): void {
    this.dispose();

    if (!this.configuration.autoRenewSession) {
      return;
    }

    // A session that cannot renew itself would just spin.
    const delay = authSession.renewalDelayMs;
    if (
      delay === null ||
      (!authSession.refreshToken && !this.canAuthenticate())
    ) {
      return;
    }

    // setTimeout truncates to a signed 32 bit delay, and a longer one would
    // fire immediately and reschedule in a loop. Wake up early and reschedule.
    const cappedDelay = Math.min(delay, MAX_TIMEOUT_DELAY_MS);

    this._renewalTimeout = setTimeout(() => {
      this._renewalTimeout = null;

      if (cappedDelay < delay) {
        this.scheduleRenewal(authSession);
        return;
      }

      // Nobody is awaiting this one: a failure here is not fatal, the next
      // request retries through `getJwt`.
      void this.renewSession().catch(() => undefined);
    }, cappedDelay);

    // Do not hold a Node process open just because a session is alive.
    (this._renewalTimeout as { unref?: () => void }).unref?.();
  }

  /**
   * Cancels any pending renewal, so a client that is no longer used does not
   * keep a timer alive.
   *
   * Deliberately not a permanent kill switch: a client that keeps being used
   * schedules its next renewal as usual. Making it terminal would silently
   * disable renewals for good on a spurious call, which is exactly what React
   * StrictMode produces when it runs an effect as mount/cleanup/mount.
   */
  dispose(): void {
    clearTimeout(this._renewalTimeout);
    this._renewalTimeout = null;
  }

  /**
   * Returns true when the configured credentials allow minting a brand new
   * session, which is not the case for a plain JWT configuration.
   */
  private canAuthenticate(): boolean {
    return (
      !!this.configuration.auth && !this.isAuthJwt(this.configuration.auth)
    );
  }

  /**
   * Exchanges the configured credentials for a brand new token pair.
   */
  private async authenticate(): Promise<AuthSession> {
    const authData = this.getAuthorizationHeaders(this.configuration.auth);

    try {
      const response = (await this.post({
        notAuthenticated: true,
        url: "/api/v1/auth/access_tokens",
        ...authData,
      })) as AccessTokens;

      return this.setAuthSession(
        new AuthSession(response.accessToken, response.refreshToken),
      );
    } catch (error) {
      throw await error;
    }
  }

  /**
   * Renews the current session, collapsing concurrent callers into a single
   * request.
   *
   * Every request goes through `getJwt`, so without this an expired token
   * would make each in-flight request fire its own renewal, and single use
   * refresh tokens would invalidate one another.
   */
  private renewSession(): Promise<AuthSession> {
    if (this._renewal) {
      return this._renewal;
    }

    this._renewal = this.performRenewal().finally(() => {
      this._renewal = null;
    });

    return this._renewal;
  }

  /**
   * Renews through the refresh endpoint and, if that is not possible or fails,
   * falls back to a full re-authentication with the configured credentials.
   */
  private async performRenewal(): Promise<AuthSession> {
    if (this._authSession.refreshToken) {
      try {
        const { accessToken, refreshToken } = await this.renewJwt();

        return this.setAuthSession(new AuthSession(accessToken, refreshToken));
      } catch (error) {
        if (!this.canAuthenticate()) {
          throw error;
        }
      }
    }

    // A JWT-only configuration with no refresh token cannot be renewed here:
    // supplying a fresh one is up to the consumer.
    return this.canAuthenticate() ? this.authenticate() : this._authSession;
  }

  /**
   * Renew the JWT using the auth property
   *
   * @returns Promise<string> Returns the new JWT string
   */
  async renewJwt(): Promise<AccessTokens> {
    const authData = this.getAuthorizationHeaders(this.configuration.auth);
    try {
      const response = (await this.post({
        notAuthenticated: true,
        url: "/api/v1/auth/refresh_access_tokens",
        ...authData,
        body: {
          accessToken: this._authSession.jwt,
          refreshToken: this._authSession.refreshToken,
        },
      })) as AccessTokens;

      return response;
    } catch (error) {
      throw await error;
    }
  }

  /**
   * Builds and returns the authentication params given a configuration
   *
   * @param {AuthConfiguration} - auth Object containing the authentication params
   * @returns AuthParams
   */
  private getAuthorizationHeaders(auth: AuthConfiguration): AuthParams {
    if (this.isAuthBasic(auth)) {
      const authBasic = auth as AuthBasic;
      return {
        authorization: {
          ...authBasic,
        },
      };
    }

    if (this.isAuthJwt(auth)) {
      const authJwt = auth as AuthJWT;
      return {
        headers: {
          Authorization: `Bearer ${authJwt.jwt}`,
        },
      };
    }

    const authApiKey = auth as AuthApiKey;
    return {
      headers: {
        "X-API-KEY": authApiKey.apiKey,
      },
    };
  }
}
