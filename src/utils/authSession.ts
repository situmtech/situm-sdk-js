import type { SitumJWTPayload } from "../types";
import SitumError from "./situmError";

export default class AuthSession {
  private _jwt: string;
  private _refreshToken: string;

  public payload: SitumJWTPayload;

  constructor(jwt, refreshToken) {
    this._jwt = jwt;
    this._refreshToken = refreshToken;

    if (!this._jwt) {
      throw new SitumError({
        code: "invalid_jwt",
        errors: [],
        message: "Invalid JWT",
        status: 401,
      });
    }

    // Decoding JWT
    const base64Url = this._jwt.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );

    const payload = JSON.parse(jsonPayload) as SitumJWTPayload;

    this.payload = {
      api_permission: payload.api_permission,
      email: payload.email,
      exp: payload.exp,
      organization_uuid: payload.organization_uuid,
      role: payload.role,
    } as SitumJWTPayload;
  }

  /**
   * Checks if the current session is expired.
   *
   * @returns {boolean} True if the session is expired, false otherwise.
   */
  isExpired() {
    return (this.payload.exp - 500) * 1000 < Date.now();
  }

  public get organizationId() {
    return this.payload.organization_uuid;
  }

  /**
   * Returns the role from the payload.
   *
   * @returns {string} The role from the payload.
   */
  /** */
  public get role() {
    return this.payload.role;
  }

  /**
   * Returns the API permission level from the payload.
   *
   * @returns {SitumApiPermissionLevel} The API permission level from the payload or "read-write" if not present.
   */
  public get apiPermissionLevel() {
    return this.payload.api_permission;
  }

  /**
   * Returns the JWT string for the current session.
   *
   * @returns {string} The JWT value.
   */
  public get jwt() {
    return this._jwt;
  }

  /**
   * Returns the refresh token for the current session.
   *
   * @returns {string} The refresh token.
   */
  public get refreshToken() {
    return this._refreshToken;
  }

  invalid;
}
