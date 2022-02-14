/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Geofence } from "../types";

export function getAdapter(geofence: Record<string, unknown>): Geofence {
  const geofenceToReturn = {
    ...geofence,
  };

  delete geofenceToReturn.CustomFields;
  delete geofenceToReturn.levelId;
  return geofenceToReturn as Geofence;
}
