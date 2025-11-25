/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Poi, PoiCreateForm } from "../types/cartography";
import type { Cartesians, LatLng } from "../types/coordinates";

export type ServerPoiGet = Poi & {
  position: {
    floorId: number;
    x: number;
    y: number;
    lat: number;
    lng: number;
    radius: 5;
    georeferences: LatLng;
    cartesians: Cartesians;
  };
};

type ServerPoiPost = Poi & {
  position: {
    floorId: number;
    georeferences: LatLng;
  };
};

/**
 * Adapts the server response to our common Poi object,
 * cleaning deprecations, removing redundancies, and more.
 *
 * @param poi The poi object that returns the server api
 * @returns Poi the clean and normalized floor object
 */
export function getAdapter(serverPoi: ServerPoiGet): Poi {
  const poi = {
    ...serverPoi,
  };

  // if indoor, normalize response
  if (poi.position) {
    poi.floorId = poi.position.floorId;
    poi.location = {
      lat: poi.position.lat,
      lng: poi.position.lng,
      x: poi.position.x,
      y: poi.position.y,
    };

    delete poi.position;
  }

  return poi;
}

/**
 * Adapts our common Poi object to the server,
 * adapting deprecations, and more.
 *
 * @param poi The normalized poi object
 * @returns Poi the poi object to send to the server api
 */
export function postAdapter(serverPoi: PoiCreateForm): ServerPoiPost {
  const poi = {
    ...serverPoi,
  } as ServerPoiPost;

  return poi as ServerPoiPost;
}
