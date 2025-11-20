import type { ResponseRealtimePosition } from "../domains/realtime";
import type { Device, RealtimePositions } from "../types/realtime";

export function realtimePositionsMapper(
  realtimePositions: ResponseRealtimePosition,
): RealtimePositions {
  const realtimePositionsToReturn = {
    devicesInfo: realtimePositions.devicesInfo.map((device) =>
      deviceMapper(device),
    ),
    features: realtimePositions.features,
    type: realtimePositions.type as string,
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
