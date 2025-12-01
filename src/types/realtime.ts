import type { Feature, FeatureCollection, Point } from "geojson";

import type { Building, Floor } from "./cartography";
import type { UUID } from "./models";

type GeoJSONFeatureProperty = {
  time: Date;
  yaw: number;
  localCoordinates: [number, number];
  floorId: Floor["id"];
  buildingId: Building["id"];
  levelHeight: number;
  accuracy: number;
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

type RealtimePositionFeature = Feature<Point, GeoJSONFeatureProperty>;

type RealtimePositions = FeatureCollection<
  RealtimePositionFeature["geometry"],
  RealtimePositionFeature["properties"]
> & {
  devicesInfo: Device[];
};
export type { RealtimePositions, RealtimePositionFeature, Device };
