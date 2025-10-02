import expect from "expect";

/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import SitumSDK from "../src";
import {
  checkAuthenticationException,
  getAuthenticationException,
  mockAxiosRequest,
} from "./utils/mockUtils";

describe("SitumSDK", () => {
  it("should have a version", () => {
    const version = SitumSDK.version;

    expect(version).toBeDefined();
    expect(version).not.toBeNull();
  });

  it("should have the user domain", () => {
    const situmSDK = new SitumSDK({});
    const userApi = situmSDK.user;

    expect(userApi).toBeDefined();
    expect(userApi).not.toBeNull();
  });

  it("should initialize with basic authentication", () => {
    const situmSDK = new SitumSDK({
      auth: {
        password: "topSecret",
        username: "test@situm.com",
      },
    });
    const userApi = situmSDK.user;

    expect(userApi).toBeDefined();
    expect(userApi).not.toBeNull();
  });

  it("should initialize with api key authentication", () => {
    const situmSDK = new SitumSDK({
      auth: {
        apiKey: "topSecret",
      },
    });
    const userApi = situmSDK.user;

    expect(userApi).toBeDefined();
    expect(userApi).not.toBeNull();
  });

  it("should generate a jwt with apikey", () => {
    const situmSDK = new SitumSDK({
      auth: {
        apiKey: "topSecret",
      },
    });
    const userApi = situmSDK.user;

    expect(userApi).toBeDefined();
    expect(userApi).not.toBeNull();
  });

  it("should raise auth exception with invalid basic authentication", async () => {
    const situmSDK = new SitumSDK({
      auth: {
        apiKey: "topSecret",
      },
    });

    const axiosMock = mockAxiosRequest(getAuthenticationException());

    try {
      await situmSDK.user.getUserById("test-uuid");

      expect(true).toBe(false);
    } catch (error) {
      checkAuthenticationException(error);
      const configuration = axiosMock.mock.calls[0][0];

      const { url, data, headers } = configuration;

      expect(url).toBe("/api/v1/auth/access_tokens");
      expect(data).toBeUndefined();
      expect(headers["X-API-KEY"]).toBe("topSecret");
      // expect(headers["X-API-CLIENT"]).to.be.equals(
      //   "SitumJSSDK/" + SitumSDK.version
      // );
      axiosMock.mockRestore();
    }
  });

  it("should raise exception with invalid basic authentication", async () => {
    const situmSDK = new SitumSDK({
      auth: {
        password: "topSecret",
        username: "test@situm.com",
      },
    });

    const axiosMock = mockAxiosRequest(getAuthenticationException());

    try {
      await situmSDK.user.getUserById("test-uuid");

      expect(true).toBe(false);
    } catch (error) {
      checkAuthenticationException(error);
      const configuration = axiosMock.mock.calls[0][0];

      const { url, data, auth, headers } = configuration;

      expect(url).toBe("/api/v1/auth/access_tokens");
      expect(data).toBeUndefined();
      expect(auth?.password).toBe("topSecret");
      expect(auth?.username).toBe("test@situm.com");
      expect(headers).toMatchObject({ "Content-Type": "application/json" });

      expect(headers["X-API-KEY"]).toBeUndefined();
      // expect(headers["X-API-CLIENT"]).to.be.equals(
      //   "SitumJSSDK/" + SitumSDK.version
      // );

      axiosMock.mockRestore();
    }
  });
});
