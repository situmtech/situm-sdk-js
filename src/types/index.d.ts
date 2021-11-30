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
  email: string;
  apiKey: string;
};

export type Auth = AuthBasic | AuthApiKey;

export type Jwt = string;

export type UUID = string;

export type SDKConfiguration = {
  domain?: string;
  auth?: Auth;
  timeouts?: Record<string, number>;
  version?: string;
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
  buildingIds: number[];
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
  groupIds?: number[];
  buildingIds?: number[];
  role?: Role;
  iconColour?: string;
  info?: string;
  acceptTerms?: boolean;
};

export type SearchUser = PaginatedSearch & {
  ids?: string[];
  excludeIds?: string[];
  groupIds?: string[];
  buildingIds?: number[];
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
  customFields?: CustomField[];
  name: string;
  code?: string;
  organizationId?: UUID;
  info?: string;
  type: GeofenceType;
  geometric: [[number, number]];
  floorId: number;
  buildingId: string;
};

export type SearchGeofence = PaginatedSearchShort & {
  organizationId?: UUID;
  buildingIds?: number[];
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

export type Position = {
  floorId: number;
  x: number;
  y: number;
  lat: number;
  lng: number;
  radius: 5;
  georeferences: Coordinate;
  cartesians: Cartesians;
};

export type PoisUpdateForm = {
  name: string;
  info: string;
  categoryId: number;
  position: Position;
  customFields: CustomField[];
};

export type PoisCreateForm = PoisUpdateForm & {
  buildingId: number;
};

export type Pois = PoisCreateForm & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
  infoUnsafe: string;
  type: string;
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
  origin: string;
  tags: string[];
  accesible?: boolean;
};

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
  buildingId: number;
  level: number;
  levelHeight?: number;
  name?: string;
  customFields?: CustomField[];
};

export type FloorForm = FloorBase & {
  mapId: string;
};

export type Floor = FloorBase & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  maps: Maps;
};

export type BuildingBase = {
  name: string;
  location: Coordinate;
  dimensions: Dimensions;
  description?: string;
  info?: string;
  rotation: number;
  customFields?: CustomField[];
};

export type BuildingForm = BuildingBase & {
  pictureId?: string;
};

export type BuildingListElement = {
  info: string;
  id: number;
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
  floors: Floor;
  outdoorPois: Pois[];
  indoorPois: Pois[];
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
  id: number;
  iconUrl: string;
  selectedIconUrl: string;
  updatedAt: Date;
  createdAt: Date;
  public: boolean;
};

export type Geometry = {
  type: string;
  coordinates: [number, number];
};

export type Property = {
  time: Date;
  yaw: number;
  localCoordinates: [number, number];
  floorId: number;
  buildingId: number;
  levelHeight: number;
  accuracy: number;
};

export type Feature = {
  type: string;
  geometry: Geometry;
  properties: Property;
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
  features: Feature[];
  devicesInfo: Device[];
};

export type SearchRealtime = { organizationId?: UUID } | { buildingId: number };
