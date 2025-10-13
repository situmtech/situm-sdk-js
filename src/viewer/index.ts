/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type RealtimeApi from "../domains/realtime";
import type ReportsApi from "../domains/reports";
import type { UUID, ViewerEventPayloads, ViewerEventType } from "../types";
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

  private async sendDataToViewer(type: string, payload) {
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

    // Build the iframe URL
    let url = this.profile
      ? `${VIEWER_URL}/${this.profile}`
      : this.apiKey
        ? `${VIEWER_URL}?apikey=${this.apiKey}`
        : VIEWER_URL;
    if (opts.buildingId)
      url += `${url.includes("?") ? "&" : "?"}buildingid=${opts.deviceID}`;
    if (opts.deviceID)
      url += `${url.includes("?") ? "&" : "?"}deviceID=${opts.deviceID}`;
    if (opts.fixedPoiID)
      url += `${url.includes("?") ? "&" : "?"}fp=${opts.fixedPoiID}`;

    // Set properties on the iframe
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

  async selectPoiById(id: number) {
    this.sendDataToViewer("cartography.select_poi", { identifier: id });
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
            const baseData: RTDataCustomizer = {
              deviceId: feature.id,
            };

            // custom render
            if (typeof customizeFeatures === "function") {
              const customized = customizeFeatures(baseData);
              if (!customized) return null;
              return {
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
                  icon_url: customized.iconUrl,
                  title: customized.tooltip,
                },
                type: "Feature",
              };
            }

            // default render
            return {
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
              },
              type: "Feature",
            };
          })
          .filter(Boolean);
        this.sendDataToViewer("map.update_external_features", formattedData);
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
    this.sendDataToViewer("map.update_external_features", []);
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

      this.sendDataToViewer("map.show_trajectory", {
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
      this.sendDataToViewer("map.show_trajectory", {
        data: [],
        speed: 1,
        status: "STOP",
      });
    } catch (err) {
      console.error("Error fetching/parsing trajectories", err);
    }
  }
}
