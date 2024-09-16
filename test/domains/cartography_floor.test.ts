/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SitumSDK from "../../src";
import { FloorForm } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.cartography Floor", () => {
  it("should retrieve a floor by id", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockFloor = getMockData("floorMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("floorResponseMock1"),
    ]);
    const floor = await situmSDK.cartography.getFloorById(mockFloor.id);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/floors/${mockFloor.id}`);
    expect(floor).toEqual(mockFloor);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all floors", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockFloorList = [getMockData("floorResponseMock1")];
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      mockFloorList,
    ]);

    // Execute
    const floorList = await situmSDK.cartography.getFloors();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).toBe(undefined);
    expect(configuration.url).toBe(`/api/v1/floors`);
    expect(floorList).toEqual([getMockData("floorMock1")]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all floors by its building id", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockFloorList = [getMockData("floorResponseMock1")];
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      mockFloorList,
    ]);

    // Execute
    const floorList = await situmSDK.cartography.getFloors({
      buildingId: mockFloorList[0].building_id,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).toBe(undefined);
    expect(configuration.url).toBe(
      `/api/v1/buildings/${mockFloorList[0].building_id}/floors`,
    );
    expect(floorList).toEqual([getMockData("floorMock1")]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should create a floor", async () => {
    // Arrange
    const mockFloor = getMockData("floorMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("floorResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const floorForm: FloorForm = {
      customFields: [{ key: "key", value: "value" }],
      buildingId: 5962,
      name: "Test floor",
      level: 1,
      levelHeight: 12,
      mapId: "mapId",
    };

    // Execute
    const floor = await situmSDK.cartography.createFloor(floorForm);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).toEqual({
      custom_fields: [{ key: "key", value: "value" }],
      building_id: 5962,
      name: "Test floor",
      level: 1,
      level_height: 12,
      map_id: "mapId",
    });
    expect(configuration.method).toBe("post");
    expect(configuration.url).toBe("/api/v1/floors");
    expect(floor).toEqual(mockFloor);

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should update a floor", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockFloor = getMockData("floorMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("floorResponseMock1"),
    ]);

    // Execute
    const floorForm: FloorForm = {
      customFields: [{ key: "key", value: "value" }],
      buildingId: 5962,
      name: "Test floor",
      level: 1,
      levelHeight: 12,
      mapId: "mapId",
    };
    const building = await situmSDK.cartography.patchFloor(1111, floorForm);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(building).toEqual(mockFloor);
    expect(configuration.method).toBe("put");
    expect(configuration.url).toBe(`/api/v1/floors/1111`);
    expect(configuration.data).toEqual({
      custom_fields: [{ key: "key", value: "value" }],
      building_id: 5962,
      name: "Test floor",
      level: 1,
      level_height: 12,
      map_id: "mapId",
    });

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete a floor", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      null,
    ]);
    axiosMock.mockClear();
    const floorId = 1111;

    // Execute
    await situmSDK.cartography.deleteFloor(floorId);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/floors/${floorId}`);
    expect(configuration.method).toBe("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
