interface ExternalLocation {
  buildingIdentifier: number;
  floorIdentifier: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  bearing?: {
    radians: number;
    radiansMinusPiPi: number;
    degrees: number;
    degreesClockwise: number;
  };
  accuracy?: number;
}

export type { ExternalLocation };
