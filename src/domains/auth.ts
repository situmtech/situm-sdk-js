/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import ApiBase from "../apiBase";
import { Auth, AuthApiKey, AuthBasic } from "../types";

export type AccessTokens = {
  readonly accessToken: string;
  // readonly refreshToken: string;
};

type AuthParams =
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
    };

export default class AuthApi {
  private readonly auth: Auth;
  private readonly apiBase: ApiBase;

  constructor(auth: Auth, apiBase: ApiBase) {
    this.auth = auth;
    this.apiBase = apiBase;
  }

  /**
   * Proxy to get the JWT
   * @returns Promise<string> Returns the JWT calculated
   */
  getAuthorization() {
    return this.getJwt();
  }

  /**
   * Returns true if the auth configuration object is a BASIC digest
   *
   * @param auth The auth configuration to check from
   * @returns boolean
   */
  private isAuthBasic(auth: Auth) {
    return (<AuthBasic>auth).username !== undefined;
  }

  /**
   * Returns a Promise wrapping the JWT string object provided from
   * the authorization params already passed from the constructor
   *
   * @returns Promise<string>
   */
  private async getJwt(): Promise<string> {
    const authData = this.setAuthorizationParams(this.auth);
    try {
      const response = (await this.apiBase.post({
        url: "/api/v1/auth/access_tokens",
        notAuthenticated: true,
        ...authData,
      })) as AccessTokens;

      return response.accessToken;
    } catch (error) {
      throw await error;
    }
  }

  /**
   * Builds and returns the authentication params given a configuration
   *
   * @param auth Object containing the authentication params
   * @returns AuthParams
   */
  private setAuthorizationParams(auth: Auth): AuthParams {
    if (this.isAuthBasic(auth)) {
      const authBasic = auth as AuthBasic;
      return {
        authorization: {
          ...authBasic,
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
