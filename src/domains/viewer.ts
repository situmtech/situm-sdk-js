/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UUID, ViewerEventPayloads, ViewerEventType } from "../types";
import RealtimeApi from "./realtime";
import ReportsApi from "./reports";

// const VIEWER_URL = "https://maps.situm.com";
const VIEWER_URL = "https://pro-4174.map-viewer.situm.com";
// const VIEWER_URL = "http://localhost:5173";

type ViewerEventCallback<T extends ViewerEventType> = (
  payload: ViewerEventPayloads[T],
) => void;

interface ViewerOptions {
  domElement: HTMLElement;
  profile?: string;
}

export class Viewer {
  private iframe?: HTMLIFrameElement;
  private readonly rtApi: RealtimeApi;
  private readonly reportsApi: ReportsApi;
  private profile?: string;
  private realtimeInterval?: ReturnType<typeof setInterval>;
  private listeners: {
    [K in ViewerEventType]?: ViewerEventCallback<K>[];
  } = {};

  constructor(rtApi: RealtimeApi, reportsApi: ReportsApi, opts: ViewerOptions) {
    this.rtApi = rtApi;
    this.reportsApi = reportsApi;
    this.profile = opts.profile;

    this._initIframe(opts.domElement);
    this._attachGlobalListener();
  }

  private _initIframe(container: HTMLElement) {
    const iframe = document.createElement("iframe");
    iframe.src = this.profile ? `${VIEWER_URL}/${this.profile}` : VIEWER_URL;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    container.appendChild(iframe);
    this.iframe = iframe;
  }

  private _attachGlobalListener() {
    window.addEventListener("message", (e: MessageEvent) => {
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
    if (!this.iframe?.contentWindow)
      throw new Error("Viewer iframe not initialized");
    this.iframe.contentWindow.postMessage(
      {
        type: "cartography.select_poi",
        payload: { identifier: id },
      },
      "*",
    );
  }

  async loadRealtimePositions(
    {
      organizationId,
      buildingIds,
    }: {
      organizationId?: UUID;
      buildingIds?: number[];
    },
    refreshMs: number = 2000,
  ) {
    if (!this.iframe?.contentWindow)
      throw new Error("Viewer iframe not initialized");
    if (this.realtimeInterval) clearInterval(this.realtimeInterval);

    const fetchAndSend = async () => {
      try {
        const realtimePositions = await this.rtApi.getPositions({
          organizationId,
          buildingIds,
        });
        const data = realtimePositions.features.map((feature) => ({
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
        }));
        this.iframe!.contentWindow!.postMessage(
          { type: "map.update_external_features", payload: data },
          "*",
        );
      } catch (err) {
        console.error("Error fetching/parsing realtime positions", err);
      }
    };

    await fetchAndSend();
    this.realtimeInterval = setInterval(fetchAndSend, refreshMs);
  }

  async clearRealtimePositions() {
    if (!this.iframe?.contentWindow)
      throw new Error("Viewer iframe not initialized");
    if (this.realtimeInterval) clearInterval(this.realtimeInterval);

    this.iframe.contentWindow.postMessage(
      { type: "map.update_external_features", payload: [] },
      "*",
    );
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
    if (!this.iframe?.contentWindow)
      throw new Error("Viewer iframe not initialized");
    try {
      const response = await this.reportsApi.getTrajectory({
        fromDate,
        toDate,
        buildingId,
        userId,
      });

      this.iframe.contentWindow.postMessage(
        {
          type: "map.show_trajectory",
          payload: { speed: 1, status: "PLAY", data: response },
        },
        "*",
      );
    } catch (err) {
      console.error("Error fetching/parsing trajectories", err);
    }
  }

  async cleanTrajectory() {
    if (!this.iframe?.contentWindow)
      throw new Error("Viewer iframe not initialized");
    try {
      this.iframe.contentWindow.postMessage(
        {
          type: "map.show_trajectory",
          payload: { speed: 1, status: "STOP", data: [] },
        },
        "*",
      );
    } catch (err) {
      console.error("Error fetching/parsing trajectories", err);
    }
  }
}
