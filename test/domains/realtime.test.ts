import SitumSDK from "../../src";
import { UUID } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.realtime", () => {
  it("should retrieve realtime positions by organization id", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockRealtime = getMockData("realtimeMock1");
    // Arrange
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("realtimeResponseMock1"),
    ]);
    const organizationId: UUID = "fakefakefa-fake-fake-fake-fakefakefake";

    // Execute
    const realtimePositions = await situmSDK.realtime.getPositions({
      organizationId,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(
      `/api/v1/realtime/organization/${organizationId}`,
    );
    expect(realtimePositions).toEqual(mockRealtime);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve realtime positions by building id", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockRealtime = getMockData("realtimeMock1");
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("realtimeResponseMock1"),
    ]);
    const buildingId = 1111;

    // Execute
    const realtimePositions = await situmSDK.realtime.getPositions({
      buildingId,
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/realtime/building/${buildingId}`);
    expect(realtimePositions).toEqual(mockRealtime);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve realtime positions by organization id but without pass organization", async () => {
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const mockRealtime = getMockData("realtimeMock1");

    // Arrange
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("realtimeResponseMock1"),
    ]);
    const organizationId = "fakefakefa-fake-fake-fake-fakefakefake";

    // Execute
    const realtimePositions = await situmSDK.realtime.getPositions();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(
      `/api/v1/realtime/organization/${organizationId}`,
    );
    expect(realtimePositions).toEqual(mockRealtime);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
