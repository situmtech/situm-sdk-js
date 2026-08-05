import type { SitumJWTPayload } from "../types/auth";
import SitumError from "./situmError";

const MAX_EXPIRATION_MARGIN_SECONDS = 500;
const EXPIRATION_MARGIN_RATIO = 0.2;

export default class AuthSession {
  private _jwt: string;
  private _refreshToken: string | null;
  private _receivedAt: number;

  public payload: SitumJWTPayload;

  constructor(jwt: string, refreshToken: string | null) {
    this._jwt = jwt;
    this._refreshToken = refreshToken;
    this._receivedAt = Date.now();

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
      iat: payload.iat,
      organization_uuid: payload.organization_uuid,
      role: payload.role,
    } as SitumJWTPayload;
  }

  /**
   * Instant at which the session must be replaced, in epoch milliseconds, or
   * null when the token carries no usable `exp`.
   *
   * A fixed margin cannot span the supported lifetimes: with a 5 minute token
   * a flat 500s margin covers more than the token itself, so the session would
   * be reported as expired the moment it is issued and every request would
   * trigger a renewal. Capping the margin to a fraction of the lifetime
   * guarantees a freshly received token is never already inside its margin.
   *
   * The lifetime comes from `iat` when present, keeping it purely server side
   * and immune to client clock skew, and falls back to the reception time.
   */
  private get renewalDeadlineMs(): number | null {
    const { exp, iat } = this.payload;

    if (typeof exp !== "number") {
      return null;
    }

    const lifetimeSeconds =
      typeof iat === "number" ? exp - iat : exp - this._receivedAt / 1000;
    const marginSeconds = Math.min(
      MAX_EXPIRATION_MARGIN_SECONDS,
      Math.max(lifetimeSeconds, 0) * EXPIRATION_MARGIN_RATIO,
    );

    return (exp - marginSeconds) * 1000;
  }

  /**
   * Checks if the current session is expired, or close enough to expiring that
   * it should be renewed before being used again.
   */
  isExpired() {
    const deadline = this.renewalDeadlineMs;

    return deadline !== null && deadline < Date.now();
  }

  /**
   * Milliseconds left until the session enters its renewal margin, so it can be
   * renewed ahead of time instead of waiting for the next request.
   */
  public get renewalDelayMs(): number | null {
    const deadline = this.renewalDeadlineMs;

    return deadline === null ? null : Math.max(deadline - Date.now(), 0);
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
