/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SitumSDK from "../../src";
import { BuildingForm } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.cartography Building", () => {
  it("should retrieve a building by id", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockBuilding = getMockData("buildingMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("buildingResponseMock1"),
    ]);

    // Execute
    const building = await situmSDK.cartography.getBuildingById(
      mockBuilding.id,
    );

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toEqual(`/api/v1/buildings/${mockBuilding.id}`);
    expect(building).toEqual(mockBuilding);

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all buildings", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockBuildingList = [getMockData("buildingResponseMock1")];
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      mockBuildingList,
    ]);

    // Execute
    const buildingList = await situmSDK.cartography.getBuildings();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).toEqual({});
    expect(configuration.url).toBe("/api/v1/buildings");
    expect(buildingList).toEqual([getMockData("buildingMock1")]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all buildings with view=compact", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth"), compact: true });
    const mockBuildingList = [getMockData("buildingResponseMock1")];
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      mockBuildingList,
    ]);

    // Execute
    const buildingList = await situmSDK.cartography.getBuildings();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).toEqual({ view: "compact" });
    expect(configuration.url).toBe("/api/v1/buildings");
    expect(buildingList).toEqual([getMockData("buildingMock1")]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
  it("should create a building", async () => {
    // Arrange
    const mockBuilding = getMockData("buildingMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("buildingResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const buildingForm: BuildingForm = {
      location: { lat: 42.8949622513438, lng: -8.49530134740083 },
      dimensions: {
        width: 282,
        length: 17.8,
      },
      description: "description",
      customFields: [{ key: "key", value: "value" }],
      rotation: 11.22,
      info: "info",
      name: "Test Fence",
      pictureId: "pictureId",
    };

    // Execute
    const building = await situmSDK.cartography.createBuilding(buildingForm);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).toEqual({
      location: { lat: 42.8949622513438, lng: -8.49530134740083 },
      dimensions: {
        width: 282,
        length: 17.8,
      },
      description: "description",
      custom_fields: [{ key: "key", value: "value" }],
      rotation: 11.22,
      info: "info",
      name: "Test Fence",
      picture_id: "pictureId",
    });
    expect(configuration.method).toBe("post");
    expect(configuration.url).toBe("/api/v1/buildings");
    expect(building).toEqual(mockBuilding);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should update a building", async () => {
    // Arrange
    const mockBuilding = getMockData("buildingMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("buildingResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const buildingForm: BuildingForm = {
      location: { lat: 42.8949622513438, lng: -8.49530134740083 },
      dimensions: {
        width: 282,
        length: 17.8,
      },
      description: "description",
      customFields: [{ key: "key", value: "value" }],
      rotation: 11.22,
      info: "info",
      name: "Test Fence",
      pictureId: "pictureId",
    };

    // Execute
    const building = await situmSDK.cartography.patchBuilding(
      1111,
      buildingForm,
    );

    // Assert
    expect(building).toEqual(mockBuilding);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).toBe("put");
    expect(configuration.url).toBe(`/api/v1/buildings/1111`);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete a building", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    axiosMock.mockClear();
    const buildId = 1111;

    // Execute
    await situmSDK.cartography.deleteBuilding(buildId);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/buildings/${buildId}`);
    expect(configuration.method).toBe("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
