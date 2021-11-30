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
};

export default class AuthApi {
  private readonly auth: Auth;
  private readonly apiBase: ApiBase;

  constructor(auth: Auth, apiBase: ApiBase) {
    this.auth = auth;
    this.apiBase = apiBase;
  }

  getAuthorization() {
    return this.getJwt();
  }

  private isAuthBasic(auth: Auth) {
    return (<AuthBasic>auth).username !== undefined;
  }

  private async getJwt() {
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

  private setAuthorizationParams(auth: Auth) {
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
        "X-API-EMAIL": authApiKey.email,
        "X-API-KEY": authApiKey.apiKey,
      },
    };
  }
}
