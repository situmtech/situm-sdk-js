import SitumSDK, { type UUID } from "../../src";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.reports", () => {
  const buildingId = 1234;
  const userId: UUID = "user-uuid-123";
  const fromDate = new Date("2024-01-01T00:00:00.000Z");
  const toDate = new Date("2024-01-02T00:00:00.000Z");
  const mockTrajectory = getMockData("trajectoryReportMock1");
  const mockTrajectoryResponse = getMockData("trajectoryReportResponseMock1");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve trajectory report with required params", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      mockTrajectoryResponse,
    ]);
    const params = { buildingId, fromDate, toDate };

    // Execute
    const result = await situmSDK.reports.getTrajectory(params);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toContain("/api/v1/reports/user_positions.json");
    expect(configuration.url).toContain(
      `from_date=${encodeURIComponent(fromDate.toISOString())}`,
    );
    expect(configuration.url).toContain(
      `to_date=${encodeURIComponent(toDate.toISOString())}`,
    );
    expect(configuration.url).toContain(`building_id=${buildingId}`);
    expect(result).toEqual(mockTrajectory.data);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should retrieve trajectory report with userId", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      mockTrajectoryResponse,
    ]);
    const params = {
      buildingId,
      fromDate,
      toDate,
      userId,
    };

    // Execute
    const result = await situmSDK.reports.getTrajectory(params);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).toContain(`user_id=${userId}`);
    expect(configuration.url).toContain(`building_id=${buildingId}`);
    expect(result).toEqual(mockTrajectory.data);
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });

  it("should throw or handle missing required params", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("jwtMock") });
    const axiosMock = mockAxiosRequest([
      { access_token: getMockData("jwtMock") },
      mockTrajectoryResponse,
    ]);
    const params = { buildingId, toDate }; // missing fromDate

    // Execute & Assert
    await expect(
      situmSDK.reports.getTrajectory(
        params as {
          fromDate: Date; // typed but missing
          toDate: Date;
          buildingId: number;
        },
      ),
    ).rejects.toThrow();
    axiosMock.mockClear();
    axiosMock.mockRestore();
  });
});
