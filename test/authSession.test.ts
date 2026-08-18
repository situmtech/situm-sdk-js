/** biome-ignore-all lint/suspicious/noExplicitAny: Can use `any` keyword in tests */
import axios from "axios";

import SitumSDK from "../src/index";

const ACCESS_TOKENS_URL = "/api/v1/auth/access_tokens";
const REFRESH_TOKENS_URL = "/api/v1/auth/refresh_access_tokens";

const encodeSegment = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString("base64");

/**
 * Builds a JWT with the given lifetime, optionally issued in the past so it
 * already sits inside its renewal margin.
 */
const buildJwt = (lifetimeSeconds: number, issuedSecondsAgo = 0) => {
  const iat = Math.floor(Date.now() / 1000) - issuedSecondsAgo;

  return [
    encodeSegment({ alg: "HS256", typ: "JWT" }),
    encodeSegment({
      email: "user@situm.com",
      exp: iat + lifetimeSeconds,
      iat,
      organization_uuid: "8ad0e3ac-e6e3-4b3f-9b45-0a1f3b7a1f21",
      role: "USER",
    }),
    "signature",
  ].join(".");
};

const authenticationFailure = () => ({
  response: {
    data: {
      code: "invalid_credentials",
      errors: [],
      message: "Invalid credentials, please check your authentication params.",
      status: 401,
    },
  },
});

/**
 * Answers every auth request from a per-url handler, so a test only declares
 * the endpoints it expects to be hit.
 */
const mockAuthEndpoints = (handlers: Record<string, () => unknown>) =>
  jest.spyOn(axios, "request").mockImplementation(async (config: any) => {
    const handler = handlers[config.url];

    if (!handler) {
      throw new Error(`Unexpected request to ${config.url}`);
    }

    return { data: handler() } as any;
  });

const callsTo = (spy: jest.SpyInstance, url: string) =>
  spy.mock.calls.filter((call) => (call[0] as any).url === url).length;

describe("auth session", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("should not authenticate as a side effect of reading the jwt", () => {
    // Arrange
    const spy = mockAuthEndpoints({});
    const situmSDK = new SitumSDK({ auth: { apiKey: "notvalid" } });

    // Execute
    const jwt = situmSDK.jwt;

    // Assert
    expect(jwt).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it("should authenticate on getValidJwt and expose the token", async () => {
    // Arrange
    const jwt = buildJwt(300);
    const spy = mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: jwt,
        refresh_token: "refresh",
      }),
    });
    const situmSDK = new SitumSDK({ auth: { apiKey: "notvalid" } });

    // Execute
    const validJwt = await situmSDK.getValidJwt();

    // Assert
    expect(validJwt).toBe(jwt);
    expect(situmSDK.jwt).toBe(jwt);
    expect(callsTo(spy, ACCESS_TOKENS_URL)).toBe(1);
  });

  it("should not renew a freshly issued short lived token", async () => {
    // Arrange: a fixed 500s margin would exceed the lifetime of this token and
    // report it as expired the moment it was issued.
    const jwt = buildJwt(300);
    const spy = mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: jwt,
        refresh_token: "refresh",
      }),
    });
    const situmSDK = new SitumSDK({ auth: { apiKey: "notvalid" } });

    // Execute
    await situmSDK.getValidJwt();
    const secondJwt = await situmSDK.getValidJwt();

    // Assert
    expect(secondJwt).toBe(jwt);
    expect(callsTo(spy, ACCESS_TOKENS_URL)).toBe(1);
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(0);
  });

  it("should renew through the refresh endpoint once inside the margin", async () => {
    // Arrange
    const expiringJwt = buildJwt(300, 290);
    const renewedJwt = buildJwt(300);
    const spy = mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: expiringJwt,
        refresh_token: "refresh",
      }),
      [REFRESH_TOKENS_URL]: () => ({
        access_token: renewedJwt,
        refresh_token: "renewed-refresh",
      }),
    });
    const situmSDK = new SitumSDK({ auth: { apiKey: "notvalid" } });

    // Execute
    await situmSDK.getValidJwt();
    const renewed = await situmSDK.getValidJwt();

    // Assert
    expect(renewed).toBe(renewedJwt);
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(1);
    expect(spy.mock.calls.at(-1)?.[0].data).toStrictEqual({
      access_token: expiringJwt,
      refresh_token: "refresh",
    });
  });

  it("should collapse concurrent renewals into a single request", async () => {
    // Arrange: single use refresh tokens would invalidate one another.
    const expiringJwt = buildJwt(300, 290);
    const renewedJwt = buildJwt(300);
    const spy = mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: expiringJwt,
        refresh_token: "refresh",
      }),
      [REFRESH_TOKENS_URL]: () => ({
        access_token: renewedJwt,
        refresh_token: "renewed-refresh",
      }),
    });
    const situmSDK = new SitumSDK({ auth: { apiKey: "notvalid" } });
    await situmSDK.getValidJwt();

    // Execute
    const renewals = await Promise.all([
      situmSDK.getValidJwt(),
      situmSDK.getValidJwt(),
      situmSDK.getValidJwt(),
    ]);

    // Assert
    expect(renewals).toStrictEqual([renewedJwt, renewedJwt, renewedJwt]);
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(1);
  });

  it("should fall back to a full authentication when the refresh fails", async () => {
    // Arrange
    const expiringJwt = buildJwt(300, 290);
    const freshJwt = buildJwt(300);
    let authenticated = false;
    const spy = mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => {
        const accessToken = authenticated ? freshJwt : expiringJwt;
        authenticated = true;

        return { access_token: accessToken, refresh_token: "refresh" };
      },
      [REFRESH_TOKENS_URL]: () => {
        throw authenticationFailure();
      },
    });
    const situmSDK = new SitumSDK({ auth: { apiKey: "notvalid" } });
    await situmSDK.getValidJwt();

    // Execute
    const renewed = await situmSDK.getValidJwt();

    // Assert
    expect(renewed).toBe(freshJwt);
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(1);
    expect(callsTo(spy, ACCESS_TOKENS_URL)).toBe(2);
  });

  it("should renew a session handed over with a refresh token", async () => {
    // Arrange
    const handedOverJwt = buildJwt(300, 290);
    const renewedJwt = buildJwt(300);
    const spy = mockAuthEndpoints({
      [REFRESH_TOKENS_URL]: () => ({
        access_token: renewedJwt,
        refresh_token: "renewed-refresh",
      }),
    });
    const situmSDK = new SitumSDK({
      auth: { jwt: handedOverJwt, refreshToken: "refresh" },
    });

    // Execute: the handed over token is installed as is, and renewed from the
    // next use onwards.
    const firstJwt = await situmSDK.getValidJwt();
    const renewed = await situmSDK.getValidJwt();

    // Assert
    expect(firstJwt).toBe(handedOverJwt);
    expect(renewed).toBe(renewedJwt);
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(1);
  });

  it("should keep a jwt only session that cannot be renewed", async () => {
    // Arrange
    const expiringJwt = buildJwt(300, 290);
    const spy = mockAuthEndpoints({});
    const situmSDK = new SitumSDK({ auth: { jwt: expiringJwt } });

    // Execute
    const validJwt = await situmSDK.getValidJwt();

    // Assert
    expect(validJwt).toBe(expiringJwt);
    expect(spy).not.toHaveBeenCalled();
  });

  it("should reject when there is no auth configuration", async () => {
    // Arrange
    const situmSDK = new SitumSDK({});

    // Execute & Assert
    await expect(situmSDK.getValidJwt()).rejects.toThrow(
      "No auth configuration provided",
    );
  });

  it("should expose the decoded session through authSession", async () => {
    // Arrange
    const jwt = buildJwt(300);
    mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: jwt,
        refresh_token: "refresh",
      }),
    });
    const situmSDK = new SitumSDK({ auth: { apiKey: "notvalid" } });

    // Execute
    const authSession = await situmSDK.authSession;

    // Assert
    expect(authSession?.jwt).toBe(jwt);
    expect(authSession?.payload.email).toBe("user@situm.com");
    expect(authSession?.organizationId).toBe(
      "8ad0e3ac-e6e3-4b3f-9b45-0a1f3b7a1f21",
    );
  });

  it("should notify onAuthSessionChange on authentication and on renewal", async () => {
    // Arrange
    const expiringJwt = buildJwt(300, 290);
    const renewedJwt = buildJwt(300);
    mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: expiringJwt,
        refresh_token: "refresh",
      }),
      [REFRESH_TOKENS_URL]: () => ({
        access_token: renewedJwt,
        refresh_token: "renewed-refresh",
      }),
    });
    const onAuthSessionChange = jest.fn();
    const situmSDK = new SitumSDK({
      auth: { apiKey: "notvalid" },
      onAuthSessionChange,
    });

    // Execute
    await situmSDK.getValidJwt();
    await situmSDK.getValidJwt();

    // Assert
    expect(onAuthSessionChange.mock.calls).toStrictEqual([
      [{ jwt: expiringJwt, refreshToken: "refresh" }],
      [{ jwt: renewedJwt, refreshToken: "renewed-refresh" }],
    ]);
  });

  it("should not break authentication when onAuthSessionChange throws", async () => {
    // Arrange
    const jwt = buildJwt(300);
    mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: jwt,
        refresh_token: "refresh",
      }),
    });
    const situmSDK = new SitumSDK({
      auth: { apiKey: "notvalid" },
      onAuthSessionChange: () => {
        throw new Error("consumer blew up");
      },
    });

    // Execute & Assert
    await expect(situmSDK.getValidJwt()).resolves.toBe(jwt);
  });

  it("should renew ahead of expiration when autoRenewSession is enabled", async () => {
    // Arrange
    jest.useFakeTimers();
    const jwt = buildJwt(3600);
    let renewedJwt = "";
    const spy = mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: jwt,
        refresh_token: "refresh",
      }),
      [REFRESH_TOKENS_URL]: () => {
        renewedJwt = buildJwt(3600);

        return { access_token: renewedJwt, refresh_token: "renewed-refresh" };
      },
    });
    const situmSDK = new SitumSDK({
      auth: { apiKey: "notvalid" },
      autoRenewSession: true,
    });
    await situmSDK.getValidJwt();

    // Execute: the margin of a 3600s token is 500s, so nothing fires early.
    await jest.advanceTimersByTimeAsync((3600 - 500) * 1000 - 1000);
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(0);
    await jest.advanceTimersByTimeAsync(1000);

    // Assert
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(1);
    expect(situmSDK.jwt).toBe(renewedJwt);

    situmSDK.dispose();
  });

  it("should not schedule any renewal when autoRenewSession is disabled", async () => {
    // Arrange
    jest.useFakeTimers();
    const jwt = buildJwt(3600);
    const spy = mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: jwt,
        refresh_token: "refresh",
      }),
    });
    const situmSDK = new SitumSDK({ auth: { apiKey: "notvalid" } });
    await situmSDK.getValidJwt();

    // Execute
    await jest.advanceTimersByTimeAsync(3600 * 1000);

    // Assert
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(0);
  });

  it("should cancel the scheduled renewal on dispose", async () => {
    // Arrange
    jest.useFakeTimers();
    const jwt = buildJwt(3600);
    const spy = mockAuthEndpoints({
      [ACCESS_TOKENS_URL]: () => ({
        access_token: jwt,
        refresh_token: "refresh",
      }),
      [REFRESH_TOKENS_URL]: () => ({
        access_token: buildJwt(3600, 1),
        refresh_token: "renewed-refresh",
      }),
    });
    const situmSDK = new SitumSDK({
      auth: { apiKey: "notvalid" },
      autoRenewSession: true,
    });
    await situmSDK.getValidJwt();

    // Execute
    situmSDK.dispose();
    await jest.advanceTimersByTimeAsync(3600 * 1000);

    // Assert
    expect(callsTo(spy, REFRESH_TOKENS_URL)).toBe(0);
  });
});
