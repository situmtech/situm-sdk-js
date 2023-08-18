/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import ApiBase from "./apiBase";
import AuthApi from "./domains/auth";
import CartographyApi from "./domains/cartography";
import RealtimeApi from "./domains/realtime";
import UserApi from "./domains/user";
import { SDKConfiguration } from "./types";

export default class SitumSDK {
  private readonly configuration: SDKConfiguration;
  private readonly apiBase: ApiBase;

  // Domains
  private auth: AuthApi;
  /**
   * Gives access to the user domain with its operations
   */
  readonly user: UserApi;
  /**
   * Gives access to the user domain with its operations
   */
  readonly cartography: CartographyApi;
  /**
   * Gives access to the user domain with its operations
   */
  readonly realtime: RealtimeApi;

  static readonly version = "0.5.0";

  /**
   * Initializes the API configuration and services exported
   *
   * @param config The configuration
   */
  constructor(config: SDKConfiguration) {
    this.configuration = {
      ...config,
      domain: config.domain || "https://dashboard.situm.com",
      version: SitumSDK.version,
      auth: config.auth,
      compact: config.compact,
    };
    this.apiBase = new ApiBase(
      this.configuration,
      (): Promise<string> => this.getAuthApi().getAuthorization()
    );

    this.user = new UserApi(this.apiBase);
    this.cartography = new CartographyApi(this.apiBase);
    this.realtime = new RealtimeApi(this.apiBase);
  }

  /**
   * Returns the AuthAPI initialized
   * @returns Returns the Auth API wrapper
   */
  private getAuthApi() {
    if (!this.auth) {
      this.auth = new AuthApi(this.configuration.auth, this.apiBase);
    }
    return this.auth;
  }
}
