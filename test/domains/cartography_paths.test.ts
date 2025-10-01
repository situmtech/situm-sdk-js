/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SitumSDK from "../../src";
import { Paths } from "../../src/types";
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
      nodes: [
        {
          id: 1,
          floorId: 12220,
          x: 56.417,
          y: 11.716,
        },
        {
          id: 2,
          floorId: 12220,
          x: 111.006,
          y: 12.038,
        },
      ],
      links: [
        {
          source: 1,
          target: 2,
          origin: "both",
          tags: [],
          accessible: true,
        },
        {
          source: 2,
          target: 3,
          origin: "both",
          tags: [],
          accessible: true,
        },
      ],
    };

    // Execute
    const path = await situmSDK.cartography.patchPath(buildingId, pathForm);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).toEqual({
      nodes: [
        {
          id: 1,
          floor_id: 12220,
          x: 56.417,
          y: 11.716,
        },
        {
          id: 2,
          floor_id: 12220,
          x: 111.006,
          y: 12.038,
        },
      ],
      links: [
        {
          source: 1,
          target: 2,
          origin: "both",
          tags: [],
          accessible: true,
        },
        {
          source: 2,
          target: 3,
          origin: "both",
          tags: [],
          accessible: true,
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
