import type { GroundTruth } from "../calibration";
import type { ExternalLocation } from "../location";
import type { NativeNavigationUpdateTypes } from "../route";
import type { EnsureAllKeysPresent } from "../utils";

export enum PosMessageErrorCodes {
  NoNetworkError = "NO_NETWORK_ERROR",
  GenericError = "ERROR",
}

export interface PostMessageErrorPayload {
  code: PosMessageErrorCodes;
  message: string;
  errors?: any;
}

interface VibratePayload {
  duration: number; // in milliseconds
  intensity: "LOW" | "MEDIUM" | "HIGH";
}

export enum ViewerEventType {
  // app
  MAP_IS_READY = "app.map_is_ready",
  APP_ERROR = "app.error",
  APP_VIBRATE = "app.vibrate",

  // cartography
  POI_SELECTED = "cartography.poi_selected",
  POI_DESELECTED = "cartography.poi_deselected",
  BUILDING_SELECTED = "cartography.building_selected",
  FLOOR_SELECTED = "cartography.floor_selected",
  POI_CATEGORY_SELECTED = "cartography.poi_category_selected",
  POI_CATEGORY_DESELECTED = "cartography.poi_category_deselected",

  // find_my_car
  FMC_SAVED = "find_my_car.saved",

  // directions
  DIRECTIONS_REQUESTED = "directions.requested",

  // location
  LOCATION_START = "location.start",
  LOCATION_STOP = "location.stop",
  LOCATION_EXTERNAL_START = "location.external_start",
  LOCATION_EXTERNAL_ADD = "location.external_add",

  // navigation
  NAVIGATION_REQUESTED = "navigation.requested",
  NAVIGATION_STOPPED = "navigation.stopped",
  VIEWER_NAVIGATION_STARTED = "viewer.navigation.started",
  VIEWER_NAVIGATION_UPDATED = "viewer.navigation.updated",
  VIEWER_NAVIGATION_STOPPED = "viewer.navigation.stopped",

  // AR
  AR_START = "augmented_reality.requested",
  AR_STOP = "augmented_reality.requested_stop",

  // Calibration
  CALIBRATION_POINT_CLICKED = "calibration.point_clicked",
  CALIBRATION_STOPPED = "calibration.stopped",
  LOCAL_CALIBRATIONS_UPLOAD_REQUESTED = "calibration.local_calibrations_upload_requested",

  // UI
  FAV_POIS_UPDATED = "ui.favorite_pois_updated",
  SPEAK_ALOUD_TEXT = "ui.speak_aloud_text",
}

export interface _ViewerEventPayloads {
  // app
  [ViewerEventType.MAP_IS_READY]: undefined;
  [ViewerEventType.APP_ERROR]: PostMessageErrorPayload;
  [ViewerEventType.APP_VIBRATE]: VibratePayload;

  // cartography
  [ViewerEventType.POI_SELECTED]: {
    identifier: number;
    buildingIdentifier: number;
  };
  [ViewerEventType.POI_DESELECTED]: {
    identifier: number;
    buildingIdentifier: number;
  };
  [ViewerEventType.BUILDING_SELECTED]: { identifier: number | null };
  [ViewerEventType.FLOOR_SELECTED]: {
    identifier: number;
    buildingIdentifier: number;
  };
  [ViewerEventType.POI_CATEGORY_SELECTED]: { identifiers: number[] | null };
  [ViewerEventType.POI_CATEGORY_DESELECTED]: { identifiers: number[] | null };

  // find_my_car
  [ViewerEventType.FMC_SAVED]: {
    coordinate: { latitude: number; longitude: number };
    floorIdentifier: number;
  };

  // directions
  [ViewerEventType.DIRECTIONS_REQUESTED]: any; // TODO: this is typed as any in MapViewer :(

  // location
  [ViewerEventType.LOCATION_START]: { buildingIdentifier: number };
  [ViewerEventType.LOCATION_STOP]: undefined;
  [ViewerEventType.LOCATION_EXTERNAL_START]: { buildingIdentifier: string };
  [ViewerEventType.LOCATION_EXTERNAL_ADD]: ExternalLocation;

  // navigation
  [ViewerEventType.NAVIGATION_REQUESTED]: any; // TODO: this is typed as any in MapViewer :(
  [ViewerEventType.NAVIGATION_STOPPED]: undefined;
  [ViewerEventType.VIEWER_NAVIGATION_STARTED]: any; // TODO: type too complex to migrate right now
  [ViewerEventType.VIEWER_NAVIGATION_UPDATED]: NativeNavigationUpdateTypes;
  [ViewerEventType.VIEWER_NAVIGATION_STOPPED]: any; // TODO: type too complex to migrate right now

  // AR
  [ViewerEventType.AR_START]: undefined;
  [ViewerEventType.AR_STOP]: undefined;

  // Calibration
  [ViewerEventType.CALIBRATION_POINT_CLICKED]: GroundTruth;
  [ViewerEventType.CALIBRATION_STOPPED]: {
    status: "cancelled" | "undo" | "success";
  };
  [ViewerEventType.LOCAL_CALIBRATIONS_UPLOAD_REQUESTED]: undefined;

  // UI
  [ViewerEventType.FAV_POIS_UPDATED]: { favoritePois: number[] };
  [ViewerEventType.SPEAK_ALOUD_TEXT]: {
    text: string;
    lang?: string;
    rate?: number;
    volume?: number;
    pitch?: number;
  };
}

export type ViewerEventPayloads = EnsureAllKeysPresent<
  ViewerEventType,
  _ViewerEventPayloads
>;
