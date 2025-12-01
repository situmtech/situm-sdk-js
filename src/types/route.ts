import type { Cartesians, LatLng } from "./coordinates";

enum RouteType {
  CHOOSE_SHORTEST = "CHOOSE_SHORTEST",
  ONLY_ACCESSIBLE = "ONLY_ACCESSIBLE",
  ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES = "ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES",
}

interface Route {
  identifier: number;
  TO: RouteNode | null;
  from: RouteNode | null;
  indications: RouteIndication[];
  steps: RouteStep[];
  nodes: RouteNode[];
  lastStep: RouteStep | null;
  points: RouteNode[];
  segments: RouteSegment[];
  firstStep: RouteStep | null;
  edges: RouteStep[];
  currentStep: RouteStep | null;
  currentIndication: RouteIndication | null;
  nextIndication: RouteIndication | null;
}

interface RouteNode {
  isOutdoor: boolean;
  coordinate: LatLng;
  isIndoor: boolean;
  cartesianCoordinate: Cartesians;
  floorIdentifier: string;
  buildingIdentifier: string;
}

interface RouteStep {
  isLast: boolean;
  to: RouteNode;
  from: RouteNode;
  isFirst: boolean;
  id: number;
  distanceToGoal: number;
  distance: number;
  orientation: number;
}

interface RouteIndication {
  humanReadableMessage: string;
  stepIdxOrigin: number;
  distance: number;
  orientation: number;
  neededLevelChange: boolean;
  distanceToNextLevel: number;
  orientationType: string;
  stepIdxDestination: number;
  indicationType: string;
  floorIdentifier?: number;
  nextFloorIdentifier?: number;
  metaData: string[];
  metaDataFence: string;
  nameFence: string;
}

interface RouteSegment {
  points: RouteNode[];
  floorIdentifier: string;
}

enum NativeNavigationUpdateTypes {
  STARTED = "STARTED",
  PROGRESS = "PROGRESS",
  DESTINATION_REACHED = "DESTINATION_REACHED",
  OOR = "OUT_OF_ROUTE",
  CANCELLED = "CANCELLED",
}

export { RouteType, NativeNavigationUpdateTypes };
export type { Route, RouteNode, RouteStep, RouteIndication, RouteSegment };
