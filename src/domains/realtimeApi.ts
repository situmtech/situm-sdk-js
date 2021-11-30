import ApiBase from "../apiBase";
import { Device, RealtimePositions, SearchRealtime } from "../types";

type ResponseRealtimePosition = {
  features: Record<string, unknown>[];
  devicesInfo: Record<string, unknown>[];
  type: string;
};

function realtimePositionsMapper(
  realtimePositions: ResponseRealtimePosition
): RealtimePositions {
  const realtimePositionsToReturn = {
    type: realtimePositions.type as string,
    features: realtimePositions.features,
    devicesInfo: realtimePositions.devicesInfo.map((device) =>
      deviceMapper(device)
    ),
  };

  return realtimePositionsToReturn as RealtimePositions;
}

function deviceMapper(device: Record<string, unknown>): Device {
  const deviceToReturn = {
    ...device,
  };
  device.time = Date.parse(device.time as string);
  delete deviceToReturn.groups;
  delete deviceToReturn.buildings;
  delete deviceToReturn.organization;
  return deviceToReturn as Device;
}

async function getSearchRealtimePosition(
  apiBase: ApiBase,
  searchRealtime: SearchRealtime
): Promise<string> {
  if (searchRealtime && "buildingId" in searchRealtime) {
    return "/api/v1/realtime/building/" + searchRealtime.buildingId;
  }

  const organizationId =
    searchRealtime && "organizationId" in searchRealtime
      ? searchRealtime.organizationId
      : await apiBase.getJwtOrganizationId();

  return "/api/v1/realtime/organization/" + organizationId;
}

export default class RealtimeApi {
  private apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  async getUsersPositions(
    searchRealtime?: SearchRealtime
  ): Promise<RealtimePositions> {
    const realtimePositions = (await this.apiBase.get({
      url: await getSearchRealtimePosition(this.apiBase, searchRealtime),
    })) as ResponseRealtimePosition;
    return realtimePositionsMapper(realtimePositions);
  }
}
