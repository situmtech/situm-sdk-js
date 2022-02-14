/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Cartesians, Coordinate, Poi, PoiCreateForm } from "../types";

type ServerPoiGet = Poi & {
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

export function getAdapter(poi: ServerPoiGet): Poi {
  if (poi.position) {
    //indoor
    poi["floorId"] = poi.position.floorId;
    poi["location"] = poi.position.georeferences;
    delete poi.position;
  }

  return poi;
}

export function postAdapter(poi: PoiCreateForm): ServerPoiPost {
  poi["position"] = {
    floorId: poi.floorId,
    georeferences: poi.location,
  };
  delete poi.location;
  delete poi.floorId;

  return poi as ServerPoiPost;
}
