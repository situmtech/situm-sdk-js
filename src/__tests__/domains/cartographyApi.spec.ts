/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { expect } from "chai";

import SitumSDK from "../../index";
import {
  BuildingForm,
  FloorForm,
  GeofenceForm,
  Paths,
  PoiCategoryForm,
  PoisCreateForm,
  PoisUpdateForm,
} from "../../types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.cartography Building", () => {
  test("should retrieve a building by id", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockBuilding = getMockData("buildingMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("buildingResponseMock1"),
    ]);

    const building = await situmSDK.cartography.getBuildingById(
      mockBuilding.id
    );

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${mockBuilding.id}`
    );
    expect(building).is.deep.equal(mockBuilding);

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should retrieve all buildings", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockBuildingList = [getMockData("buildingResponseMock1")];
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      mockBuildingList,
    ]);

    const buildingList = await situmSDK.cartography.getBuildings();

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).to.be.equals("");
    expect(configuration.url).to.be.equals("/api/v1/buildings");
    expect(buildingList).is.deep.equal([getMockData("buildingMock1")]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should create a building", async () => {
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
    const building = await situmSDK.cartography.createBuilding(buildingForm);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).to.be.deep.equals({
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
    expect(configuration.method).to.be.deep.equals("post");
    expect(configuration.url).to.be.equals("/api/v1/buildings");
    expect(building).is.deep.equal(mockBuilding);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should update a building", async () => {
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
    const building = await situmSDK.cartography.patchBuilding(
      1111,
      buildingForm
    );
    expect(building).is.deep.equal(mockBuilding);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).to.be.equals("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should delete a building", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    axiosMock.mockClear();
    const buildId = 1111;
    await situmSDK.cartography.deleteBuilding(buildId);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/buildings/${buildId}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});

describe("SitumSDK.cartography Floor", () => {
  test("should retrieve a floor by id", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockFloor = getMockData("floorMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("floorResponseMock1"),
    ]);
    const floor = await situmSDK.cartography.getFloorById(mockFloor.id);

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/floors/${mockFloor.id}`);
    expect(floor).is.deep.equal(mockFloor);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should retrieve all floors by its building id", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockFloorList = [getMockData("floorResponseMock1")];
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      mockFloorList,
    ]);

    const floorList = await situmSDK.cartography.searchFloor(
      mockFloorList[0].buildingId
    );

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).to.be.equals("");
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${mockFloorList[0].buildingId}/floors`
    );
    expect(floorList).is.deep.equal([getMockData("floorMock1")]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should create a floor", async () => {
    const mockFloor = getMockData("floorMock1");
    let axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("floorResponseMock1"),
    ]);
    axiosMock.mockClear();
    axiosMock = mockAxiosRequest([
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
    const floor = await situmSDK.cartography.createFloor(floorForm);
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

  test("should update a floor", async () => {
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
    const building = await situmSDK.cartography.patchFloor(1111, floorForm);
    expect(building).is.deep.equal(mockFloor);
    const configuration = axiosMock.mock.calls[1][0];
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

  test("should delete a floor", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    axiosMock.mockClear();
    const floorId = 1111;
    await situmSDK.cartography.deleteFloor(floorId);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/floors/${floorId}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});

describe("SitumSDK.cartography Geofence", () => {
  test("should retrieve a geofence by its id", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockGeofence = getMockData("geofenceMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("geofenceResponseMock1"),
    ]);
    const geofence = await situmSDK.cartography.getGeofenceById(
      mockGeofence.id
    );

    // Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/geofences/${mockGeofence.id}`
    );
    expect(geofence).is.deep.equal(mockGeofence);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should search a geofence by name", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockGeofenceList = {
      data: [getMockData("geofenceResponseMock1")],
      metadata: {
        first: true,
        last: true,
        totalPages: 1,
        totalElements: 1,
        numberOfElements: 1,
        size: 15,
        number: 1,
      },
    };
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      mockGeofenceList,
    ]);

    const geofenceList = await situmSDK.cartography.searchGeofences({
      name: "test",
    });

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).to.be.equals(
      "name=test&organization_id=0a5d0ff4-cd76-4e08-bcdc-e36e0182fd78"
    );
    expect(configuration.url).to.be.equals("/api/v1/geofences");
    expect(geofenceList).is.deep.equal({
      ...mockGeofenceList,
      data: [getMockData("geofenceMock1")],
    });
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should create a geofence", async () => {
    const mockGeofence = getMockData("geofenceMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("geofenceResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const geofenceForm: GeofenceForm = {
      customFields: [{ key: "key", value: "value" }],
      buildingId: "5962",
      code: "code",
      floorId: 11918,
      geometric: [[42.872408722880905, -8.563032075762749]],
      info: "info",
      name: "Test Fence",
      organizationId: "0a5d0ff4-cd76-4e08-bcdc-e36e0182fd78",
      type: "POLYGON",
    };
    const geofence = await situmSDK.cartography.createGeofence(geofenceForm);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).to.be.deep.equals({
      custom_fields: [{ key: "key", value: "value" }],
      building_id: "5962",
      code: "code",
      floor_id: 11918,
      geometric: [[42.872408722880905, -8.563032075762749]],
      info: "info",
      name: "Test Fence",
      organization_id: "0a5d0ff4-cd76-4e08-bcdc-e36e0182fd78",
      type: "POLYGON",
    });
    expect(configuration.method).to.be.deep.equals("post");
    expect(configuration.url).to.be.equals("/api/v1/geofences");
    expect(geofence).is.deep.equal(mockGeofence);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should update a geofence", async () => {
    const mockGeofence = getMockData("geofenceMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("geofenceResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const geofenceForm: GeofenceForm = {
      customFields: [{ key: "key", value: "value" }],
      buildingId: "5962",
      code: "code",
      floorId: 11918,
      geometric: [[42.872408722880905, -8.563032075762749]],
      info: "info",
      name: "Test Fence",
      organizationId: "0a5d0ff4-cd76-4e08-bcdc-e36e0182fd78",
      type: "POLYGON",
    };
    const geofence = await situmSDK.cartography.patchGeofence(
      "16d0ab76-d23a-486d-99b6-08d8e1a995a5",
      geofenceForm
    );
    expect(geofence).is.deep.equal(mockGeofence);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).to.be.equals("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should delete a geofence", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    const uuid = "a41bddf3-db6b-4b8b-ab78-4caa22f9efc4";
    await situmSDK.cartography.deleteGeofence(uuid);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/geofences/${uuid}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
describe("SitumSDK.cartography POI category", () => {
  test("should retrieve poi category", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoiCategory = getMockData("poiCategoryMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiCategoryResponseMock1")],
    ]);
    const poiCategories = await situmSDK.cartography.getPoiCategories();

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/poi_categories`);
    expect(poiCategories).is.deep.equal([mockPoiCategory]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should create a poi category", async () => {
    const mockPoiCategory = getMockData("poiCategoryMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("poiCategoryResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const poiCategoryForm: PoiCategoryForm = {
      nameEn: "Kitchen",
      nameEs: "Cocina",
      code: "kitchen_situm",
      icon: "iconId",
      selectedIcon: "selectedIcon",
    };
    const poiCategory = await situmSDK.cartography.createPoiCategory(
      poiCategoryForm
    );
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).to.be.deep.equals({
      name_en: "Kitchen",
      name_es: "Cocina",
      code: "kitchen_situm",
      icon: "iconId",
      selected_icon: "selectedIcon",
    });
    expect(configuration.method).to.be.deep.equals("post");
    expect(configuration.url).to.be.equals("/api/v1/poi_categories");
    expect(poiCategory).is.deep.equal(mockPoiCategory);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should update a Poi Category", async () => {
    const mockPoiCategory = getMockData("poiCategoryMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("poiCategoryResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const poiCategoryForm: PoiCategoryForm = {
      nameEn: "Kitchen2",
      nameEs: "Cocina2",
      code: "kitchen_situm2",
      icon: "iconId2",
      selectedIcon: "selectedIcon2",
    };
    const poiCategory = await situmSDK.cartography.patchPoiCategory(
      1111,
      poiCategoryForm
    );
    expect(poiCategory).is.deep.equal(mockPoiCategory);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).to.be.equals("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should delete Poi Category", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    const id = 1111;
    await situmSDK.cartography.deletePoiCategory(id);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/poi_categories/${id}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});

describe("SitumSDK.cartography POI", () => {
  test("should retrieve indoor pois by building", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiResponseMock1")],
    ]);
    const poiList = await situmSDK.cartography.getInsidePoisByBuildingId(
      mockPoi.id
    );

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${mockPoi.id}/pois`
    );
    expect(poiList).is.deep.equal([mockPoi]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should retrieve outdoor pois by its building id", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiResponseMock1")],
    ]);
    const poiList = await situmSDK.cartography.getOutsidePoisByBuildingId(
      mockPoi.id
    );

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${mockPoi.id}/exterior_pois`
    );
    expect(poiList).is.deep.equal([mockPoi]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should retrieve all pois", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiResponseMock1")],
    ]);
    const poiList = await situmSDK.cartography.getPois();

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/pois`);
    expect(poiList).is.deep.equal([mockPoi]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should create a poi", async () => {
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("poiResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });

    const poiForm: PoisCreateForm = {
      buildingId: 5962,
      name: "Test Fence",
      info: "info",
      categoryId: 1234,
      customFields: [{ key: "key", value: "value" }],
      position: {
        floorId: 12917,
        x: 264.019705190557,
        y: 67.5138261169767,
        lat: 25.2289190880612,
        lng: 55.4029336723872,
        radius: 5,
        georeferences: {
          lat: 25.2289190880612,
          lng: 55.4029336723872,
        },
        cartesians: {
          x: 264.019705190557,
          y: 67.5138261169767,
        },
      },
    };
    axiosMock.mockClear();
    const poi = await situmSDK.cartography.createPoi(poiForm);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).to.be.deep.equals({
      building_id: 5962,
      name: "Test Fence",
      info: "info",
      category_id: 1234,
      custom_fields: [{ key: "key", value: "value" }],
      position: {
        floor_id: 12917,
        x: 264.019705190557,
        y: 67.5138261169767,
        lat: 25.2289190880612,
        lng: 55.4029336723872,
        radius: 5,
        georeferences: {
          lat: 25.2289190880612,
          lng: 55.4029336723872,
        },
        cartesians: {
          x: 264.019705190557,
          y: 67.5138261169767,
        },
      },
    });
    expect(configuration.method).to.be.deep.equals("post");
    expect(configuration.url).to.be.equals("/api/v1/pois");
    expect(poi).is.deep.equal(mockPoi);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should update a poi", async () => {
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("poiResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const poiForm: PoisUpdateForm = {
      name: "Test Fence",
      info: "info",
      categoryId: 1234,
      customFields: [{ key: "key", value: "value" }],
      position: {
        floorId: 12917,
        x: 264.019705190557,
        y: 67.5138261169767,
        lat: 25.2289190880612,
        lng: 55.4029336723872,
        radius: 5,
        georeferences: {
          lat: 25.2289190880612,
          lng: 55.4029336723872,
        },
        cartesians: {
          x: 264.019705190557,
          y: 67.5138261169767,
        },
      },
    };
    const poi = await situmSDK.cartography.patchPoi(1234, poiForm);
    expect(poi).is.deep.equal(mockPoi);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).to.be.equals("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should delete a poi", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    const id = 1234;
    await situmSDK.cartography.deletePoi(id);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/pois/${id}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});

describe("SitumSDK.cartography Path", () => {
  test("should retrieve the path by building", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPath = getMockData("pathMock1");
    const buildingId = 1111;
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("pathResponseMock1"),
    ]);
    const path = await situmSDK.cartography.getPathsByBuildingId(buildingId);

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${buildingId}/paths`
    );
    expect(path).is.deep.equal(mockPath);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should retrieve all the paths", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPath = getMockData("pathMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("pathResponseMock1")],
    ]);
    const pathList = await situmSDK.cartography.getPaths();

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/paths`);
    expect(pathList).is.deep.equal([mockPath]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should retrieve all the paths", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPath = getMockData("pathMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("pathResponseMock1")],
    ]);
    const pathList = await situmSDK.cartography.getPaths();

    //Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/paths`);
    expect(pathList).is.deep.equal([mockPath]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should update/create a path", async () => {
    const mockPath = getMockData("pathMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("pathResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });

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
        },
        {
          source: 2,
          target: 3,
          origin: "both",
          tags: [],
        },
      ],
    };
    axiosMock.mockClear();
    const path = await situmSDK.cartography.updatePath(buildingId, pathForm);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).to.be.deep.equals({
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
        },
        {
          source: 2,
          target: 3,
          origin: "both",
          tags: [],
        },
      ],
    });
    expect(configuration.method).to.be.equals("put");
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${buildingId}/paths`
    );
    expect(path).is.deep.equal(mockPath);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
