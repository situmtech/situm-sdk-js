/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { getAdapter, postAdapter } from "../adapters/UserAdapter";
import ApiBase from "../apiBase";
import { Paginated, User, UserForm, UserSearch, UUID } from "../types";

/**
 * Service that exposes the cartography domain.
 *
 * Represents the UserAPi class that provides methods for
 * listing/creating/updating/deleting users.
 **/
export default class UserApi {
  private readonly apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  /**
   * Retrieves a list of users based on the search criteria.
   *
   * @param {UserSearch | undefined} searchUser - Optional search criteria for filtering users.
   * @return {Promise<Paginated<User>>} A promise that resolves with paginated user data.
   */
  getUsers(searchUser?: UserSearch): Promise<Paginated<User>> {
    return this.apiBase
      .get({
        url: "/api/v1/users",
        params: searchUser,
      })
      .then((users: Paginated<Record<string, unknown>>) => {
        return {
          metadata: users.metadata,
          data: users.data.map(getAdapter),
        };
      });
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {UUID} userId - The ID of the user to retrieve.
   * @return {Promise<User>} A promise that resolves with the user data.
   */
  getUserById(userId: UUID): Promise<User> {
    return this.apiBase
      .get({
        url: "/api/v1/users/" + userId,
      })
      .then(getAdapter);
  }

  /**
   * Sends a PUT request to update a user based on the provided userId and userForm.
   *
   * @param {UUID} userId - The unique identifier of the user to be updated.
   * @param {UserForm} userForm - The form containing the updated user information.
   * @return {Promise<User>} A promise that resolves with the updated user data.
   */
  patchUser(userId: UUID, userForm: UserForm): Promise<User> {
    return this.apiBase
      .put({
        url: "/api/v1/users/" + userId,
        body: userForm,
      })
      .then(getAdapter);
  }

  /**
   * Creates a new user.
   *
   * @param {UserForm} userForm - The user form containing the user information.
   * @return {Promise<User>} A promise that resolves with the created user.
   */
  createUser(userForm: UserForm): Promise<User> {
    return this.apiBase
      .post({
        url: "/api/v1/users",
        body: postAdapter(userForm),
      })
      .then(getAdapter);
  }

  /**
   * Deletes a user based on the provided userId.
   *
   * @param {UUID} userId - The ID of the user to delete.
   * @return {Promise<void>} A promise that resolves after deleting the user.
   */
  deleteUser(userId: UUID): Promise<unknown> {
    return this.apiBase.delete({ url: "/api/v1/users/" + userId });
  }
}
