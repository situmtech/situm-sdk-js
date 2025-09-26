/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ApiBase from "../apiBase";
import { UUID } from "../types";

type TrajectoryReportPosition = {
  timestamp: string;
  sessionMark: number;
  floorId: number;
  userId: string;
  deviceId: string;
  lat: number;
  lng: number;
};

type SearchTrajectoryReport = {
  fromDate: Date;
  toDate: Date;
  buildingId: number;
  userId?: UUID;
};

/**
 * Service that exposes the Report domain.
 *
 * Represents the ReportApi class that provides methods for getting positions.
 **/
export default class ReportsApi {
  private apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  async getTrajectory(
    searchReport?: SearchTrajectoryReport,
  ): Promise<TrajectoryReportPosition[]> {
    if (
      !searchReport?.fromDate ||
      !searchReport?.toDate ||
      !searchReport?.buildingId
    ) {
      throw new Error("fromDate, toDate, and buildingId are required");
    }
    const url = this.buildReportUrl(searchReport);

    const response = await this.apiBase
      .get({ url })
      .then((res: { data: TrajectoryReportPosition[] }) => res.data);
    return response;
  }

  private buildReportUrl(searchReport: SearchTrajectoryReport): string {
    const base = "/api/v1/reports/user_positions.json";

    const params = new URLSearchParams();

    params.set("from_date", searchReport.fromDate.toISOString());
    params.set("to_date", searchReport.toDate.toISOString());

    if (searchReport.buildingId) {
      params.set("building_id", searchReport.buildingId.toString());
    }
    if (searchReport.userId) {
      params.set("user_id", searchReport.userId);
    }

    return `${base}?${params.toString()}`;
  }
}
