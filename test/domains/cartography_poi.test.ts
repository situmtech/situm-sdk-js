/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { describe, expect } from "@jest/globals";

import SitumSDK from "../../src";
import { getAdapter as getAdapterPoi } from "../../src/adapters/PoiAdapter";
import type {
  PoiCategoryForm,
  PoiCreateForm,
  PoiUpdateForm,
} from "../../src/types";
import { keysToSnake } from "./../../src/utils/snakeCaseCamelCaseUtils";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.cartography POI", () => {
  it("should retrieve all pois with no params", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPoi = getMockData("poiMock1");

    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      [getMockData("poiMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({});

    // Arrange
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/pois`);
    expect(poiList).toEqual([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve pois when asking by building ID", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      [getMockData("poiResponseMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({
      buildingId: mockPoi.buildingId,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(
      `/api/v1/buildings/${mockPoi.buildingId}/pois`,
    );
    expect(configuration.params).toEqual({});
    expect(poiList).toEqual([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve pois when asking by building ID and type outdoor", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      [getMockData("poiResponseMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({
      buildingId: mockPoi.buildingId,
      type: "outdoor",
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toEqual(
      `/api/v1/buildings/${mockPoi.buildingId}/pois`,
    );
    expect(configuration.params).toEqual({ type: "outdoor" });
    expect(poiList).toEqual([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve pois when asking by building ID and type indoor", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      [getMockData("poiResponseMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({
      buildingId: mockPoi.buildingId,
      type: "indoor",
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(
      `/api/v1/buildings/${mockPoi.buildingId}/pois`,
    );
    expect(configuration.params).toEqual({ type: "indoor" });
    expect(poiList).toEqual([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all pois with view=compact", async () => {
    // Arrange
    const situmSDK = new SitumSDK({
      auth: getMockData("jwtMock"),
      compact: true,
    });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      [mockPoi],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({});

    // Arrange
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/pois`);
    expect(configuration.params).toEqual({ view: "compact" });
    expect(poiList).toEqual([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should create a poi", async () => {
    // Arrange
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("poiResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });

    const poiForm: PoiCreateForm = {
      buildingId: 5962,
      categoryId: 1234,
      customFields: [{ key: "key", value: "value" }],
      info: "info",
      name: "Test Fence",
      position: {
        floorId: 12917,
        georeferences: {
          lat: 25.2289190880612,
          lng: 55.4029336723872,
        },
      },
    };
    axiosMock.mockClear();

    // Execute
    const poi = await situmSDK.cartography.createPoi(poiForm);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).toEqual({
      building_id: 5962,
      category_id: 1234,
      custom_fields: [{ key: "key", value: "value" }],
      info: "info",
      name: "Test Fence",
      position: {
        floor_id: 12917,
        georeferences: {
          lat: 25.2289190880612,
          lng: 55.4029336723872,
        },
      },
    });

    // Assert
    expect(configuration.method).toBe("post");
    expect(configuration.url).toBe("/api/v1/pois");
    expect(poi).toEqual(getAdapterPoi(mockPoi));
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should update a poi", async () => {
    // Arrange
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("poiResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const poiForm: PoiUpdateForm = {
      buildingId: 6349,
      categoryId: 1234,
      customFields: [{ key: "key", value: "value" }],
      info: "info",
      name: "Test Fence",
      position: {
        floorId: 12917,
        georeferences: {
          lat: 25.2289190880612,
          lng: 55.4029336723872,
        },
      },
    };

    // Execute
    const poi = await situmSDK.cartography.patchPoi(1234, poiForm);

    // Assert
    expect(poi).toEqual(getAdapterPoi(mockPoi));
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).toBe("put");
    expect(configuration.data).toEqual(keysToSnake(poiForm));

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete a poi", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      null,
    ]);
    const id = 1234;

    // Execute
    await situmSDK.cartography.deletePoi(id);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/pois/${id}`);
    expect(configuration.method).toBe("delete");

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});

describe("SitumSDK.cartography POI category", () => {
  it("should retrieve poi category", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockPoiCategory = getMockData("poiCategoryMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      [getMockData("poiCategoryResponseMock1")],
    ]);

    // Execute
    const poiCategories = await situmSDK.cartography.getPoiCategories();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/poi_categories`);
    expect(poiCategories).toEqual([mockPoiCategory]);

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should create a poi category", async () => {
    // Arrange
    const mockPoiCategory = getMockData("poiCategoryMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("poiCategoryResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });

    // Execute
    const poiCategoryForm: PoiCategoryForm = {
      code: "kitchen_situm",
      icon: "iconId",
      nameEn: "Kitchen",
      nameEs: "Cocina",
      selectedIcon: "selectedIcon",
    };
    const poiCategory =
      await situmSDK.cartography.createPoiCategory(poiCategoryForm);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).toEqual({
      code: "kitchen_situm",
      icon: "iconId",
      name_en: "Kitchen",
      name_es: "Cocina",
      selected_icon: "selectedIcon",
    });
    expect(configuration.method).toBe("post");
    expect(configuration.url).toBe("/api/v1/poi_categories");
    expect(poiCategory).toEqual(mockPoiCategory);

    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should update a Poi Category", async () => {
    // Arrange
    const mockPoiCategory = getMockData("poiCategoryMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("poiCategoryResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const poiCategoryForm: PoiCategoryForm = {
      code: "kitchen_situm2",
      icon: "iconId2",
      nameEn: "Kitchen2",
      nameEs: "Cocina2",
      selectedIcon: "selectedIcon2",
    };

    // Execute
    const poiCategory = await situmSDK.cartography.patchPoiCategory(
      1111,
      poiCategoryForm,
    );

    // Assert
    expect(poiCategory).toEqual(mockPoiCategory);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).toBe("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete Poi Category", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      null,
    ]);
    const id = 1111;

    // Execute
    await situmSDK.cartography.deletePoiCategory(id);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/poi_categories/${id}`);
    expect(configuration.method).toBe("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
