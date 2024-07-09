import SitumSDK from "../../src";
import { UUID } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.realtime", () => {
  let situmSDK = null;
  let mockRealtime = null;
  let axiosMock = null;

  beforeEach(() => {
    situmSDK = new SitumSDK({ auth: getMockData("auth") });
    mockRealtime = getMockData("realtimeMock1");
  });

  afterEach(() => {
    situmSDK = null;
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve realtime positions by organization id", async () => {
    // Arrange
    axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("realtimeResponseMock1"),
    ]);
    const organizationId: UUID = "1a5d0ff4-cd76-4e08-bcdc-e36e0182fd78";

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
  });

  it("should retrieve realtime positions by building id", async () => {
    // Arrange
    axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
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
  });

  it("should retrieve realtime positions by organization id but without pass organization", async () => {
    // Arrange
    axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      getMockData("realtimeResponseMock1"),
    ]);
    const organizationId = "0a5d0ff4-cd76-4e08-bcdc-e36e0182fd78";

    // Execute
    const realtimePositions = await situmSDK.realtime.getPositions();

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toBe(
      `/api/v1/realtime/organization/${organizationId}`,
    );
    expect(realtimePositions).toEqual(mockRealtime);
  });
});
