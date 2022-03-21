/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { expect } from "chai";

import SitumSDK from "../../src";
import { FloorForm } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.cartography Floor", () => {
  it("should retrieve a floor by id", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockFloor = getMockData("floorMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("floorResponseMock1"),
    ]);
    const floor = await situmSDK.cartography.getFloorById(mockFloor.id);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/floors/${mockFloor.id}`);
    expect(floor).is.deep.equal(mockFloor);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all floors", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockFloorList = [getMockData("floorResponseMock1")];
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      mockFloorList,
    ]);

    // Execute
    const floorList = await situmSDK.cartography.getFloors();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).to.be.equals("");
    expect(configuration.url).to.be.equals(`/api/v1/floors`);
    expect(floorList).is.deep.equal([getMockData("floorMock1")]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all floors by its building id", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockFloorList = [getMockData("floorResponseMock1")];
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      mockFloorList,
    ]);

    // Execute
    const floorList = await situmSDK.cartography.getFloors({
      buildingId: mockFloorList[0].building_id,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).to.be.equals("");
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${mockFloorList[0].building_id}/floors`
    );
    expect(floorList).is.deep.equal([getMockData("floorMock1")]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should create a floor", async () => {
    // Arrange
    const mockFloor = getMockData("floorMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("floorResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
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
    expect(configuration.data).to.be.deep.equals({
      custom_fields: [{ key: "key", value: "value" }],
      building_id: 5962,
      name: "Test floor",
      level: 1,
      level_height: 12,
      map_id: "mapId",
    });
    expect(configuration.method).to.be.deep.equals("post");
    expect(configuration.url).to.be.equals("/api/v1/floors");
    expect(floor).is.deep.equal(mockFloor);

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should update a floor", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockFloor = getMockData("floorMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
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
    expect(building).is.deep.equal(mockFloor);
    expect(configuration.url).to.be.equals(`/api/v1/floors/1111`);
    expect(configuration.data).to.be.deep.equals({
      custom_fields: [{ key: "key", value: "value" }],
      building_id: 5962,
      name: "Test floor",
      level: 1,
      level_height: 12,
      map_id: "mapId",
    });

    expect(configuration.method).to.be.equals("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete a floor", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    axiosMock.mockClear();
    const floorId = 1111;

    // Execute
    await situmSDK.cartography.deleteFloor(floorId);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/floors/${floorId}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
