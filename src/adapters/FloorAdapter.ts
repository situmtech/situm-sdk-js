/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Floor } from "../types";

/**
 * Adapts the server response to our common Floor object,
 * cleaning deprecations, removing redundancies, and more.
 *
 * @param floor The floor object that returns the server api
 * @returns Floor the clean and normalized floor object
 */
export function getAdapter(floor: Record<string, unknown>): Floor {
  const floorToReturn = {
    ...floor,
  };

  delete floorToReturn.projectId;
  return floorToReturn as Floor;
}
