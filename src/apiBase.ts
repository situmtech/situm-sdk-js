/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import jwt_decode from "jwt-decode";
import qs from "qs";

import SitumError from "./situmError";
import { AuthBasic, SDKConfiguration, SitumErrorType, UUID } from "./types";
import { keysToCamel, keysToSnake } from "./utils/snakeCaseCamelCaseUtils";

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
  private jwt: string;

  constructor(configuration: SDKConfiguration, getAuthorization) {
    this.configuration = configuration;
    this.getAuthorization = getAuthorization;
  }

  get(requestInfo: RequestInfo): Promise<unknown> {
    return this.request("get", requestInfo);
  }

  post(requestInfo: RequestInfo): Promise<unknown> {
    return this.request("post", requestInfo);
  }

  put(requestInfo: RequestInfo): Promise<unknown> {
    return this.request("put", requestInfo);
  }

  patch(requestInfo: RequestInfo): Promise<unknown> {
    return this.request("patch", requestInfo);
  }

  delete(requestInfo: RequestInfo): Promise<unknown> {
    return this.request("delete", requestInfo);
  }

  private async request(
    method: string,
    requestInfo: RequestInfo
  ): Promise<unknown> {
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

  async getJwtOrganizationId(): Promise<UUID> {
    const jwt = await this.getJwt();
    return this.parseJwt(jwt).organizationId;
  }

  private transformRequestInfoToAxiosRequestConfig(
    jwt: string,
    method: string,
    requestInfo: RequestInfo
  ): AxiosRequestConfig {
    const request = {
      method: method as Method,
      url: requestInfo.url,
      baseURL: this.configuration.domain,
      headers: this.addDefaultHeaders(jwt, requestInfo.headers),
      params: qs.stringify(keysToSnake(requestInfo.params)),
      paramsSerializer: (params) => params,
      data: keysToSnake(requestInfo.body),
      ...(!jwt ? { withCredentials: true } : {}),
    };

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

  private addDefaultHeaders(jwt, headers: Record<string, string>) {
    let headersToReturn = { ...headers };
    if (jwt) {
      headersToReturn = {
        ...headersToReturn,
        Authorization: "Bearer " + jwt,
      };
    }

    if (!("User-Agent" in headersToReturn)) {
      headersToReturn = {
        ...headersToReturn,
        "User-Agent": "SitumJSSDK/" + this.configuration.version,
      };
    }
    if (!("User-Agent" in headersToReturn)) {
      headersToReturn = {
        ...headersToReturn,
        "User-Agent": "SitumJSSDK/" + this.configuration.version,
      };
    }
    headersToReturn = {
      ...headersToReturn,
      "Content-Type": "application/json",
    };

    return headersToReturn;
  }

  private async getJwt() {
    if (!this.configuration.auth) {
      return null;
    }

    if (!this.jwt || this.expiredJwt(this.jwt)) {
      this.jwt = await this.getAuthorization();
    }

    return this.jwt;
  }

  private expiredJwt(token: string): boolean {
    const parsedJwt = this.parseJwt(token);
    return (parsedJwt.expiration - 500) * 1000 < Date.now();
  }

  private parseJwt(token: string): Jwt {
    const jwt = jwt_decode(token) as Record<string, unknown>;
    return {
      expiration: jwt.exp as number,
      organizationId: jwt.organization_uuid as UUID,
    };
  }

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

  // private atob(buffer) {
  //   return Buffer.from(buffer, "base64").toString("binary");
  // }
}
