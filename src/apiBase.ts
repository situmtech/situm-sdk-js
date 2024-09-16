/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  Method,
  RawAxiosRequestHeaders,
} from "axios";

import {
  AuthApiKey,
  AuthBasic,
  AuthConfiguration,
  AuthJWT,
  SDKConfiguration,
  SitumErrorType,
} from "./types";
import AuthSession from "./utils/authSession";
import SitumError from "./utils/situmError";
import { keysToCamel, keysToSnake } from "./utils/snakeCaseCamelCaseUtils";

const FALLBACK_LANGUAGE = "en";
const DEFAULT_TIMEOUT = 0; // no timeout

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
    ...headers,
    "Content-Type": "application/json",
    "Accept-Language": lang,
    // "x-api-client": "SitumJSSDK/" + configuration.version,
  };

  if (jwt) {
    headersToReturn = {
      ...headersToReturn,
      Authorization: "Bearer " + jwt,
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
    method: method as Method,
    url: requestInfo.url,
    baseURL: configuration.domain,
    headers: calculateHTTPRequestHeaders(
      configuration,
      jwt,
      requestInfo.headers,
    ),
    params: keysToSnake(requestInfo.params),
    data: keysToSnake(requestInfo.body),
  } as AxiosRequestConfig;

  if (requestInfo.authorization) {
    request["auth"] = {
      ...requestInfo.authorization,
    };
  }

  if (!configuration.timeouts) {
    return request;
  } else if (requestInfo.url in configuration.timeouts) {
    request["timeout"] = configuration.timeouts[requestInfo.url];
  } else if ("default" in configuration.timeouts) {
    request["timeout"] = configuration.timeouts["default"];
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

export type RequestInfo = {
  readonly url: string;
  readonly body?: unknown;
  readonly params?: Record<string, unknown>;
  readonly headers?: RawAxiosRequestHeaders | AxiosHeaders;
  readonly authorization?: AuthBasic;
  readonly notAuthenticated?: boolean;
};

export default class ApiBase {
  private readonly configuration: SDKConfiguration = {
    timeouts: {
      default: DEFAULT_TIMEOUT,
    },
    compact: false,
  };
  private _authSession: AuthSession | null;

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
    let jwt = null;

    try {
      jwt = requestInfo.notAuthenticated ? null : await this.getJwt();
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
          status: error.response.data.status,
          code: error.response.data.code,
          message:
            "Invalid credentials, please check your authentication params.",
          errors: error.response.data.errors,
        });
      }

      return new SitumError({
        status: error.response.data.status,
        code: error.response.data.code,
        message: error.response.data.message,
        errors: error.response.data.errors,
      });
    }

    return new SitumError({
      status: 500,
      code: "generic error",
      message: error.message,
    });
  }

  /**
   * Proxy to get the JWT
   * @returns {Promise<string>} - the JWT calculated
   */
  getAuthorization() {
    return this.getJwt();
  }

  getAuthSession() {
    if (!this._authSession) {
      this.getJwt();
    }
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
    // If we had previously fetched the jwt and it's not expired, return it
    if (this._authSession?.jwt) {
      if (this._authSession.isExpired() && this._authSession.refreshToken) {
        const newTokens = await this.renewJwt();

        this._authSession = new AuthSession(
          newTokens.accessToken,
          newTokens.refreshToken,
        );
      }

      return this._authSession.jwt;
    }

    // If no auth configuration provided, throw an error
    if (!this.configuration.auth) {
      throw new Error("No auth configuration provided");
    }

    // If authentication is using JWT auth, assume it and return it
    if (this.isAuthJwt(this.configuration.auth)) {
      this._authSession = new AuthSession(
        (<AuthJWT>this.configuration.auth).jwt,
        null,
      );

      // TODO: maybe we need to fetch a refreshToken for future expirations.

      return (<AuthJWT>this.configuration.auth).jwt;
    }

    // If authentication is using BASIC or apikey auth, fetch the JWT and return it
    const authData = this.getAuthorizationHeaders(this.configuration.auth);
    try {
      const response = (await this.post({
        url: "/api/v1/auth/access_tokens",
        notAuthenticated: true,
        ...authData,
      })) as AccessTokens;

      this._authSession = new AuthSession(
        response.accessToken,
        response.refreshToken,
      );

      return this._authSession.jwt;
    } catch (error) {
      throw await error;
    }
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
        url: "/api/v1/auth/refresh_access_tokens",
        notAuthenticated: true,
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
          Authorization: "Bearer " + authJwt.jwt,
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
