/** biome-ignore-all lint/suspicious/noExplicitAny: Can use `any` keyword in tests */
import ApiBase from "../src/apiBase";

describe("apiBase", () => {
  it("should call request when calling get", async () => {
    // Arrange
    const spy = jest.spyOn(ApiBase.prototype as any, "request");
    spy.mockImplementation(async () => {
      return { fakeResponse: "" };
    });
    const apiBase = new ApiBase({
      auth: {
        apiKey: "notvalid",
      },
    });

    // Execute
    const response = await apiBase.get({ url: "/api/v1/whatever" });

    // Assert
    const configuration = spy.mock.calls[0] as any;
    expect(configuration[0]).toBe("get");
    expect(configuration[1].url).toBe("/api/v1/whatever");
    expect(response).toStrictEqual({ fakeResponse: "" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("should call request when calling post", async () => {
    // Arrange
    const spy = jest.spyOn(ApiBase.prototype as any, "request");
    spy.mockImplementation(async () => {
      return { fakeResponse: "" };
    });
    const apiBase = new ApiBase({
      auth: {
        apiKey: "notvalid",
      },
    });

    // Execute
    const response = await apiBase.post({ url: "/api/v1/whatever" });

    // Assert
    const configuration = spy.mock.calls[0] as any;
    expect(configuration[0]).toBe("post");
    expect(configuration[1].url).toBe("/api/v1/whatever");
    expect(response).toStrictEqual({ fakeResponse: "" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("should call request when calling delete", async () => {
    // Arrange
    const spy = jest.spyOn(ApiBase.prototype as any, "request");
    spy.mockImplementation(async () => {
      return { fakeResponse: "" };
    });
    const apiBase = new ApiBase({
      auth: {
        apiKey: "notvalid",
      },
    });

    // Execute
    const response = await apiBase.delete({ url: "/api/v1/whatever" });

    // Assert
    const configuration = spy.mock.calls[0] as any;
    expect(configuration[0]).toBe("delete");
    expect(configuration[1].url).toBe("/api/v1/whatever");
    expect(response).toStrictEqual({ fakeResponse: "" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("should call request when calling put", async () => {
    // Arrange
    const spy = jest.spyOn(ApiBase.prototype as any, "request");
    spy.mockImplementation(async () => {
      return { fakeResponse: "" };
    });
    const apiBase = new ApiBase({
      auth: {
        apiKey: "notvalid",
      },
    });

    // Execute
    const response = await apiBase.put({ url: "/api/v1/whatever" });

    // Assert
    const configuration = spy.mock.calls[0] as any;
    expect(configuration[0]).toBe("put");
    expect(configuration[1].url).toBe("/api/v1/whatever");
    expect(response).toStrictEqual({ fakeResponse: "" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
  it("should call request when calling patch", async () => {
    // Arrange
    const spy = jest.spyOn(ApiBase.prototype as any, "request");
    spy.mockImplementation(async () => {
      return { fakeResponse: "" };
    });
    const apiBase = new ApiBase({
      auth: {
        apiKey: "notvalid",
      },
    });

    // Execute
    const response = await apiBase.patch({ url: "/api/v1/whatever" });

    // Assert
    const configuration = spy.mock.calls[0] as any;
    expect(configuration[0]).toBe("patch");
    expect(configuration[1].url).toBe("/api/v1/whatever");
    expect(response).toStrictEqual({ fakeResponse: "" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("should call request when calling get with custom default timeout", async () => {
    // Arrange
    const spy = jest.spyOn(ApiBase.prototype as any, "request");
    spy.mockImplementation(async () => {
      return { fakeResponse: "" };
    });

    // Execute
    const apiBase = new ApiBase({
      auth: {
        apiKey: "notvalid",
      },
      timeouts: {
        default: 100, // ms
      },
    });
    const response = await apiBase.get({ url: "/api/v1/whatever" });

    // Assert
    const configuration = spy.mock.calls[0] as any;
    expect(configuration[0]).toBe("get");
    expect(configuration[1].url).toBe("/api/v1/whatever");
    expect(response).toStrictEqual({ fakeResponse: "" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("should call request when calling get with timeout for url", async () => {
    // Arrange
    const spy = jest.spyOn(ApiBase.prototype as any, "request");
    spy.mockImplementation(async () => {
      return { fakeResponse: "" };
    });

    // Execute
    const apiBase = new ApiBase({
      auth: {
        apiKey: "notvalid",
      },
      timeouts: {
        "/api/v1/whatver": 100, // ms
      },
    });
    const response = await apiBase.get({ url: "/api/v1/whatever" });

    // Assert
    const configuration = spy.mock.calls[0] as any;
    expect(configuration[0]).toBe("get");
    expect(configuration[1].url).toBe("/api/v1/whatever");
    expect(response).toStrictEqual({ fakeResponse: "" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("should call request when calling get without auth", async () => {
    // Arrange
    const spy = jest.spyOn(ApiBase.prototype as any, "request");
    spy.mockImplementation(async () => {
      return { fakeResponse: "" };
    });

    // Execute
    const apiBase = new ApiBase({});
    const response = await apiBase.get({ url: "/api/v1/whatever" });

    // Assert
    const configuration = spy.mock.calls[0] as any;
    expect(configuration[0]).toBe("get");
    expect(configuration[1].url).toBe("/api/v1/whatever");
    expect(response).toStrictEqual({ fakeResponse: "" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});
