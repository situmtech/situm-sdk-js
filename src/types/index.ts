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
export type ID = number;

export type SDKConfiguration = {
  domain?: string;
  auth?: Auth;
  timeouts?: Record<string, number>;
  version?: string;
  lang?: string;
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
  geometric: [[number, number]];
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
  floorId: ID;
  name: string;
  info: string;
  categoryId: number;
  location: Coordinate;
  customFields: CustomField[];
};

export type PoiCreateForm = PoiUpdateForm & {
  buildingId: ID;
};

export type Poi = PoiCreateForm & {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
  infoUnsafe: string;
  type: string;
  location: Coordinate & Cartesians;
};

export type PoiSearch = { buildingId?: ID; type?: "indoor" | "outdoor" };

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
