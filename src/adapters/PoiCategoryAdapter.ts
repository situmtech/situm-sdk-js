/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { PoiCategory } from "../types/cartography";

/**
 * Adapts the server response to our common PoiCategory object,
 * cleaning deprecations, removing redundancies, and more.
 *
 * @param poiCategory Not normalized POI Category
 * @param domain Current domain to get the icon picture url
 * @returns POI Category normalized object
 */
export function getAdapter(
  poiCategory: PoiCategory,
  domain: string,
): PoiCategory {
  poiCategory.iconUrl = !poiCategory.iconUrl.includes("https")
    ? domain + poiCategory.iconUrl
    : poiCategory.iconUrl;

  return poiCategory as PoiCategory;
}
