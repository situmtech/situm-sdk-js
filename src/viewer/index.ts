/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type RealtimeApi from "../domains/realtime";
import type ReportsApi from "../domains/reports";
import {
  type DirectionOptions,
  type UUID,
  type ViewerActionParms,
  ViewerActionType,
  type ViewerEventPayloads,
  type ViewerEventType,
} from "../types";
import type { RTDataCustomizer, ViewerOptions } from "./types";

const VIEWER_URL = "https://maps.situm.com";

type ViewerEventCallback<T extends ViewerEventType> = (
  payload: ViewerEventPayloads[T],
) => void;

export class Viewer {
  private iframe?: HTMLIFrameElement;
  private readonly rtApi: RealtimeApi;
  private readonly reportsApi: ReportsApi;
  private apiKey?: string;
  private profile?: string;
  private realtimeInterval?: ReturnType<typeof setInterval>;
  private listeners: {
    [K in ViewerEventType]?: ViewerEventCallback<K>[];
  } = {};

  constructor(rtApi: RealtimeApi, reportsApi: ReportsApi, opts: ViewerOptions) {
    this.rtApi = rtApi;
    this.reportsApi = reportsApi;
    this.apiKey = opts.apiKey;
    this.profile = opts.profile;

    this._initIframe(opts);
    this._attachGlobalListener();
  }

  private async sendDataToViewer<T extends keyof ViewerActionParms>(
    type: T,
    payload: ViewerActionParms[T],
  ) {
    if (!this.iframe?.contentWindow)
      throw new Error("Viewer iframe not initialized");
    this.iframe.contentWindow.postMessage(
      {
        payload: payload,
        type: type,
      },
      "*",
    );
  }

  /**
   * Initializes the iframe element with the correct URL and appends it to the
   * given DOM element.
   * @param {ViewerOptions} opts - The viewer options object containing the
   * profile, API key and building ID.
   */
  private _initIframe(opts: ViewerOptions) {
    const iframe = document.createElement("iframe");
    let url = this.profile
      ? `${VIEWER_URL}/${this.profile}`
      : this.apiKey
        ? `${VIEWER_URL}?apikey=${this.apiKey}`
        : VIEWER_URL;
    if (opts.buildingId)
      url += url.includes("?")
        ? `&buildingid=${opts.buildingId}`
        : `?buildingid=${opts.buildingId}`;
    iframe.src = url;

    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    opts.domElement.appendChild(iframe);
    this.iframe = iframe;
  }

  /**
   * Attaches a global event listener to the window object.
   * Listens for messages from the iframe content window and calls the respective
   * callbacks if the message type matches one of the registered event types.
   */
  private _attachGlobalListener() {
    window.addEventListener("message", (e: MessageEvent) => {
      if (e.source !== this.iframe?.contentWindow) return;

      let data = e.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      const type = data?.type;
      if (!type) return;

      const callbacks = this.listeners[type];
      if (callbacks) {
        callbacks.forEach((cb) => {
          cb(data.payload);
        });
      }
    });
  }

  /**
   * Attaches a callback to a viewer event.
   * The callback will be called when the viewer sends a message with the type
   * matching the event parameter.
   *
   * @param event The type of the event to listen to.
   * @param callback The callback to call when the event is triggered.
   *
   * @example
   * viewer.on(ViewerEventType.MAP_IS_READY, () => {
   *   console.log("Viewer map is ready");
   * });
   */
  public on<T extends ViewerEventType>(
    event: T,
    callback: ViewerEventCallback<T>,
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(callback);
  }

  /**
   * Selects a poi by its identifier.
   *
   * @param id The identifier of the poi to select.
   */
  async selectPoiById(id: number) {
    this.sendDataToViewer(ViewerActionType.SELECT_POI, { identifier: id });
  }

  /**
   * Deselects the currently selected poi.
   *
   * This function sends a message to the viewer to deselect the currently
   * selected poi. It does not take any parameters.
   */
  async deselectPoi() {
    this.sendDataToViewer(ViewerActionType.DESELECT_POI, {});
  }

  /**
   * Selects a car by its identifier.
   *
   * @param id The identifier of the car to select.
   *
   * This function sends a message to the viewer to select the car with the given
   * identifier. It does not return any value.
   */
  async selectCar(id: string) {
    this.sendDataToViewer(ViewerActionType.SELECT_CAR, { identifier: id });
  }

  /**
   * Selects a building by its identifier.
   *
   * This function sends a message to the viewer to select the building with the given
   * identifier. It does not return any value.
   *
   * @param id The identifier of the building to select.
   */
  async selectBuilding(id: number) {
    this.sendDataToViewer(ViewerActionType.BUILDING_SELECT, { identifier: id });
  }

  /**
   * Selects a floor by its identifier and building identifier.
   *
   * This function sends a message to the viewer to select the floor with the given
   * identifier and building identifier. It does not return any value.
   *
   * @param id The identifier of the floor to select.
   * @param buildingId The identifier of the building that the floor belongs to.
   */
  async selectFloor(id: number, buildingId: number) {
    this.sendDataToViewer(ViewerActionType.FLOOR_SELECT, {
      buildingIdentifier: buildingId,
      identifier: id,
    });
  }

  /**
   * Selects multiple POI categories by their identifiers.
   *
   * This function sends a message to the viewer to select the POI categories with the given
   * identifiers. It does not return any value.
   *
   * @param categoryIds The identifiers of the POI categories to select.
   */
  async selectPoiCategory(categoryIds: number[]) {
    this.sendDataToViewer(ViewerActionType.SELECT_POI_CATEGORY, {
      identifiers: categoryIds,
    });
  }
  /**
   * Sets the options for the directions feature of the viewer.
   *
   * This function sends a message to the viewer to set the options for the directions
   * feature. It does not return any value.
   *
   * @param options The options to set. The options object should contain the following
   * properties:
   *   - from: The starting position of the directions. The from object should contain
   *     the following properties:
   *       - isIndoor: A boolean indicating whether the starting position is indoors.
   *       - isOutdoor: A boolean indicating whether the starting position is outdoors.
   *       - coordinate: The geographical coordinates of the starting position. The coordinate
   *         object should contain the following properties:
   *           - latitude: The latitude of the starting position.
   *           - longitude: The longitude of the starting position.
   *       - cartesianCoordinate: The cartesian coordinates of the starting position. The cartesianCoordinate
   *         object should contain the following properties:
   *           - x: The x coordinate of the starting position.
   *           - y: The y coordinate of the starting position.
   *       - floorIdentifier: The identifier of the floor that the starting position is on.
   *       - buildingIdentifier: The identifier of the building that the starting position is in.
   *   - to: The ending position of the directions. The to object should contain the following
   *     properties:
   *       - isIndoor: A boolean indicating whether the ending position is indoors.
   *       - isOutdoor: A boolean indicating whether the ending position is outdoors.
   *       - coordinate: The geographical coordinates of the ending position. The coordinate
   *         object should contain the following properties:
   *           - latitude: The latitude of the ending position.
   *           - longitude: The longitude of the ending position.
   *       - cartesianCoordinate: The cartesian coordinates of the ending position. The cartesianCoordinate
   *         object should contain the following properties:
   *           - x: The x coordinate of the ending position.
   *           - y: The y coordinate of the ending position.
   *       - floorIdentifier: The identifier of the floor that the ending position is on.
   *       - buildingIdentifier: The identifier of the building that the ending position is in.
   */
  async directionsSetOptions(options: DirectionOptions) {
    this.sendDataToViewer(ViewerActionType.DIRECTIONS_SET_OPTIONS, {
      directionOptions: options,
    });
  }

  /**
   * Sets the user's location on the map.
   *
   * This function sends a message to the viewer to update the user's location on the map.
   * The location is specified by the options object which should contain the following properties:
   *   - x: The x coordinate of the user's location.
   *   - y: The y coordinate of the user's location.
   *   - latitude: The latitude of the user's location.
   *   - longitude: The longitude of the user's location.
   *   - floorIdentifier: The identifier of the floor that the user's location is on.
   *   - buildingIdentifier: The identifier of the building that the user's location is in.
   *   - accuracy: The accuracy of the user's location in meters. Optional.
   *   - bearing: The bearing of the user's location. Optional.
   *   - hasBearing: A boolean indicating whether the user's location has a bearing or not. Optional.
   *     but required to see the arrow.
   */
  async setUserLocation(options: {
    x: number;
    y: number;
    latitude: number;
    longitude: number;
    floorIdentifier: number;
    buildingIdentifier: number;
    accuracy: number; // optional
    bearing: { radians: number }; // optional
    hasBearing: boolean; // optional but required to see the arrow
  }) {
    this.sendDataToViewer(ViewerActionType.LOCATION_UPDATE, options);
  }

  /**
   * Loads and displays the real-time positions of devices in the Situm dashboard.
   * The positions are updated every `refreshRateMs` milliseconds.
   *
   * @param {Object} opts - The options for loading the real-time positions.
   * @param {Object} opts.filter - The filter for the real-time positions. Currently only
   *   supports filtering by building ID.
   * @param {number} opts.refreshRateMs - The refresh rate for the real-time positions in
   *   milliseconds. Defaults to 10000.
   * @param {(position: RTDataCustomizer) => RTDataCustomizer | undefined} opts.customizeFeatures -
   *   A function that customizes the appearance of the real-time positions on the map.
   *   The function is called with the base data of the position as an argument, and should
   *   return the customized data or undefined if the position should not be rendered.
   */
  async loadRealtimePositions({
    filter,
    refreshRateMs = 10000,
    customizeFeatures,
  }: {
    filter: { buildingIds?: number[] };
    refreshRateMs?: number;
    customizeFeatures?: (
      position: RTDataCustomizer,
    ) => RTDataCustomizer | undefined;
  }) {
    if (this.realtimeInterval) clearInterval(this.realtimeInterval);

    const fetchAndSend = async () => {
      try {
        const realtimePositions = await this.rtApi.getPositions({
          buildingIds: filter?.buildingIds,
        });

        const formattedData = realtimePositions.features
          .map((feature) => {
            const customizedFeature = {
              geometry: {
                coordinates: [
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0],
                ],
                type: "Point",
              },
              id: feature.id,
              properties: {
                accuracy: feature.properties.accuracy,
                building_id: feature.properties.buildingId,
                floor_id: feature.properties.floorId,
                icon_url: undefined, // TODO
                title: undefined, // TODO
              },
              type: "Feature",
            };

            // custom render
            if (typeof customizeFeatures === "function") {
              const baseData: RTDataCustomizer = {
                deviceId: feature.id,
              };
              const customized = customizeFeatures(baseData);
              if (!customized) return null;

              if (customized.iconUrl) {
                customizedFeature.properties.icon_url = customized.iconUrl;
              }
              if (customized.tooltip) {
                customizedFeature.properties.title = customized.tooltip;
              }
            }

            return customizedFeature;
          })
          .filter(Boolean);
        this.sendDataToViewer(
          ViewerActionType.MAP_EXTERNAL_FEATURES,
          formattedData,
        );
      } catch (err) {
        console.error("Error fetching/parsing realtime positions", err);
      }
    };

    await fetchAndSend();
    this.realtimeInterval = setInterval(fetchAndSend, refreshRateMs);
  }

  /**
   * Stop fetching and sending realtime positions to the viewer, and clear the previous positions in the viewer.
   */
  async cleanRealtimePositions() {
    if (this.realtimeInterval) clearInterval(this.realtimeInterval);
    this.sendDataToViewer(ViewerActionType.MAP_EXTERNAL_FEATURES, []);
  }

  /**
   * Loads and displays the trajectory of a user in the Situm dashboard.
   * The trajectory is displayed on the map as a line, with the user's position
   * updated every second.
   *
   * @param {Object} opts - The options for loading the trajectory.
   * @param {Date} opts.fromDate - The start date of the trajectory.
   * @param {Date} opts.toDate - The end date of the trajectory.
   * @param {number} opts.buildingId - The ID of the building the user is in.
   * @param {UUID} [opts.userId] - The ID of the user. If not provided, the trajectory of all users will be displayed.
   */
  async loadTrajectory({
    fromDate,
    toDate,
    userId,
    buildingId,
  }: {
    fromDate: Date;
    toDate: Date;
    buildingId: number;
    userId?: UUID;
  }) {
    try {
      const response = await this.reportsApi.getTrajectory({
        buildingId,
        fromDate,
        toDate,
        userId,
      });

      this.sendDataToViewer(ViewerActionType.MAP_SHOW_TRAJECTORY, {
        data: response,
        speed: 1,
        status: "PLAY",
      });
    } catch (err) {
      console.error("Error fetching/parsing trajectories", err);
    }
  }

  /**
   * Clears the trajectory from the viewer.
   *
   * This function sends a "map.show_trajectory" event to the viewer with an empty data array and a status of "STOP".
   * This will stop the trajectory animation and clear the trajectory from the map.
   *
   * @throws {Error} - If there is an error sending the event to the viewer.
   */
  async cleanTrajectory() {
    try {
      this.sendDataToViewer(ViewerActionType.MAP_SHOW_TRAJECTORY, {
        data: [],
        speed: 1,
        status: "STOP",
      });
    } catch (err) {
      console.error("Error fetching/parsing trajectories", err);
    }
  }

  /**
   * Sends a "app.set_auth" event to the viewer with the given jwt string.
   *
   * This function can be used to set the authentication token in the viewer.
   *
   * @param {string} jwt - The jwt string to set as the authentication token.
   */
  async setAuth(jwt: string) {
    await this.sendDataToViewer(ViewerActionType.APP_SET_AUTH, { jwt });
  }

  /**
   * Sends a "app.set_config_item" event to the viewer with the given key and value.
   *
   * This function can be used to set configuration items in the viewer, such as the language or the units.
   *
   * @param {string} key - The key of the configuration item to set.
   * @param {string} value - The value of the configuration item to set.
   *
   * @throws {Error} - If there is an error sending the event to the viewer.
   */
  async setConfigItem(key: string, value: string) {
    await this.sendDataToViewer(ViewerActionType.APP_SET_CONFIG_ITEM, {
      key,
      value,
    });
  }

  /**
   * Sets whether the camera should follow the user in the viewer.
   *
   * If set to true, the camera will move to the user's position when the user moves.
   * If set to false, the camera will stay in its current position.
   *
   * @param {boolean} enabled - Whether the camera should follow the user.
   * @throws {Error} - If there is an error sending the event to the viewer.
   */
  async setFollowUser(enabled: boolean) {
    await this.sendDataToViewer(ViewerActionType.CAMERA_FOLLOW_USER, {
      value: enabled,
    });
  }
}
