/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Floor } from "../types";

export function getAdapter(floor: Record<string, unknown>): Floor {
  const floorToReturn = {
    ...floor,
  };

  delete floorToReturn.projectId;
  return floorToReturn as Floor;
}
