/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { expect } from "chai";

import SitumSDK from "../../src";
import { getAdapter as getAdapterPoi } from "../../src/adapters/PoiAdapter";
import { PoiCategoryForm, PoiCreateForm, PoiUpdateForm } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.cartography POI", () => {
  it("should retrieve all pois with no params", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({});

    // Arrange
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/pois`);
    expect(poiList).is.deep.equal([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve pois when asking by building ID", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiResponseMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({
      buildingId: mockPoi.buildingId,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${mockPoi.buildingId}/pois`
    );
    expect(configuration.params).to.be.equals(``);
    expect(poiList).is.deep.equal([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve pois when asking by building ID and type outdoor", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiResponseMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({
      buildingId: mockPoi.buildingId,
      type: "outdoor",
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${mockPoi.buildingId}/pois`
    );
    expect(configuration.params).to.be.equals(`type=outdoor`);
    expect(poiList).is.deep.equal([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve pois when asking by building ID and type indoor", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiResponseMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({
      buildingId: mockPoi.buildingId,
      type: "indoor",
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/buildings/${mockPoi.buildingId}/pois`
    );
    expect(configuration.params).to.be.equals(`type=indoor`);
    expect(poiList).is.deep.equal([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve all pois with view=compact", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth"), compact: true });
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiMock1")],
    ]);

    // Execute
    const poiList = await situmSDK.cartography.getPois({});

    // Arrange
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/pois`);
    expect(configuration.params).to.be.equals(`view=compact`);
    expect(poiList).is.deep.equal([getAdapterPoi(mockPoi)]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should create a poi", async () => {
    // Arrange
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("poiResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });

    const poiForm: PoiCreateForm = {
      buildingId: 5962,
      name: "Test Fence",
      info: "info",
      categoryId: 1234,
      customFields: [{ key: "key", value: "value" }],
      floorId: 12917,
      location: {
        lat: 25.2289190880612,
        lng: 55.4029336723872,
      },
    };
    axiosMock.mockClear();

    // Execute
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
        georeferences: {
          lat: 25.2289190880612,
          lng: 55.4029336723872,
        },
      },
    });

    // Assert
    expect(configuration.method).to.be.deep.equals("post");
    expect(configuration.url).to.be.equals("/api/v1/pois");
    expect(poi).is.deep.equal(getAdapterPoi(mockPoi));
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should update a poi", async () => {
    // Arrange
    const mockPoi = getMockData("poiMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("poiResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const poiForm: PoiUpdateForm = {
      name: "Test Fence",
      info: "info",
      categoryId: 1234,
      customFields: [{ key: "key", value: "value" }],
      floorId: 12917,
      location: {
        lat: 25.2289190880612,
        lng: 55.4029336723872,
      },
    };

    // Execute
    const poi = await situmSDK.cartography.patchPoi(1234, poiForm);

    // Assert
    expect(poi).is.deep.equal(getAdapterPoi(mockPoi));
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).to.be.equals("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete a poi", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    const id = 1234;

    // Execute
    await situmSDK.cartography.deletePoi(id);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/pois/${id}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});

describe("SitumSDK.cartography POI category", () => {
  it("should retrieve poi category", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockPoiCategory = getMockData("poiCategoryMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      [getMockData("poiCategoryResponseMock1")],
    ]);

    // Execute
    const poiCategories = await situmSDK.cartography.getPoiCategories();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/poi_categories`);
    expect(poiCategories).is.deep.equal([mockPoiCategory]);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should create a poi category", async () => {
    // Arrange
    const mockPoiCategory = getMockData("poiCategoryMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("poiCategoryResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });

    // Execute
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

    // Assert
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

  it("should update a Poi Category", async () => {
    // Arrange
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

    // Execute
    const poiCategory = await situmSDK.cartography.patchPoiCategory(
      1111,
      poiCategoryForm
    );

    // Assert
    expect(poiCategory).is.deep.equal(mockPoiCategory);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).to.be.equals("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete Poi Category", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    const id = 1111;

    // Execute
    await situmSDK.cartography.deletePoiCategory(id);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/poi_categories/${id}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
