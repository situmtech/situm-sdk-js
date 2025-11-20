/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { getAdapter, postAdapter } from "../adapters/UserAdapter";
import type ApiBase from "../apiBase";
import type { Apikey, User, UserForm, UserSearch } from "../types/auth";
import type { Paginated, UUID } from "../types/models";

/**
 * Service that exposes the user domain.
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
   * @returns {Promise<Paginated<User>>} A promise that resolves with paginated user data.
   */
  getUsers(searchUser?: UserSearch): Promise<Paginated<User>> {
    return this.apiBase
      .get({
        params: searchUser,
        url: "/api/v1/users",
      })
      .then((users: Paginated<Record<string, unknown>>) => {
        return {
          data: users.data.map(getAdapter),
          metadata: users.metadata,
        };
      });
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {UUID} userId - The ID of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves with the user data.
   */
  getUserById(userId: UUID): Promise<User> {
    return this.apiBase
      .get({
        url: `/api/v1/users/${userId}`,
      })
      .then(getAdapter);
  }

  /**
   * Sends a PUT request to update a user based on the provided userId and userForm.
   *
   * @param {UUID} userId - The unique identifier of the user to be updated.
   * @param {UserForm} userForm - The form containing the updated user information.
   * @returns {Promise<User>} A promise that resolves with the updated user data.
   */
  patchUser(userId: UUID, userForm: UserForm): Promise<User> {
    return this.apiBase
      .put({
        body: userForm,
        url: `/api/v1/users/${userId}`,
      })
      .then(getAdapter);
  }

  /**
   * Creates a new user.
   *
   * @param {UserForm} userForm - The user form containing the user information.
   * @returns {Promise<User>} A promise that resolves with the created user.
   */
  createUser(userForm: UserForm): Promise<User> {
    return this.apiBase
      .post({
        body: postAdapter(userForm),
        url: "/api/v1/users",
      })
      .then(getAdapter);
  }

  /**
   * Deletes a user based on the provided userId.
   *
   * @param {UUID} userId - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves after deleting the user.
   */
  deleteUser(userId: UUID): Promise<unknown> {
    return this.apiBase.delete({ url: `/api/v1/users/${userId}` });
  }

  /**
   * Retrieves a list of 'positioning' apikeys attached to current user.
   *
   * @returns {Promise<Apikey>} A promise that resolves with apikeys array.
   */
  getPositioningApikeys(): Promise<Apikey[]> {
    return this.apiBase
      .get({
        params: { permissions: "positioning" },
        url: "/api/v1/auth/apikeys",
      })
      .then((apikeys: Apikey[]) => {
        return apikeys;
      })
      .catch((err) => {
        console.error(err);
        return [];
      });
  }
}
