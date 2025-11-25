/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Geofence } from "../types/cartography";

/**
 * Adapts the server response to our common Floor object,
 * cleaning deprecations, removing redundancies, and more.
 *
 * @param geofence The geofence object that returns the server api
 * @returns Geofence the clean and normalized floor object
 */
export function getAdapter(geofence: Record<string, unknown>): Geofence {
  const geofenceToReturn = {
    ...geofence,
  };

  delete geofenceToReturn.CustomFields;
  delete geofenceToReturn.levelId;
  return geofenceToReturn as Geofence;
}
