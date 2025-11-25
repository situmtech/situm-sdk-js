import type { Feature, Point } from "geojson";

import type { AuthConfiguration } from "./auth";

type UUID = string;
type ID = number;

type SDKConfiguration = {
  domain?: string;
  auth?: AuthConfiguration;
  timeouts?: Record<string, number>;
  version?: string;
  lang?: string;
  compact?: boolean;
};

type CustomField = {
  key: string;
  value: string;
};

type Metadata = {
  first: boolean;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
};

type Paginated<T> = {
  data: T[];
  metadata: Metadata;
};

type PaginatedSearchShort = {
  page?: number;
  size?: number;
  sort?: string;
};

type PaginatedSearch = PaginatedSearchShort & {
  direction?: string;
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

type Organization = {
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

interface ExternalFeatureProperties {
  floor_id: number;
  building_id: number;
  accuracy?: number;
  title?: string;
  icon_url?: string;
}
type ExternalFeature = Feature<Point, ExternalFeatureProperties>;

type RangeFilter = {
  min: number;
  max: number;
};

type TrajectoryDataPoint = {
  timestamp: string;
  sessionMark: number;
  floorId: number;
  userId: string;
  deviceId: string;
  lat: number;
  lng: number;
};

type Trajectory = {
  status?: "PLAY" | "PAUSE";
  speed?: number;
  followUser?: boolean;
  tooltip?: string;
  data?: TrajectoryDataPoint[];
  rangeFilter?: RangeFilter;
  currentIndex?: { value: number; mustReset: boolean };
  pathColor?: string;
};

export type {
  ID,
  UUID,
  Trajectory,
  ExternalFeature,
  SDKConfiguration,
  CustomField,
  PaginatedSearchShort,
  PaginatedSearch,
  Paginated,
  Organization,
};
