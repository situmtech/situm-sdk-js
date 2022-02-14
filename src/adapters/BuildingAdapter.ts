/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Building } from "../types";

import { getAdapter as getAdapterPoi } from "./PoiAdapter";

export function getAdapter(building: Record<string, unknown>): Building {
  const buildingToReturn = {
    ...building,
  };

  buildingToReturn.userId = building.userUuid;
  buildingToReturn.pois = [
    ...(building.indoorPois as Array<unknown>)?.map(getAdapterPoi),
    ...(building.outdoorPois as Array<unknown>)?.map(getAdapterPoi),
  ];
  delete buildingToReturn.event;
  delete buildingToReturn.userUuid;
  delete buildingToReturn.indoorPois;
  delete buildingToReturn.outdoorPois;
  return buildingToReturn as Building;
}
