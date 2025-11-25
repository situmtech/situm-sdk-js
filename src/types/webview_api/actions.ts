import type { Jwt } from "../auth";
import type { Calibration } from "../calibration";
import type { Poi, PoiCategory } from "../cartography";
import type { FontSizeItem } from "../config";
import type { Camera } from "../map";
import type { ExternalFeature, Trajectory } from "../models";
import type { Route, RouteType } from "../route";
import type { EnsureAllKeysPresent } from "../utils";

type OnNavigationStartRequestedPayloadToPoint = {
  lat: number;
  lng: number;
  floorIdentifier: string;
  navigationName?: string;
};
interface NavigateToPoi {
  navigationTo: Poi["id"];
  type?: RouteType;
}

// TODO unused? No NavigateToPoint action is used??
// interface NavigateToPoint {
//   lat: number;
//   lng: number;
//   floorIdentifier: string;
//   type?: RouteType;
//   navigationName?: string;
// }

interface NavigateToFilter {
  filter: {
    poiCategoryIdentifier?: PoiCategory["id"];
    // ... other future filters
  };
  type?: RouteType;
}

// TODO these types make no sense, they should be merged into a single type
type OnNavigationStartRequestedPayload = NavigateToPoi | NavigateToFilter;
type NavigationStartPayload =
  | OnNavigationStartRequestedPayload
  | OnNavigationStartRequestedPayloadToPoint
  | Route;

interface CartographySelectionOptions {
  fitCamera?: boolean;
}

type LanguageShortCode = string;

enum ViewerUIMode {
  EXPLORE = "explore",
  DIRECTIONS = "directions",
  STEPS = "steps",
  NAVIGATION = "navigation",
  CALIBRATION = "calibration",
}

export enum ViewerActionType {
  // auth
  APP_SET_AUTH = "app.set_auth",
  SET_CONFIG_ITEM = "app.set_config_item",

  // camera
  FOLLOW_USER = "camera.follow_user",
  CAMERA_SET = "camera.set",

  // cartography
  SELECT_POI = "cartography.select_poi",
  DESELECT_POI = "cartography.deselect_poi",
  SELECT_CAR = "cartography.select_car",
  BUILDING_SELECT = "cartography.select_building",
  FLOOR_SELECT = "cartography.select_floor",
  SELECT_POI_CATEGORY = "cartography.select_poi_category",
  DESELECT_POI_CATEGORIES = "cartography.deselect_poi_categories",

  // find_my_car
  FMC_SELECT = "find_my_car.select",
  FMC_SAVE = "find_my_car.save",

  // map
  MAP_EXTERNAL_FEATURES = "map.update_external_features",
  MAP_TRAJECTORY = "map.show_trajectory",

  // navigation
  NAVIGATION_START = "navigation.start",
  NAVIGATION_TO_CAR = "navigation.start.to_car",
  NAVIGATION_CANCEL = "navigation.cancel",
  NAVIGATION_UPDATE = "navigation.update",

  // directions
  DIRECTIONS_START = "directions.start",
  DIRECTIONS_UPDATE = "directions.update",
  DIRECTIONS_SET_OPTIONS = "directions.set_options",

  // location
  LOCATION_UPDATE = "location.update",
  LOCATION_UPDATE_STATUS = "location.update_status",

  // UI
  INITIAL_CONFIG = "ui.initial_configuration",
  LANGUAGE_CONFIG = "ui.set_language",
  SET_FAV_POIS = "ui.set_favorite_pois",
  SET_SEARCH_FILTER = "ui.set_search_filter",
  SET_UI_MODE = "ui.set_mode",
  SHOW_USER_SETTINGS = "ui.show_user_settings",
  TOGGLE_USER_SETTINGS = "ui.toggle_user_settings",
  FONT_SIZE_UPDATE = "ui.font_size_update",

  // AR
  AR_UPDATE_STATUS = "augmented_reality.update_status",

  // Calibration
  SET_LOCAL_CALIBRATIONS = "calibration.set_local_calibrations",
  STOP_CALIBRATION = "calibration.stop",
}

export type _ViewerActionParams = {
  // auth
  [ViewerActionType.APP_SET_AUTH]: { apikey?: string; jwt?: Jwt };
  [ViewerActionType.SET_CONFIG_ITEM]: [{ key: string; value: unknown }];

  // camera
  [ViewerActionType.FOLLOW_USER]: { value: boolean } | boolean;
  [ViewerActionType.CAMERA_SET]: Camera;

  // cartography
  [ViewerActionType.SELECT_POI]: { identifier: number };
  [ViewerActionType.DESELECT_POI]: undefined;
  [ViewerActionType.SELECT_CAR]: undefined;
  [ViewerActionType.BUILDING_SELECT]: { identifier: number };
  [ViewerActionType.FLOOR_SELECT]: {
    identifier: number;
    options?: CartographySelectionOptions;
  };
  [ViewerActionType.SELECT_POI_CATEGORY]: { identifier: number };
  [ViewerActionType.DESELECT_POI_CATEGORIES]: undefined;

  // find_my_car
  [ViewerActionType.FMC_SELECT]: undefined;
  [ViewerActionType.FMC_SAVE]: {
    coordinate: { latitude: number; longitude: number };
    floorIdentifier: number;
  };

  // map
  [ViewerActionType.MAP_EXTERNAL_FEATURES]: ExternalFeature[];
  [ViewerActionType.MAP_TRAJECTORY]: Trajectory;

  // navigation
  [ViewerActionType.NAVIGATION_START]: NavigationStartPayload;
  [ViewerActionType.NAVIGATION_TO_CAR]: OnNavigationStartRequestedPayload;
  [ViewerActionType.NAVIGATION_CANCEL]: undefined;
  [ViewerActionType.NAVIGATION_UPDATE]: any; // TODO navigation payload is too complex

  // directions
  [ViewerActionType.DIRECTIONS_START]: {
    navigationFrom: number;
    navigationTo: number;
    routeType?: RouteType;
  };
  [ViewerActionType.DIRECTIONS_UPDATE]: any; // TODO directions payload is too complex
  [ViewerActionType.DIRECTIONS_SET_OPTIONS]: {
    includedTags?: string[];
    excludedTags?: string[];
  };

  // location
  [ViewerActionType.LOCATION_UPDATE]: any; // TODO can be a location object with either SDK or Viewer format
  [ViewerActionType.LOCATION_UPDATE_STATUS]: { status: string }; // TODO add proper typing

  // UI
  [ViewerActionType.INITIAL_CONFIG]: {
    enablePoiClustering: boolean;
    showPoiNames: boolean;
    minZoom: number;
    maxZoom: number;
    initialZoom: number;
  };
  [ViewerActionType.LANGUAGE_CONFIG]: LanguageShortCode;
  [ViewerActionType.SET_FAV_POIS]: Poi["id"][];
  [ViewerActionType.SET_SEARCH_FILTER]: {
    text: string;
    poiCategoryIdentifier: PoiCategory["id"];
  };
  [ViewerActionType.SET_UI_MODE]: { mode: ViewerUIMode };
  [ViewerActionType.SHOW_USER_SETTINGS]: boolean;
  [ViewerActionType.TOGGLE_USER_SETTINGS]: undefined;
  [ViewerActionType.FONT_SIZE_UPDATE]: { size: FontSizeItem };

  // AR
  [ViewerActionType.AR_UPDATE_STATUS]: { type: string };

  // Calibration
  [ViewerActionType.SET_LOCAL_CALIBRATIONS]: { calibrations: Calibration[] };
  [ViewerActionType.STOP_CALIBRATION]: {
    status?: "cancelled" | "undo" | "success";
  };
};

export type ViewerActionParams = EnsureAllKeysPresent<
  ViewerActionType,
  _ViewerActionParams
>;
