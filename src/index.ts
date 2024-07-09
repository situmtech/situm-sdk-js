/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import ApiBase from "./apiBase";
import CartographyApi from "./domains/cartography";
import RealtimeApi from "./domains/realtime";
import UserApi from "./domains/user";
import { SDKConfiguration } from "./types";

export default class SitumSDK {
  private readonly configuration: SDKConfiguration;
  private readonly apiBase: ApiBase;

  // Domains
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

  static readonly version = "0.8.0";

  /**
   * Initializes a new instance of the SitumSDK class with its exported domains.
   *
   * @param {SDKConfiguration} config - The configuration object for the SDK.
   * @return {void}
   */
  constructor(config: SDKConfiguration) {
    this.configuration = {
      ...config,
      domain: config.domain || "https://dashboard.situm.com",
      version: SitumSDK.version,
      auth: config.auth,
      compact: config.compact,
    };
    // Wrapper for the axios instance, and utility methods for the rest of the domains
    this.apiBase = new ApiBase(this.configuration);

    // Domains initialization
    this.user = new UserApi(this.apiBase);
    this.cartography = new CartographyApi(this.apiBase);
    this.realtime = new RealtimeApi(this.apiBase);
  }
}
