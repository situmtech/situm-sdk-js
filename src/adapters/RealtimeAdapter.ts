import type { ResponseRealtimePosition } from "../domains/realtime";
import type {
  Device,
  RealtimePositionFeature,
  RealtimePositions,
} from "../types/realtime";

export function realtimePositionsMapper(
  realtimePositions: ResponseRealtimePosition,
): RealtimePositions {
  return {
    devicesInfo: realtimePositions.devicesInfo.map((device) =>
      deviceMapper(device),
    ),
    features: realtimePositions.features.map(featureMapper),
    type: "FeatureCollection",
  } as RealtimePositions;
}

function featureMapper(
  feature: Record<string, unknown>,
): RealtimePositionFeature {
  return feature as unknown as RealtimePositionFeature;
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
