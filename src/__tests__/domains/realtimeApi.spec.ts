import { expect } from "chai";

import SitumSDK from "../../index";
import { UUID } from "../../types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.realtime", () => {
  test("should retrieve realtime positions by organization id", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockRealtime = getMockData("realtimeMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("realtimeResponseMock1"),
    ]);
    const organizationId: UUID = "1a5d0ff4-cd76-4e08-bcdc-e36e0182fd78";
    const realtimePositions = await situmSDK.realtime.getUsersPositions({
      organizationId,
    });

    // Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/realtime/organization/${organizationId}`
    );
    expect(realtimePositions).is.deep.equal(mockRealtime);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should retrieve realtime positions by building id", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockRealtime = getMockData("realtimeMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("realtimeResponseMock1"),
    ]);
    const buildingId = 1111;
    const realtimePositions = await situmSDK.realtime.getUsersPositions({
      buildingId,
    });

    // Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/realtime/building/${buildingId}`
    );
    expect(realtimePositions).is.deep.equal(mockRealtime);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  test("should retrieve realtime positions by organization id but without pass organization", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockRealtime = getMockData("realtimeMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("realtimeResponseMock1"),
    ]);
    const organizationId = "0a5d0ff4-cd76-4e08-bcdc-e36e0182fd78";
    const realtimePositions = await situmSDK.realtime.getUsersPositions();

    // Validate test
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(
      `/api/v1/realtime/organization/${organizationId}`
    );
    expect(realtimePositions).is.deep.equal(mockRealtime);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
