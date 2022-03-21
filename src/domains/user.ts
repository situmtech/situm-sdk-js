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

export default class UserApi {
  private readonly apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

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

  getUserById(userId: UUID): Promise<User> {
    return this.apiBase
      .get({
        url: "/api/v1/users/" + userId,
      })
      .then(getAdapter);
  }

  patchUser(userId: UUID, userForm: UserForm): Promise<User> {
    return this.apiBase
      .put({
        url: "/api/v1/users/" + userId,
        body: userForm,
      })
      .then(getAdapter);
  }

  createUser(userForm: UserForm): Promise<User> {
    return this.apiBase
      .post({
        url: "/api/v1/users",
        body: postAdapter(userForm),
      })
      .then(getAdapter);
  }

  deleteUser(userId: UUID): Promise<unknown> {
    return this.apiBase.delete({ url: "/api/v1/users/" + userId });
  }
}
