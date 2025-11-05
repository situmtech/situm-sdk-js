import type { TrajectoryReportPosition } from "../domains/reports";

/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export type SitumError = {
  status: number;
  code: string;
  message: string;
  errors: SitumErrorDetail[];
};

export type SitumErrorDetail = {
  message: string;
  code: string;
  subCode?: string;
  field?: string;
  value?: string;
};

export type AuthBasic = {
  username: string;
  password: string;
};

export type AuthApiKey = {
  apiKey: string;
};

export type AuthJWT = {
  jwt: string;
};

export type AuthConfiguration = AuthBasic | AuthApiKey | AuthJWT;
export type Jwt = string;
export type UUID = string;
export type ID = number;

export type SDKConfiguration = {
  domain?: string;
  auth?: AuthConfiguration;
  timeouts?: Record<string, number>;
  version?: string;
  lang?: string;
  compact?: boolean;
};

export type SitumSubError = {
  message: string;
  code: string;
  subCode: string;
  fields: string;
  value: string;
};

export type SitumErrorType = {
  status: number;
  code: string;
  message: string;
  errors?: SitumSubError[];
};

export type CustomField = {
  key: string;
  value: string;
};

export type Metadata = {
  first: boolean;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
};

export type Paginated<T> = {
  data: T[];
  metadata: Metadata;
};

export type PaginatedSearch = PaginatedSearchShort & {
  direction?: string;
};

export type PaginatedSearchShort = {
  page?: number;
  size?: number;
  sort?: string;
};

export type Role =
  | "ADMIN_ORG"
  | "ZONE_MANAGER"
  | "COLLECTIVE_MANAGER"
  | "STAFF"
  | "USER";

export type LicenseType = "FREE_TRIAL" | "PARTNER" | "ENTERPRISE" | "INTERNAL";

export type License = {
  id: UUID;
  expirationDate: Date;
  licenseType: LicenseType;
};

export type User = {
  id: UUID;
  email: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  organizationId: UUID;
  termsAcceptedAt: Date;
  verifiedByAdmin: boolean;
  locale: string;
  fullName: string;
  subscribedToNewsletter: boolean;
  iconColour: string;
  info: string;
  role: Role;
  isVerified: boolean;
  groupIds: UUID[];
  license: License;
  buildingIds: ID[];
  importationDate: Date;
};

export type UserForm = {
  email: string;
  password?: string;
  organizationId?: UUID;
  fullName?: string;
  locale?: string;
  code?: string;
  subscribedToNewsletter?: boolean;
  verifiedByAdmin?: boolean;
  groupIds?: UUID[];
  buildingIds?: ID[];
  role?: Role;
  iconColour?: string;
  info?: string;
  acceptTerms?: boolean;
};

export type UserSearch = PaginatedSearch & {
  ids?: string[];
  excludeIds?: string[];
  groupIds?: string[];
  buildingIds?: ID[];
  hasBuildings?: boolean;
  fullName?: string;
  codes?: string[];
};

export type GeofenceType = "POLYGON";

export type Geofence = GeofenceForm & {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
};

export type GeofenceForm = {
  buildingId: string;
  code?: string;
  customFields?: CustomField[];
  floorId: ID;
  geometric: [number, number][];
  info?: string;
  name: string;
  organizationId?: UUID;
  type: GeofenceType;
};

export type GeofenceSearch = PaginatedSearchShort & {
  organizationId?: UUID;
  buildingIds?: ID[];
  name?: string;
  deleted?: boolean;
};

export type CalibrationModel = {
  id: number;
  updatedAt: Date;
  download: string;
};

export type Dimensions = {
  width: number;
  length: number;
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export type Cartesians = {
  x: number;
  y: number;
};

export type PoiUpdateForm = {
  buildingId: ID;
  name?: string;
  info?: string;
  categoryId?: number;
  customFields?: CustomField[];
  icon?: string;
  selectedIcon?: string;
  position: {
    floorId: ID;
    georeferences: Coordinate;
  };
};

export type PoiCreateForm = PoiUpdateForm;

export type Poi = Required<PoiCreateForm> & {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
  infoUnsafe: string;
  type: string;
  floorId: number;
  location: Coordinate & Cartesians;
};

export type PoiSearch = {
  buildingId?: ID;
  type?: "indoor" | "outdoor";
  view?: "compact";
};

export type Node = {
  id: number;
  floorId: number;
  x: number;
  y: number;
};

export type Link = {
  source: number;
  target: number;
  origin: "both" | "source" | "target";
  tags: string[];
  accessible: boolean;
};

export type PathSearch = { buildingId?: ID };

export type Paths = {
  nodes: Node[];
  links: Link[];
};

export type Maps = {
  scale: number;
  map_url: string;
  map_id: string;
};

export type FloorBase = {
  buildingId: ID;
  level: number;
  levelHeight?: number;
  name?: string;
  customFields?: CustomField[];
};

export type FloorForm = FloorBase & {
  mapId: string;
};

export type Floor = FloorBase & {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  maps: Maps;
};

export type FloorSearch = { buildingId?: ID };

export type BuildingBase = {
  customFields?: CustomField[];
  description?: string;
  dimensions: Dimensions;
  info?: string;
  location: Coordinate;
  name: string;
  rotation: number;
};

export type BuildingForm = {
  customFields?: CustomField[];
  description?: string;
  dimensions: Dimensions;
  info?: string;
  location: Coordinate;
  name: string;
  pictureId?: string;
  rotation?: number;
};

export type BuildingListElement = BuildingBase & {
  id: ID;
  info: string;
  calibrationModel: CalibrationModel;
  createdAt: Date;
  pictureThumbUrl: string;
  pictureUrl: string;
  serverUrl: string;
  updatedAt: Date;
  userId: UUID;
};

export type Building = BuildingListElement & {
  corners: Coordinate[];
  floors: Floor[];
  pois: Poi[];
  geofences: Geofence[];
  paths: Paths;
};

export type PoiCategoryBase = {
  nameEn: string;
  nameEs?: string;
  code: string;
};

export type PoiCategoryForm = PoiCategoryBase & {
  icon?: string;
  selectedIcon?: string;
};

export type PoiCategory = PoiCategoryBase & {
  id: ID;
  iconUrl: string;
  selectedIconUrl: string;
  updatedAt: Date;
  createdAt: Date;
  public: boolean;
};

export type GeoJSONFeatureGeometry = {
  type: string;
  coordinates: [number, number];
};

export type GeoJSONFeatureProperty = {
  time: Date;
  yaw: number;
  localCoordinates: [number, number];
  floorId: ID;
  buildingId: ID;
  levelHeight: number;
  accuracy: number;
};

export type GeoJSONFeature = {
  type: string;
  geometry: GeoJSONFeatureGeometry;
  properties: GeoJSONFeatureProperty;
  id: string;
};

export type Device = {
  id: string;
  organizationId: UUID;
  groupIds: UUID[];
  buildingIds: string[];
  createdAt: Date;
  updatedAt: Date;
  code: string;
};

export type RealtimePositions = {
  type: string;
  features: GeoJSONFeature[];
  devicesInfo: Device[];
};

type Colors = {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  default: string;
};

export type Organization = {
  id: UUID;
  name: string;
  logoPath: string;
  logoLoginPath: string;
  logoFaviconPath: string;
  cookiesMessage: string;
  support_email: string;
  copyright: string;
  colors: Colors;
};

export enum SitumApiPermissionLevel {
  positioning = "positioning",
  "read-only" = "read-only",
  "cartography-read-write" = "cartography-read-write",
  "read-write" = "read-write",
}

export interface SitumJWTPayload {
  sub?: string | undefined;
  email: string;
  organization_uuid: UUID;
  role: "ADMIN_ORG" | "ADMIN" | "USER";
  api_permission: SitumApiPermissionLevel;
  iss?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}

export type Apikey = {
  id: UUID;
  apikey: string;
  permission: "read-only" | "positioning";
  description: string;
};

export enum ViewerEventType {
  // App
  MAP_IS_READY = "app.map_is_ready",
  APP_ERROR = "app.error",

  // Cartography
  POI_SELECTED = "cartography.poi_selected",
  POI_DESELECTED = "cartography.poi_deselected",
  POI_CATEGORY_SELECTED = "cartography.poi_category_selected",
  POI_CATEGORY_DESELECTED = "cartography.poi_category_deselected",
  BUILDING_SELECTED = "cartography.building_selected",
  FLOOR_SELECTED = "cartography.floor_selected",

  // UI
  FAV_POIS_UPDATED = "ui.favorite_pois_updated",
  UI_SPEAK_ALOUD = "ui.speak_aloud",

  // Directions
  DIRECTIONS_REQUESTED = "directions.requested",

  // Location
  LOCATION_START = "location.start",
  // Navigation
  NAVIGATION_REQUESTED = "navigation.requested",
  NAVIGATION_STOPPED = "navigation.stopped",
}

export interface DirectionOptions {
  from: {
    isIndoor: boolean;
    isOutdoor: boolean;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    cartesianCoordinate: {
      x: number;
      y: number;
    };
    floorIdentifier: number;
    buildingIdentifier: number;
  };
  to: {
    isIndoor: boolean;
    isOutdoor: boolean;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    cartesianCoordinate: {
      x: number;
      y: number;
    };
    floorIdentifier: number;
    buildingIdentifier: number;
  };
  bearingFrom: {
    radians: number;
  };
  accesibilityMode: // cspell:disable-line
    | "CHOOSE_SHORTEST"
    | "ONLY_ACCESIBLE" // cspell:disable-line
    | "ONLY_NOT_ACCESIBLE_FLOOR_CHANGES"; // cspell:disable-line
}

interface NavigationOptions {
  distanceToGoalThreshold: number;
  outsideRouteThreshold: number;
  outsideRouteThresholdOnIncorrectFloor: number;
  distanceToIgnoreIndication: number;
  distanceToFloorChangeThreshold: number;
  distanceToChangeIndicationThreshold: number;
  indicationsInterval: number;
  timeToFirstIndication: number;
  roundIndicationsStep: number;
  timeToIgnoreUnexpectedFloorChanges: number;
  ignoreLowQualityLocations: boolean;
}

export interface ViewerEventPayloads {
  // app
  [ViewerEventType.MAP_IS_READY]: undefined;
  [ViewerEventType.APP_ERROR]: unknown;

  // cartography
  [ViewerEventType.POI_SELECTED]: {
    identifier: number;
    buildingIdentifier: number;
  };
  [ViewerEventType.POI_DESELECTED]: {
    identifier: number;
    buildingIdentifier: number;
  };
  [ViewerEventType.POI_CATEGORY_SELECTED]: { identifiers: number[] | null };
  [ViewerEventType.POI_CATEGORY_DESELECTED]: { identifiers: number[] | null };
  [ViewerEventType.BUILDING_SELECTED]: { identifier: number | null };
  [ViewerEventType.FLOOR_SELECTED]: {
    identifier: number;
    buildingIdentifier: number;
  };

  // ui
  [ViewerEventType.FAV_POIS_UPDATED]: {
    currentPoiIdentifiers: number[];
    favoritePois: number[];
  };
  [ViewerEventType.UI_SPEAK_ALOUD]: {
    text: string;
    lang: string;
    rate: number;
    pitch: number;
    volume: number;
  };
  // directions
  [ViewerEventType.DIRECTIONS_REQUESTED]: {
    requestId: string;
    buildingId: number;
    originId: number;
    originCategory: string;
    destinationId: number;
    destinationCategory: string;
    directionOptions?: DirectionOptions;
  };

  // location
  [ViewerEventType.LOCATION_START]: {
    buildingIdentifier: number;
  };

  // navigation
  [ViewerEventType.NAVIGATION_REQUESTED]: {
    identifier: number;
    buildingId: number;
    originId: number;
    destinationId: number;
    originCategory: string;
    destinationCategory: string;
    directionOptions?: DirectionOptions;
    navigationOptions?: NavigationOptions;
  };
  [ViewerEventType.NAVIGATION_STOPPED]: {
    requestId: string;
  };
}

export enum ViewerActionType {
  //auth
  APP_SET_AUTH = "app.set_auth",
  APP_SET_CONFIG_ITEM = "app.set_config_item",

  //camera
  CAMERA_FOLLOW_USER = "camera.follow_user",
  CAMERA_SET = "camera.set",

  //cartography
  SELECT_POI = "cartography.select_poi",
  SELECT_CAR = "cartography.select_car",
  DESELECT_POI = "cartography.deselect_poi",
  BUILDING_SELECT = "cartography.select_building",
  FLOOR_SELECT = "cartography.select_floor",
  SELECT_POI_CATEGORY = "cartography.select_poi_category",

  //directions
  DIRECTIONS_START = "directions.start",
  DIRECTIONS_UPDATE = "directions.update",
  DIRECTIONS_SET_OPTIONS = "directions.set_options",

  LOCATION_UPDATE = "location.update",
  LOCATION_UPDATE_STATUS = "location.update_status",

  // map
  MAP_EXTERNAL_FEATURES = "map.update_external_features",
  MAP_SHOW_TRAJECTORY = "map.show_trajectory",
  MAP_CLEAR_TRAJECTORY = "map.clear_trajectory",

  //ui
  UI_FONT_SIZE_UPDATE = "ui.font_size_update",
  UI_INITIAL_CONFIG = "ui.initial_configuration", // no constructor
  UI_LANGUAGE_CONFIG = "ui.set_language",
  UI_SET_FAV_POIS = "ui.set_favorite_pois",
  UI_SET_SEARCH_FILTER = "ui.set_search_filter",
  UI_SET_UI_MODE = "ui.set_mode",
  UI_SHOW_USER_SETTINGS = "ui.show_user_settings",
  UI_SPEAK_ALOUD_TEXT = "ui.speak_aloud_text",
  UI_TOGGLE_USER_SETTINGS = "ui.toggle_user_settings",
}

export interface ViewerActionParams {
  //auth
  [ViewerActionType.APP_SET_AUTH]: { jwt: string };
  [ViewerActionType.APP_SET_CONFIG_ITEM]: { key: string; value: string };

  //camera
  [ViewerActionType.CAMERA_FOLLOW_USER]: { value: boolean };
  [ViewerActionType.CAMERA_SET]: {
    center: { lat: number; lng: number };
    zoom: number;
    animate?: boolean;
  };

  //cartography
  [ViewerActionType.SELECT_POI]: { identifier: number };
  [ViewerActionType.SELECT_CAR]: {};
  [ViewerActionType.DESELECT_POI]: {};
  [ViewerActionType.BUILDING_SELECT]: { identifier: number };
  [ViewerActionType.FLOOR_SELECT]: {
    identifier: number;
    buildingIdentifier: number;
  };
  [ViewerActionType.SELECT_POI_CATEGORY]: { identifiers: number[] | null };

  [ViewerActionType.DIRECTIONS_SET_OPTIONS]: {
    directionOptions: DirectionOptions;
  };

  [ViewerActionType.LOCATION_UPDATE]: {
    x: number;
    y: number;
    latitude: number;
    longitude: number;
    floorIdentifier: number;
    buildingIdentifier: number;
    accuracy: number; // optional
    bearing: { radians: number }; // optional
    hasBearing: boolean; // optional but required to see the arrow
  };
  [ViewerActionType.LOCATION_UPDATE_STATUS]: { status: "STARTED" | "STOPPED" };

  // map
  [ViewerActionType.MAP_EXTERNAL_FEATURES]: {
    geometry: {
      coordinates: number[];
      type: string;
    };
    id: string;
    properties: {
      accuracy: number;
      building_id: number;
      floor_id: number;
      icon_url?: string;
      title?: string;
    };
    type: string;
  }[];
  [ViewerActionType.MAP_SHOW_TRAJECTORY]: {
    data: TrajectoryReportPosition[];
    speed: number;
    status: "STOP" | "PLAY";
  };
  [ViewerActionType.MAP_CLEAR_TRAJECTORY]: {
    id: string;
  };
  //ui
  [ViewerActionType.UI_FONT_SIZE_UPDATE]: { fontSize: number };
  [ViewerActionType.UI_INITIAL_CONFIG]: {
    showBuildingSelector: boolean;
    showFloorSelector: boolean;
    showPoiCategories: boolean;
    showUserSettings: boolean;
    showSearchBar: boolean;
    showFavoritePois: boolean;
    enableDirections: boolean;
    enableIndoorLocation: boolean;
    enableOutdoorLocation: boolean;
    enablePoiSelection: boolean;
    mode: "light" | "dark" | "auto";
  };
  [ViewerActionType.UI_LANGUAGE_CONFIG]: { lang: string };
  [ViewerActionType.UI_SET_FAV_POIS]: { identifiers: number[] };
  [ViewerActionType.UI_SET_SEARCH_FILTER]: { text: string };
  [ViewerActionType.UI_SET_UI_MODE]: { mode: "light" | "dark" | "auto" };
  [ViewerActionType.UI_SHOW_USER_SETTINGS]: { show: boolean };
  [ViewerActionType.UI_SPEAK_ALOUD_TEXT]: {
    text: string;
    lang: string;
    rate: number;
    pitch: number;
    volume: number;
  };
  [ViewerActionType.UI_TOGGLE_USER_SETTINGS]: {};
}
