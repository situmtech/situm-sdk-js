/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SitumSDK from "../../src";
import {
  getFormDataFile,
  getMockData,
  mockAxiosRequest,
} from "../utils/mockUtils";

describe("SitumSDK.cartography GeoJSON", () => {
  it("should upload GeoJSON with object input", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockGeoJSON = getMockData("geoJSONMock1");
    const buildingId = 1111;
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      null,
    ]);

    // Execute
    await situmSDK.cartography.uploadGeoJSON({
      buildingId,
      geojson: mockGeoJSON,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).toBe("post");
    expect(configuration.url).toEqual(
      `/api/v1/buildings/${buildingId}/vector_map`,
    );

    // Verify FormData contents
    const file = getFormDataFile(configuration.data as FormData);
    expect(file).not.toBeNull();
    expect(file?.name).toBe("data.geojson");
    expect(file?.type).toBe("application/geo+json");

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should upload GeoJSON with Blob input", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockGeoJSON = getMockData("geoJSONMock1");
    const buildingId = 1111;
    const blob = new Blob([JSON.stringify(mockGeoJSON)], {
      type: "application/geo+json",
    });
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      null,
    ]);

    // Execute
    await situmSDK.cartography.uploadGeoJSON({
      buildingId,
      geojson: blob,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).toBe("post");
    expect(configuration.url).toEqual(
      `/api/v1/buildings/${buildingId}/vector_map`,
    );

    // Verify FormData contents
    const file = getFormDataFile(configuration.data as FormData);
    expect(file).not.toBeNull();
    expect(file?.name).toBe("data.geojson");

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete GeoJSON", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const buildingId = 1111;
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      null,
    ]);

    // Execute
    await situmSDK.cartography.deleteGeoJSON(buildingId);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(
      `/api/v1/buildings/${buildingId}/vector_map`,
    );
    expect(configuration.method).toBe("delete");

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should upload theme with object input", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockTheme = getMockData("geoJSONThemeMock1");
    const buildingId = 1111;
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      null,
    ]);

    // Execute
    await situmSDK.cartography.uploadGeoJSONTheme({
      buildingId,
      theme: mockTheme,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).toBe("post");
    expect(configuration.url).toEqual(
      `/api/v1/buildings/${buildingId}/geojson_theme`,
    );

    // Verify FormData contents
    const file = getFormDataFile(configuration.data as FormData);
    expect(file).not.toBeNull();
    expect(file?.name).toBe("theme.json");
    expect(file?.type).toBe("application/json");

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should upload theme with Blob input", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockTheme = getMockData("geoJSONThemeMock1");
    const buildingId = 1111;
    const blob = new Blob([JSON.stringify(mockTheme)], {
      type: "application/json",
    });
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      null,
    ]);

    // Execute
    await situmSDK.cartography.uploadGeoJSONTheme({
      buildingId,
      theme: blob,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).toBe("post");
    expect(configuration.url).toEqual(
      `/api/v1/buildings/${buildingId}/geojson_theme`,
    );

    // Verify FormData contents
    const file = getFormDataFile(configuration.data as FormData);
    expect(file).not.toBeNull();
    expect(file?.name).toBe("theme.json");

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
