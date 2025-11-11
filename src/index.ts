/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { version } from "../package.json";
import ApiBase from "./apiBase";
import CartographyApi from "./domains/cartography";
import ImagesApi from "./domains/images";
import RealtimeApi from "./domains/realtime";
import ReportsApi from "./domains/reports";
import UserApi from "./domains/user";
import type { SDKConfiguration } from "./types";
import { Viewer } from "./viewer";
import type { ViewerOptions } from "./viewer/types";

export * from "./types";

/**
 * Main class that exports different domains from the Situm REST APIs,
 * to initialize it just pass your authentication parameters.
 *
 * To fetch information just use any of the domains (cartography,
 * realtime, user, ...) and use the methods available in it.
 * @example
 * ```typescript
 *import Situm from '@situm/sdk-js';
 *
 *const situm = new SitumSDK({
 *  auth: {
 *    apikey: 'your-api-key',
 *  },
 * };
 *
 * const buildings: Promise<readonly BuildingListElement[]> = situm.cartography.getBuildings();
 * ```
 * @param {SDKConfiguration} config - The configuration object for the SDK.
 */
export default class SitumSDK {
  private readonly configuration: SDKConfiguration;
  private readonly apiBase: ApiBase;

  // Domains
  private _user: UserApi;
  private _cartography: CartographyApi;
  private _realtime: RealtimeApi;
  private _reports: ReportsApi;
  private _images: ImagesApi;

  static readonly version = version;

  /**
   * Initializes a new instance of the SitumSDK class with its exported domains.
   *
   * @param {SDKConfiguration} config - The configuration object for the SDK.
   * @returns {void}
   */
  constructor(config: SDKConfiguration) {
    this.configuration = {
      ...config,
      auth: config.auth,
      compact: config.compact,
      domain: config.domain || "https://api.situm.com",
      version: SitumSDK.version,
    };
    // Wrapper for the axios instance, and utility methods for the rest of the domains
    this.apiBase = new ApiBase(this.configuration);
  }

  /**
   * Gives access to the user domain with its operations
   */
  public get user() {
    if (!this._user) {
      this._user = new UserApi(this.apiBase);
    }

    return this._user;
  }

  /**
   * Returns the cartography API instance.
   *
   * @returns {CartographyApi} The cartography API instance.
   */
  public get cartography() {
    if (!this._cartography) {
      this._cartography = new CartographyApi(this.apiBase);
    }
    return this._cartography;
  }

  /**
   * Gives access to the realtime domain with its operations.
   *
   * @returns {RealtimeApi} The realtime API instance.
   */
  public get realtime() {
    if (!this._realtime) {
      this._realtime = new RealtimeApi(this.apiBase);
    }
    return this._realtime;
  }

  /**
   * Gives access to the reports domain with its operations.
   *
   * @returns {ReportsApi} The reports API instance.
   */
  public get reports() {
    if (!this._reports) {
      this._reports = new ReportsApi(this.apiBase);
    }
    return this._reports;
  }

  /**
   * Gives access to the images domain with its operations.
   *
   * @returns {ImagesApi} The images API instance.
   */
  public get images() {
    if (!this._images) {
      this._images = new ImagesApi(this.apiBase);
    }
    return this._images;
  }

  /**
   * Returns the authorization object from the API base. This gives access to the
   * user privileges, email, and organization ID.
   *
   * @returns {AuthSession} The authorization object.
   */
  public get authSession() {
    return this.apiBase.getAuthSession();
  }


  /**
   * Proxy to get the JWT
   * @returns {string} - the JWT calculated
   */
  public get jwt() {
    return this.apiBase.jwt();
  }

  /**
   * Viewers' Factory
   */
  public viewer = {
    create: (opts: ViewerOptions) => {
      if (
        !opts.apiKey &&
        this.configuration.auth &&
        "apiKey" in this.configuration.auth
      ) {
        opts.apiKey = this.configuration.auth.apiKey;
      }
      return new Viewer(this.realtime, this.reports, opts);
    },
  };
}
