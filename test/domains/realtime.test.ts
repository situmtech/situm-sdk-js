import SitumSDK from "../../src";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.realtime", () => {
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
      buildingIds: [buildingId],
    });
    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(
      `/api/v1/realtime/positions?building_ids=${buildingId}`,
    );
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
    // Execute
    const realtimePositions = await situmSDK.realtime.getPositions();
    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(`/api/v1/realtime/positions`);
    expect(realtimePositions).toEqual(mockRealtime);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
