/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { PoiCategory } from "../types";

/**
 * Adapts the server response to our common PoiCategory object,
 * cleaning deprecations, removing redundancies, and more.
 *
 * @param poiCategory Not normalized POI Category
 * @param domain Current domain to get the icon picture url
 * @returns Floor the clean and normalized floor object
 */
export function getAdapter(
  poiCategory: Record<string, unknown>,
  domain: string
): PoiCategory {
  poiCategory.iconUrl = domain + poiCategory.iconUrl;

  return poiCategory as PoiCategory;
}
