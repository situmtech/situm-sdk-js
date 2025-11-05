/**
 * @jest-environment jsdom
 */

import { Viewer } from "../../src/viewer";
import type { ViewerOptions } from "../../src/viewer/types";

describe("Viewer", () => {
  let mockRtApi: any;
  let mockReportsApi: any;
  let mockDomElement: HTMLDivElement;
  let viewer: Viewer;

  beforeEach(() => {
    // Mock APIs
    mockRtApi = {
      getPositions: jest.fn(),
    };
    mockReportsApi = {
      getTrajectory: jest.fn(),
    };

    // Mock DOM element
    mockDomElement = document.createElement("div");
  });

  describe("constructor and iframe initialization", () => {
    it("should create an iframe with correct base attributes", () => {
      const options: ViewerOptions = {
        apiKey: "test-api-key",
        domElement: mockDomElement,
      };

      viewer = new Viewer(mockRtApi, mockReportsApi, options);

      // Access private iframe property using type assertion
      const iframe = (viewer as Viewer)._iframe;
      expect(iframe).toBeTruthy();
      expect(iframe.style.width).toBe("100%");
      expect(iframe.style.height).toBe("100%");
    });

    it("should set correct URL parameters with API key", () => {
      const options: ViewerOptions = {
        apiKey: "test-api-key",
        buildingID: 123,
        deviceID: "789",
        domElement: mockDomElement,
        fixedPoiID: 101112,
        floorID: 456,
      };

      viewer = new Viewer(mockRtApi, mockReportsApi, options);

      const iframe = (viewer as Viewer)._iframe;
      const url = new URL(iframe.src);

      expect(url.origin).toBe("https://maps.situm.com");
      expect(url.searchParams.get("key")).toBe("test-api-key");
      expect(url.searchParams.get("buildingid")).toBe("123");
      expect(url.searchParams.get("floorid")).toBe("456");
      expect(url.searchParams.get("deviceid")).toBe("789");
      expect(url.searchParams.get("fp")).toBe("101112");
    });

    it("should use profile URL when profile is provided", () => {
      const options: ViewerOptions = {
        apiKey: "test-api-key",
        domElement: mockDomElement,
        profile: "profileName",
      };

      viewer = new Viewer(mockRtApi, mockReportsApi, options);

      const iframe = (viewer as Viewer)._iframe;
      expect(iframe.src).toBe("https://maps.situm.com/profileName");
    });

    it("should not set API key in URL when using profile", () => {
      const options: ViewerOptions = {
        apiKey: "test-api-key",
        domElement: mockDomElement,
        profile: "profile",
      };

      viewer = new Viewer(mockRtApi, mockReportsApi, options);

      const iframe = (viewer as Viewer)._iframe;
      const url = new URL(iframe.src);
      expect(url.searchParams.has("key")).toBe(false);
    });

    it("should append iframe to provided domElement", () => {
      const options: ViewerOptions = {
        apiKey: "test-api-key",
        domElement: mockDomElement,
      };

      viewer = new Viewer(mockRtApi, mockReportsApi, options);

      const iframe = (viewer as Viewer)._iframe;
      expect(mockDomElement.contains(iframe)).toBeTruthy();
    });

    it("should throw error if domElement is not provided", () => {
      const options: ViewerOptions = {
        apiKey: "test-api-key",
      } as ViewerOptions;

      expect(() => {
        viewer = new Viewer(mockRtApi, mockReportsApi, options);
      }).toThrow();
    });
  });
});
