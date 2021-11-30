/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { expect } from "chai";

import SitumSDK from "../index";

import {
  checkAuthenticationException,
  getAuthenticationException,
  mockAxiosRequest,
} from "./utils/mockUtils";

describe("SitumSDK", () => {
  test("should have a version", () => {
    const version = SitumSDK.version;

    expect(version).exist;
    expect(version).is.not.be.null;
  });

  test("should have the user domain", () => {
    const situmSDK = new SitumSDK({});
    const userApi = situmSDK.user;

    expect(userApi).exist;
    expect(userApi).is.not.be.null;
  });

  test("should initialize with basic authentication", () => {
    const situmSDK = new SitumSDK({
      auth: {
        username: "test@situm.com",
        password: "topSecret",
      },
    });
    const userApi = situmSDK.user;

    expect(userApi).exist;
    expect(userApi).is.not.be.null;
  });

  test("should initialize with api key authentication", () => {
    const situmSDK = new SitumSDK({
      auth: {
        email: "test@situm.com",
        apiKey: "topSecret",
      },
    });
    const userApi = situmSDK.user;

    expect(userApi).exist;
    expect(userApi).is.not.be.null;
  });

  test("should generate a jwt with apikey", () => {
    const situmSDK = new SitumSDK({
      auth: {
        email: "test@situm.com",
        apiKey: "topSecret",
      },
    });
    const userApi = situmSDK.user;

    expect(userApi).exist;
    expect(userApi).is.not.be.null;
  });

  test("should raise auth exception with invalid basic authentication", async () => {
    const situmSDK = new SitumSDK({
      auth: {
        email: "test@situm.com",
        apiKey: "topSecret",
      },
    });

    const axiosMock = mockAxiosRequest(getAuthenticationException());

    try {
      await situmSDK.user.getUserById("test-uuid");

      expect(true).is.equal(false);
    } catch (error) {
      checkAuthenticationException(error);
      const configuration = axiosMock.mock.calls[0][0];

      const { url, data, headers } = configuration;

      expect(url).to.be.equals("/api/v1/auth/access_tokens");
      expect(data).to.be.undefined;
      expect(headers["X-API-KEY"]).to.be.equals("topSecret");
      expect(headers["X-API-EMAIL"]).to.be.equals("test@situm.com");
      expect(headers["User-Agent"]).to.be.equals(
        "SitumJSSDK/" + SitumSDK.version
      );
      axiosMock.mockRestore();
    }
  });

  test("should raise exception with invalid basic authentication", async () => {
    const situmSDK = new SitumSDK({
      auth: {
        username: "test@situm.com",
        password: "topSecret",
      },
    });

    const axiosMock = mockAxiosRequest(getAuthenticationException());

    try {
      await situmSDK.user.getUserById("test-uuid");

      expect(true).is.equal(false);
    } catch (error) {
      checkAuthenticationException(error);
      const configuration = axiosMock.mock.calls[0][0];

      const { url, data, auth, headers } = configuration;

      expect(url).to.be.equals("/api/v1/auth/access_tokens");
      expect(data).to.be.undefined;
      expect(auth?.password).to.be.equals("topSecret");
      expect(auth?.username).to.be.equals("test@situm.com");
      expect(headers["User-Agent"]).to.be.equals(
        "SitumJSSDK/" + SitumSDK.version
      );

      axiosMock.mockRestore();
    }
  });
});
