/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import ApiBase from "../apiBase";
import { Paginated, SearchUser, User, UserForm, UUID } from "../types";

function userFormMapperCreate(
  user: UserForm
): UserForm & { isManager: boolean; isStaff: boolean } {
  return {
    ...user,
    isManager:
      user.role === "ZONE_MANAGER" || user.role === "COLLECTIVE_MANAGER",
    isStaff: user.role === "COLLECTIVE_MANAGER" || user.role === "STAFF",
  };
}

function userMapper(user: Record<string, unknown>) {
  const userToReturn = {
    ...user,
  };

  if (user.roleId && !user.role) {
    user.role = user.roleId;
  }

  delete userToReturn.cancelEmergency;
  delete userToReturn.confirmEmergency;
  delete userToReturn.declareEmergency;
  delete userToReturn.isStaff;
  delete userToReturn.roleId;
  delete (userToReturn.license as Record<string, unknown>).uuid;
  delete userToReturn.organizationUuid;
  delete userToReturn.seeAlarms;
  delete userToReturn.seeEmergency;
  delete userToReturn.shiftEnd;
  delete userToReturn.shiftStart;
  delete userToReturn.situmMaps;
  delete userToReturn.situmMaps;
  delete userToReturn.sosAlarm;
  delete userToReturn.uuid;
  delete userToReturn.deadmanAlarm;

  return userToReturn as User;
}

export default class UserApi {
  private readonly apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  async getUserById(userId: UUID): Promise<User> {
    const user = (await this.apiBase.get({
      url: "/api/v1/users/" + userId,
    })) as Record<string, unknown>;

    return userMapper(user);
  }

  async searchUsers(searchUser?: SearchUser): Promise<Paginated<User>> {
    const paginatedUsers = (await this.apiBase.get({
      url: "/api/v1/users",
      params: searchUser,
    })) as Paginated<Record<string, unknown>>;

    return {
      metadata: paginatedUsers.metadata,
      data: paginatedUsers.data.map((user: Record<string, unknown>) =>
        userMapper(user)
      ),
    };
  }

  async patchUser(userId: UUID, userForm: UserForm): Promise<User> {
    const user = (await this.apiBase.put({
      url: "/api/v1/users/" + userId,
      body: userForm,
    })) as Record<string, unknown>;

    return userMapper(user);
  }

  async createUser(userForm: UserForm): Promise<User> {
    const user = (await this.apiBase.post({
      url: "/api/v1/users",
      body: userFormMapperCreate(userForm),
    })) as Record<string, unknown>;

    return userMapper(user);
  }

  async deleteUser(userId: UUID) {
    await this.apiBase.delete({ url: "/api/v1/users/" + userId });
  }
}
