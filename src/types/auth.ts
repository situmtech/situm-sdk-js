import type { ID, PaginatedSearch, UUID } from "./models";

type Jwt = string;

enum SitumApiPermissionLevel {
  POSITIONING = "positioning",
  READ_ONLY = "read-only",
  CARTGRAPHY_READ_WRITE = "cartography-read-write",
  READ_WRITE = "read-write",
}

type Apikey = {
  id: UUID;
  apikey: string;
  permission:
    | SitumApiPermissionLevel.READ_ONLY
    | SitumApiPermissionLevel.POSITIONING;
  description: string;
};

type AuthBasic = {
  username: string;
  password: string;
};

type AuthApiKey = {
  apiKey: string;
};

type AuthJWT = {
  jwt: Jwt;
};

type AuthConfiguration = AuthBasic | AuthApiKey | AuthJWT;

interface SitumJWTPayload {
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

/******************* USER *******************/
type Role =
  | "ADMIN_ORG"
  | "ZONE_MANAGER"
  | "COLLECTIVE_MANAGER"
  | "STAFF"
  | "USER";

type LicenseType = "FREE_TRIAL" | "PARTNER" | "ENTERPRISE" | "INTERNAL";

type License = {
  id: UUID;
  expirationDate: Date;
  licenseType: LicenseType;
};

type User = {
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

type UserForm = {
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

type UserSearch = PaginatedSearch & {
  ids?: string[];
  excludeIds?: string[];
  groupIds?: string[];
  buildingIds?: ID[];
  hasBuildings?: boolean;
  fullName?: string;
  codes?: string[];
};

export type {
  Apikey,
  AuthApiKey,
  AuthBasic,
  AuthJWT,
  AuthConfiguration,
  Jwt,
  SitumApiPermissionLevel,
  SitumJWTPayload,
  User,
  UserForm,
  UserSearch,
  Role,
};
