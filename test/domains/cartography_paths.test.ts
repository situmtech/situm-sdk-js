/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SitumSDK from "../../src";
import type { Paths } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.cartography Path", () => {
  it("should retrieve the path by building", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPath = getMockData("pathMock1");
    const buildingId = 1111;
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("pathResponseMock1"),
    ]);

    // Execute
    const path = await situmSDK.cartography.getPaths({ buildingId });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/buildings/${buildingId}/paths`);
    expect(path).toEqual(mockPath);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all the paths", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPath = getMockData("pathMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      [getMockData("pathResponseMock1")],
    ]);

    // Execute
    const pathList = await situmSDK.cartography.getPaths();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/paths`);
    expect(pathList).toEqual([mockPath]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all the paths", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPath = getMockData("pathMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      [getMockData("pathResponseMock1")],
    ]);

    // Execute
    const pathList = await situmSDK.cartography.getPaths();

    // Asert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/paths`);
    expect(pathList).toEqual([mockPath]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should update/create a path", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPath = getMockData("pathMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("pathResponseMock1"),
    ]);
    const buildingId = 1111;
    const pathForm: Paths = {
      links: [
        {
          accessible: true,
          origin: "both",
          source: 1,
          tags: [],
          target: 2,
        },
        {
          accessible: true,
          origin: "both",
          source: 2,
          tags: [],
          target: 3,
        },
      ],
      nodes: [
        {
          floorId: 12220,
          id: 1,
          x: 56.417,
          y: 11.716,
        },
        {
          floorId: 12220,
          id: 2,
          x: 111.006,
          y: 12.038,
        },
      ],
    };

    // Execute
    const path = await situmSDK.cartography.patchPath(buildingId, pathForm);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).toEqual({
      links: [
        {
          accessible: true,
          origin: "both",
          source: 1,
          tags: [],
          target: 2,
        },
        {
          accessible: true,
          origin: "both",
          source: 2,
          tags: [],
          target: 3,
        },
      ],
      nodes: [
        {
          floor_id: 12220,
          id: 1,
          x: 56.417,
          y: 11.716,
        },
        {
          floor_id: 12220,
          id: 2,
          x: 111.006,
          y: 12.038,
        },
      ],
    });
    expect(configuration.method).toBe("put");
    expect(configuration.url).toBe(`/api/v1/buildings/${buildingId}/paths`);
    expect(path).toEqual(mockPath);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
