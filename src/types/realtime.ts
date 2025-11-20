import type { Building, Floor } from "./cartography";
import type { UUID } from "./models";

type GeoJSONFeatureGeometry = {
  type: string;
  coordinates: [number, number];
};

type GeoJSONFeatureProperty = {
  time: Date;
  yaw: number;
  localCoordinates: [number, number];
  floorId: Floor["id"];
  buildingId: Building["id"];
  levelHeight: number;
  accuracy: number;
};

type GeoJSONFeature = {
  type: string;
  geometry: GeoJSONFeatureGeometry;
  properties: GeoJSONFeatureProperty;
  id: string;
};

type Device = {
  id: string;
  organizationId: UUID;
  groupIds: UUID[];
  buildingIds: string[]; // TODO review: should be Building["id"][] but it's set as `string` and Building["id"] is `number`
  createdAt: Date;
  updatedAt: Date;
  code: string;
};

type RealtimePositions = {
  type: string;
  features: GeoJSONFeature[];
  devicesInfo: Device[];
};

export type { RealtimePositions, Device };
