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

type SearchRealtime = { organizationId?: UUID } | { buildingId: number };

/**
 * Service that exposes the cartography domain.
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
   * @param {UUID} [searchRealtime.organizationId] - The ID of the organization for which to retrieve real-time positions.
   * @param {number} [searchRealtime.buildingId] - The ID of the building for which to retrieve real-time positions.
   * @return {Promise<RealtimePositions>} A promise that resolves to the retrieved real-time positions.
   */
  async getPositions(
    searchRealtime?: SearchRealtime,
  ): Promise<RealtimePositions> {
    let url = "";
    if (searchRealtime && "buildingId" in searchRealtime) {
      url = "/api/v1/realtime/building/" + searchRealtime.buildingId;
    } else {
      const organizationId =
        searchRealtime && "organizationId" in searchRealtime
          ? searchRealtime.organizationId
          : await this.apiBase.getJwtOrganizationId();

      url = "/api/v1/realtime/organization/" + organizationId;
    }

    return this.apiBase
      .get<RealtimePositions>({ url, params: searchRealtime })
      .then(realtimePositionsMapper);
  }
}
