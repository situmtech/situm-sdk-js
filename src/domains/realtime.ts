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
    let url = "";
    const authSession = await this.apiBase.getAuthSession();
    if (searchRealtime && "buildingId" in searchRealtime) {
      url = "/api/v1/realtime/building/" + searchRealtime.buildingId;
    } else {
      const organizationId =
        searchRealtime && "organizationId" in searchRealtime
          ? searchRealtime.organizationId
          : authSession.organizationId;

      url = "/api/v1/realtime/organization/" + organizationId;
    }

    return this.apiBase
      .get<RealtimePositions>({ url, params: searchRealtime })
      .then(realtimePositionsMapper);
  }
}
