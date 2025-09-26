/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { realtimePositionsMapper } from "../adapters/RealtimeAdapter";
import ApiBase from "../apiBase";
import { RealtimePositions, UUID } from "../types";

export type ResponseRealtimePosition = {
  features: Record<string, unknown>[];
  devicesInfo: Record<string, unknown>[];
  type: string;
};

type SearchRealtime = {
  buildingIds?: number[];
  userIds?: UUID[];
  deviceIds?: string[];
  indoor?: boolean;
  max_sec_threshold?: number;
};

/**
 * Service that exposes the realtime domain.
 *
 * Represents the RealtimeApi class that provides methods for getting positions.
 **/
export default class RealtimeApi {
  private apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  /**
   * Retrieves real-time positions based on the provided search criteria.
   *
   * @param {SearchRealtime} [searchRealtime] - Optional search criteria for real-time positions.
   * @returns {Promise<RealtimePositions>} A promise that resolves to the retrieved real-time positions.
   */

  async getPositions(
    searchRealtime?: SearchRealtime,
  ): Promise<RealtimePositions> {
    const url = this.buildRealtimetUrl(searchRealtime);
    return this.apiBase
      .get<RealtimePositions>({ url })
      .then(realtimePositionsMapper);
  }

  private buildRealtimetUrl(searchRealTime: SearchRealtime): string {
    const base = "/api/v1/realtime/positions";
    const params = new URLSearchParams();

    if (searchRealTime.buildingIds?.length) {
      params.set("building_ids", searchRealTime.buildingIds.join(","));
    }
    if (searchRealTime.userIds?.length) {
      params.set("user_ids", searchRealTime.userIds.join(","));
    }
    if (searchRealTime.deviceIds?.length) {
      params.set("device_ids", searchRealTime.deviceIds.join(","));
    }

    if (typeof searchRealTime.indoor === "boolean") {
      params.set("indoor", String(searchRealTime.indoor));
    }

    if (typeof searchRealTime.max_sec_threshold === "number") {
      params.set(
        "max_sec_threshold",
        searchRealTime.max_sec_threshold.toString(),
      );
    }
    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  }
}
