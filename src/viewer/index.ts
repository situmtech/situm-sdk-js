/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UUID, ViewerEventPayloads, ViewerEventType } from "../types";
import RealtimeApi from "../domains/realtime";
import ReportsApi from "../domains/reports";
import { ViewerOptions, RTDataCustomizer } from "./types";

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

    this._initIframe(opts.domElement);
    this._attachGlobalListener();
  }

  private async sendDataToViewer(type: string, payload) {
    if (!this.iframe?.contentWindow)
      throw new Error("Viewer iframe not initialized");
    this.iframe.contentWindow.postMessage(
      {
        type: type,
        payload: payload,
      },
      "*",
    );
  }

  private _initIframe(container: HTMLElement) {
    const iframe = document.createElement("iframe");
    iframe.src = this.profile
      ? `${VIEWER_URL}/${this.profile}`
      : this.apiKey
        ? `${VIEWER_URL}?apikey=${this.apiKey}`
        : VIEWER_URL;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    container.appendChild(iframe);
    this.iframe = iframe;
  }

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
        callbacks.forEach((cb) => cb(data.payload));
      }
    });
  }

  public on<T extends ViewerEventType>(
    event: T,
    callback: ViewerEventCallback<T>,
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  async selectPoiById(id: number) {
    this.sendDataToViewer("cartography.select_poi", { identifier: id });
  }

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
                type: "Feature",
                id: feature.id,
                geometry: {
                  type: "Point",
                  coordinates: [
                    feature.geometry.coordinates[1],
                    feature.geometry.coordinates[0],
                  ],
                },
                properties: {
                  floor_id: feature.properties.floorId,
                  building_id: feature.properties.buildingId,
                  accuracy: feature.properties.accuracy,
                  title: customized.tooltip,
                  icon_url: customized.iconUrl,
                },
              };
            }

            // default render
            return {
              type: "Feature",
              id: feature.id,
              geometry: {
                type: "Point",
                coordinates: [
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0],
                ],
              },
              properties: {
                floor_id: feature.properties.floorId,
                building_id: feature.properties.buildingId,
                accuracy: feature.properties.accuracy,
              },
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

  async cleanRealtimePositions() {
    if (this.realtimeInterval) clearInterval(this.realtimeInterval);
    this.sendDataToViewer("map.update_external_features", []);
  }

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
        fromDate,
        toDate,
        buildingId,
        userId,
      });

      this.sendDataToViewer("map.show_trajectory", {
        speed: 1,
        status: "PLAY",
        data: response,
      });
    } catch (err) {
      console.error("Error fetching/parsing trajectories", err);
    }
  }

  async cleanTrajectory() {
    try {
      this.sendDataToViewer("map.show_trajectory", {
        speed: 1,
        status: "STOP",
        data: [],
      });
    } catch (err) {
      console.error("Error fetching/parsing trajectories", err);
    }
  }
}
