/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import ApiBase from "./apiBase";
import AuthApi from "./domains/authApi";
import CartographyApi from "./domains/cartographyApi";
import RealtimeApi from "./domains/realtimeApi";
import UserApi from "./domains/userApi";
import { SDKConfiguration } from "./types";

type ApiDomains = {
  readonly userApi?: UserApi;
  readonly cartographyApi?: CartographyApi;
};

export default class SitumSDK {
  private readonly configuration: SDKConfiguration;
  private readonly apiBase: ApiBase;
  private readonly domains: ApiDomains;

  // Domains
  private auth: AuthApi;
  readonly user: UserApi;
  readonly cartography: CartographyApi;
  readonly realtime: RealtimeApi;

  static readonly version = "0.0.5";

  constructor({ auth, domain }: SDKConfiguration) {
    this.domains = {} as ApiDomains;
    this.configuration = {
      domain: domain || "https://dashboard.situm.es",
      version: SitumSDK.version,
      auth,
    };
    this.apiBase = new ApiBase(
      this.configuration,
      (): Promise<string> => this.getAuthApi().getAuthorization()
    );

    return new Proxy(this, {
      get: (target: SitumSDK, prop: string) => {
        if (!(prop in target.domains)) {
          if (prop === "user") {
            target.domains[prop] = new UserApi(this.apiBase);
          } else if (prop === "cartography") {
            target.domains[prop] = new CartographyApi(this.apiBase);
          } else if (prop === "realtime") {
            target.domains[prop] = new RealtimeApi(this.apiBase);
          }
        }
        return target.domains[prop];
      },
    });
  }

  private getAuthApi() {
    if (!this.auth) {
      this.auth = new AuthApi(this.configuration.auth, this.apiBase);
    }
    return this.auth;
  }
}
