import type { Cartesians, LatLng } from "./coordinates";
import type { CustomField, ID, PaginatedSearchShort, UUID } from "./models";

type GeofenceType = "POLYGON";

type Geofence = GeofenceForm & {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
};

type GeofenceForm = {
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

type GeofenceSearch = PaginatedSearchShort & {
  organizationId?: UUID;
  buildingIds?: ID[];
  name?: string;
  deleted?: boolean;
};

type CalibrationModel = {
  id: number;
  updatedAt: Date;
  download: string;
};

type Dimensions = {
  width: number;
  length: number;
};

type PoiUpdateForm = {
  buildingId: ID;
  name?: string;
  info?: string;
  categoryId?: number;
  categoryIds?: number[];
  customFields?: CustomField[];
  icon?: string;
  selectedIcon?: string;
  position: {
    floorId: ID;
    georeferences: LatLng;
  };
};

type PoiCreateForm = PoiUpdateForm;

type Poi = Required<PoiCreateForm> & {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
  infoUnsafe: string;
  type: string;
  floorId: number;
  location: LatLng & Cartesians;
};

type PoiSearch = {
  buildingId?: ID;
  type?: "indoor" | "outdoor";
  view?: "compact";
};

type PathNode = {
  id: number;
  floorId: number;
  x: number;
  y: number;
};

type PathLink = {
  source: number;
  target: number;
  origin: "both" | "source" | "target";
  tags: string[];
  accessible: boolean;
};

type PathSearch = { buildingId?: ID };

type Paths = {
  nodes: PathNode[];
  links: PathLink[];
};

type Maps = {
  scale: number;
  map_url: string;
  map_id: string;
};

type FloorBase = {
  buildingId: ID;
  level: number;
  levelHeight?: number;
  name?: string;
  customFields?: CustomField[];
};

type FloorForm = FloorBase & {
  mapId: string;
};

type Floor = FloorBase & {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  maps: Maps;
};

type FloorSearch = { buildingId?: ID };

type BuildingBase = {
  customFields?: CustomField[];
  description?: string;
  dimensions: Dimensions;
  info?: string;
  location: LatLng;
  name: string;
  rotation: number;
};

type BuildingForm = {
  customFields?: CustomField[];
  description?: string;
  dimensions: Dimensions;
  info?: string;
  location: LatLng;
  name: string;
  pictureId?: string;
  rotation?: number;
};

type BuildingListElement = Required<BuildingBase> & {
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

type Building = Required<BuildingListElement> & {
  corners: LatLng[];
  floors: Floor[];
  pois: Poi[];
  geofences: Geofence[];
  paths: Paths;
};

type PoiCategoryBase = {
  nameEn: string;
  nameEs?: string;
  code: string;
};

type PoiCategoryForm = PoiCategoryBase & {
  icon?: string;
  selectedIcon?: string;
};

type PoiCategory = PoiCategoryBase & {
  id: ID;
  iconUrl: string;
  selectedIconUrl: string;
  updatedAt: Date;
  createdAt: Date;
  public: boolean;
};

export type {
  Building,
  BuildingForm,
  BuildingListElement,
  Floor,
  FloorForm,
  FloorSearch,
  Geofence,
  GeofenceForm,
  GeofenceSearch,
  PathSearch,
  Paths,
  Poi,
  PoiCategory,
  PoiCategoryForm,
  PoiCreateForm,
  PoiSearch,
  PoiUpdateForm,
};
