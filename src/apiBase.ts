/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  Method,
} from "axios";
import { stringify } from "qs";

import { AuthBasic, SDKConfiguration, SitumErrorType, UUID } from "./types";
import { parseJWT } from "./utils/jwt";
import SitumError from "./utils/situmError";
import { keysToCamel, keysToSnake } from "./utils/snakeCaseCamelCaseUtils";

const FALLBACK_LANGUAGE = "en";

type Jwt = {
  expiration: number;
  organizationId: UUID;
};

export type RequestInfo = {
  readonly url: string;
  readonly body?: unknown;
  readonly params?: Record<string, unknown>;
  readonly headers?: Record<string, string>;
  readonly authorization?: AuthBasic;
  readonly notAuthenticated?: boolean;
};

export default class ApiBase {
  private readonly configuration: SDKConfiguration;
  private readonly getAuthorization;
  private jwt: string | null;

  constructor(
    configuration: SDKConfiguration,
    getAuthorization: () => Promise<string>
  ) {
    this.configuration = configuration;
    this.getAuthorization = getAuthorization;
    this.jwt = null;
  }

  /**
   * Performs an HTTP GET request given a parameters hash
   *
   * @param requestInfo Parameters to use while performing the request
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
   * @param requestInfo Parameters to use while performing the request
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
   * @param requestInfo Parameters to use while performing the request
   * @returns Promise
   */
  delete(requestInfo: RequestInfo): Promise<void> {
    return this.request<void>("delete", requestInfo);
  }

  /**
   * Gets the current domain
   *
   * @returns String
   */
  getDomain(): string {
    return this.configuration.domain;
  }

  /**
   * Wrapper around axios that converts our domain HTTP request parameters
   * to the axios request requirements.
   *
   * @param method the HTTP verb to use
   * @param requestInfo Parameters to use while performing the request
   * @returns Promise
   */
  private async request<T>(
    method: string,
    requestInfo: RequestInfo
  ): Promise<T> {
    let jwt = null;

    try {
      jwt = requestInfo.notAuthenticated ? null : await this.getJwt();
      const config = this.transformRequestInfoToAxiosRequestConfig(
        jwt,
        method,
        requestInfo
      );
      const response = await axios.request(config);

      return keysToCamel(response.data);
    } catch (error) {
      throw this.parseRequestException(error);
    }
  }

  /**
   * Generates a complete axios request configuration from a set of parameters
   *
   * @param jwt The JWT to use in the request headers
   * @param method The HTTP verb to use in the request
   * @param requestInfo Additional information to send in the axios request
   * @returns AxiosRequestConfig
   */
  private transformRequestInfoToAxiosRequestConfig(
    jwt: string | null,
    method: string,
    requestInfo: RequestInfo
  ): AxiosRequestConfig {
    const request = {
      method: method as Method,
      url: requestInfo.url,
      baseURL: this.configuration.domain,
      headers: this.addDefaultHeaders(jwt, requestInfo.headers),
      params: stringify(keysToSnake(requestInfo.params)),
      data: keysToSnake(requestInfo.body),
    } as AxiosRequestConfig;

    if (requestInfo.authorization) {
      request["auth"] = {
        ...requestInfo.authorization,
      };
    }

    if (!this.configuration.timeouts) {
      return request;
    } else if (requestInfo.url in this.configuration.timeouts) {
      request["timeout"] = this.configuration.timeouts[requestInfo.url];
    } else if ("default" in this.configuration.timeouts) {
      request["timeout"] = this.configuration.timeouts["default"];
    }

    return request;
  }

  /**
   * Retrieves the organization id from the JWT
   */
  async getJwtOrganizationId(): Promise<UUID> {
    const jwt = await this.getJwt();

    return this.parseJwt(jwt).organizationId;
  }

  /**
   * Calculates the axios request headers from
   */
  private addDefaultHeaders(
    jwt: string | null,
    headers: Record<string, string> | undefined
  ): AxiosRequestHeaders | undefined {
    const lang = this.configuration.lang
      ? this.configuration.lang
      : FALLBACK_LANGUAGE;

    let headersToReturn = {
      ...headers,
      "Content-Type": "application/json",
      "Accept-Language": lang,
      // "X-API-CLIENT": "SitumJSSDK/" + this.configuration.version,
    } as Record<string, string>;

    if (jwt) {
      headersToReturn = {
        ...headersToReturn,
        Authorization: "Bearer " + jwt,
      };
    }

    return headersToReturn;
  }

  /**
   * Calculates and retrieves a JWT, renews if needed it
   * @returns the JWT string
   */
  private async getJwt() {
    if (!this.configuration.auth) {
      return null;
    }

    if (!this.jwt || this.expiredJwt(this.jwt)) {
      this.jwt = await this.getAuthorization();
    }

    return this.jwt;
  }

  /**
   * Checks if the given JWT parameter is expired or not
   * @param token The JWT to validate
   * @returns boolean
   */
  private expiredJwt(token: string): boolean {
    const parsedJwt = this.parseJwt(token);

    return (parsedJwt.expiration - 500) * 1000 < Date.now();
  }

  /**
   * Decodes the given JWT string and returns it as an object
   * @param token The JWT token string to parse
   * @returns The JWT object
   */
  private parseJwt(token: string | null): Jwt {
    const jwt = parseJWT(token) as Record<string, unknown>;

    return {
      expiration: jwt.exp as number,
      organizationId: jwt.organization_uuid as UUID,
    };
  }

  /**
   * Converts An AxiosError to SitumError
   *
   * @param error The AxiosError to parse
   */
  private parseRequestException(error: AxiosError<SitumErrorType>): SitumError {
    if (error instanceof SitumError) {
      return error;
    }

    if (error.response) {
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
}
