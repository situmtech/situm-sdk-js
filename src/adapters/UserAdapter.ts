/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { User, UserForm } from "../types";

export type UserServer = UserForm & { isManager: boolean; isStaff: boolean };

/**
 * Adapts the server response to our common User object,
 * cleaning deprecations, removing redundancies, and more.
 *
 * @param user The user object that returns the server api
 * @returns User the clean and normalized floor object
 */
export function getAdapter(user: Record<string, unknown>): User {
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
  delete (userToReturn.license as Record<string, unknown>)?.uuid;
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

/**
 * Adapts our common User object to the server,
 * adapting deprecations, and more.
 *
 * @param user The normalized user object
 * @returns User the user object to send to the server api
 */
export function postAdapter(user: UserForm): UserServer {
  return {
    ...user,
    isManager:
      user.role === "ZONE_MANAGER" || user.role === "COLLECTIVE_MANAGER",
    isStaff: user.role === "COLLECTIVE_MANAGER" || user.role === "STAFF",
  };
}
