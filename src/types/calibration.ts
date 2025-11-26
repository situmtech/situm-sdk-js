import type { Building, Floor } from "./cartography";
import type { LatLng } from "./coordinates";

type GroundTruth = LatLng & {
  floorIdentifier: Floor["id"];
  buildingIdentifier: Building["id"];
  isIndoor?: boolean;
};

type Calibration = {
  filename: string;
  buildingIdentifier: Building["id"];
  floorIdentifier: Floor["id"];
  size?: number;
  gts: GroundTruth[];
};

export type { GroundTruth, Calibration };
