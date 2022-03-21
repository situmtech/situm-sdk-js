/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Cartesians, Coordinate, Poi, PoiCreateForm } from "../types";

export type ServerPoiGet = Poi & {
  position: {
    floorId: number;
    x: number;
    y: number;
    lat: number;
    lng: number;
    radius: 5;
    georeferences: Coordinate;
    cartesians: Cartesians;
  };
};

type ServerPoiPost = Poi & {
  position: {
    floorId: number;
    georeferences: Coordinate;
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
    poi["floorId"] = poi.position.floorId;
    poi["location"] = poi.position.georeferences;

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

  // If indoor, de-normalize response
  poi["position"] = {
    floorId: poi.floorId,
    georeferences: poi.location,
  };
  delete poi.location;
  delete poi.floorId;

  return poi as ServerPoiPost;
}
