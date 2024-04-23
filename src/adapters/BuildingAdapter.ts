/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Building, Poi } from "../types";

import { getAdapter as getAdapterPoi, ServerPoiGet } from "./PoiAdapter";

/**
 * Adapts the server response to our common Building object,
 * cleaning deprecations, removing redundancies, and more.
 *
 * @param building The building object that returns the server api
 * @returns Building the clean and normalized building object
 */
export function getAdapter(building: Record<string, unknown>): Building {
  const buildingToReturn = {
    ...building,
  };

  buildingToReturn.userId = building.userUuid;
  buildingToReturn.pois = [] as Array<Poi>;
  if (
    building.indoorPois &&
    (building.indoorPois as Array<unknown>).length > 0
  ) {
    (building.indoorPois as Array<ServerPoiGet>)
      .map(getAdapterPoi)
      .forEach((it) => {
        (buildingToReturn.pois as Array<Poi>).push(it);
      });
  }

  if (
    building.outdoorPois &&
    (building.outdoorPois as Array<unknown>).length > 0
  ) {
    (building.outdoorPois as Array<ServerPoiGet>)
      .map(getAdapterPoi)
      .forEach((it) => {
        (buildingToReturn.pois as Array<Poi>).push(it);
      });
  }

  delete buildingToReturn.event;
  delete buildingToReturn.userUuid;
  delete buildingToReturn.indoorPois;
  delete buildingToReturn.outdoorPois;

  return buildingToReturn as Building;
}
