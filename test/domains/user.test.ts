/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { expect } from "chai";

import SitumSDK from "../../src";
import { Role, UserForm } from "../../src/types";
import { getMockData, mockAxiosRequest } from "../utils/mockUtils";

describe("SitumSDK.user", () => {
  let situmSDK = null;
  let axiosMock = null;
  let mockUser = null;

  beforeEach(() => {
    situmSDK = new SitumSDK({ auth: getMockData("auth") });
    mockUser = getMockData("userMock1");
  });

  afterEach(() => {
    situmSDK = null;

    axiosMock.mockRestore();
  });

  it("should retrieve a user by its id", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("userResponseMock1"),
    ]);

    // Execute
    const user = await situmSDK.user.getUserById(mockUser.id);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/users/${mockUser.id}`);
    expect(user).is.deep.equal(mockUser);
  });

  it("should search users by name", async () => {
    // Arrange
    const mockUserList = {
      data: [getMockData("userResponseMock1")],
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
      { access_token: "fakeJWT" },
      mockUserList,
    ]);

    // Execute
    const userList = await situmSDK.user.getUsers({
      fullName: "test",
    });

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.params).to.be.equals("full_name=test");
    expect(configuration.url).to.be.equals("/api/v1/users");
    expect(userList).is.deep.equal({
      ...mockUserList,
      data: [getMockData("userMock1")],
    });
  });

  it("should create a user", async () => {
    // Arrange
    const mockUser = getMockData("userMock1");
    axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("userResponseMock1"),
    ]);
    const userForm: UserForm = {
      role: "USER" as Role,
      email: "test@situm.dd",
      buildingIds: [9727],
      password: "topSecret!!!",
    };

    // Execute
    const user = await situmSDK.user.createUser(userForm);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.data).to.be.deep.equals({
      building_ids: [9727],
      email: "test@situm.dd",
      role: "USER",
      password: "topSecret!!!",
      is_manager: false,
      is_staff: false,
    });
    expect(configuration.method).to.be.deep.equals("post");
    expect(configuration.url).to.be.equals("/api/v1/users");
    expect(user).is.deep.equal(mockUser);
  });

  it("should update a user", async () => {
    // Arrange
    const situmSDK = new SitumSDK({ auth: getMockData("auth") });
    const mockUser = getMockData("userMock1");
    axiosMock = mockAxiosRequest([
      { access_token: "fakeJWT" },
      getMockData("userResponseMock1"),
    ]);
    const userForm: UserForm = {
      role: "USER" as Role,
      email: "test@situm.dd",
      buildingIds: [9727],
      password: "topSecret!!!",
    };

    // Execute
    const user = await situmSDK.user.patchUser(
      "a41bddf3-db6b-4b8b-ab78-4caa22f9efc4",
      userForm
    );

    // Assert
    expect(user).is.deep.equal(mockUser);
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.method).to.be.equals("put");

    axiosMock.mockRestore();
  });

  it("should delete a user", async () => {
    // Arrange
    axiosMock = mockAxiosRequest([{ access_token: "fakeJWT" }, null]);
    const uuid = "a41bddf3-db6b-4b8b-ab78-4caa22f9efc4";

    // Execute
    await situmSDK.user.deleteUser(uuid);

    // Assert
    const configuration = axiosMock.mock.calls[1][0];
    expect(configuration.url).to.be.equals(`/api/v1/users/${uuid}`);
    expect(configuration.method).to.be.equals("delete");
  });
});
