/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { expect } from "chai";

import SitumSDK from "../../src";
import { GeofenceForm } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.cartography Geofence", () => {
  it("should retrieve a geofence by its id", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockGeofence = getMockData("geofenceMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("geofenceResponseMock1"),
    ]);

    // Execute
    const geofence = await situmSDK.cartography.getGeofenceById(
      mockGeofence.id
    );

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/geofences/${mockGeofence.id}`
    );
    expect(geofence).is.deep.equal(mockGeofence);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should search a geofence by name", async () => {
    // Arrange
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

    // Execute
    const geofenceList = await situmSDK.cartography.getGeofences({
      name: "test",
    });

    // Assert
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

  it("should create a geofence", async () => {
    // Arrange
    const mockGeofence = getMockData("geofenceMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("geofenceResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });

    // Execute
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

    // Assert
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

  it("should update a geofence", async () => {
    // Arrange
    const mockGeofence = getMockData("geofenceMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("geofenceResponseMock1"),
    ]);
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });

    // Execute
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

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(geofence).is.deep.equal(mockGeofence);
    expect(configuration.method).to.be.equals("put");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should delete a geofence", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);

    // Execute
    const uuid = "a41bddf3-db6b-4b8b-ab78-4caa22f9efc4";
    await situmSDK.cartography.deleteGeofence(uuid);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/geofences/${uuid}`);
    expect(configuration.method).to.be.equals("delete");
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
