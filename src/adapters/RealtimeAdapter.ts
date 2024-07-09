import { ResponseRealtimePosition } from "../domains/realtime";
import { Device, RealtimePositions } from "../types";

export function realtimePositionsMapper(
  realtimePositions: ResponseRealtimePosition,
): RealtimePositions {
  const realtimePositionsToReturn = {
    type: realtimePositions.type as string,
    features: realtimePositions.features,
    devicesInfo: realtimePositions.devicesInfo.map((device) =>
      deviceMapper(device),
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
