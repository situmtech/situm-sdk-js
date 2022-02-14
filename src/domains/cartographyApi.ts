/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { getAdapter as getBuildingAdapter } from "../adapters/BuildingAdapter";
import { getAdapter as getFloorAdapter } from "../adapters/FloorAdapter";
import { getAdapter as getGeofenceAdapter } from "../adapters/GeofenceAdapter";
import {
  getAdapter as getPoiAdapter,
  postAdapter as postPoiAdapter,
} from "../adapters/PoiAdapter";
import ApiBase from "../apiBase";
import type {
  Building,
  BuildingForm,
  BuildingListElement,
  Floor,
  FloorForm,
  Geofence,
  GeofenceForm,
  Paginated,
  Paths,
  Poi,
  PoiCategory,
  PoiCategoryForm,
  PoiCreateForm,
  PoiUpdateForm,
  SearchGeofence,
  UUID,
} from "../types";

export default class CartographyApi {
  private readonly apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  getGeofenceById(geofenceId: UUID): Promise<Geofence> {
    return this.apiBase
      .get({
        url: "/api/v1/geofences/" + geofenceId,
      })
      .then(getGeofenceAdapter);
  }

  async searchGeofences(
    searchGeofence: SearchGeofence
  ): Promise<Paginated<Geofence>> {
    if (!searchGeofence.organizationId) {
      searchGeofence.organizationId = await this.apiBase.getJwtOrganizationId();
    }
    return this.apiBase
      .get({
        url: "/api/v1/geofences",
        params: searchGeofence,
      })
      .then((result: Paginated<Record<string, unknown>>) => ({
        metadata: result.metadata,
        data: result.data.map((geofence: Record<string, unknown>) =>
          getGeofenceAdapter(geofence)
        ),
      }));
  }

  patchGeofence(
    geofenceId: UUID,
    geofenceForm: Partial<GeofenceForm>
  ): Promise<Geofence> {
    return this.apiBase
      .put({
        url: "/api/v1/geofences/" + geofenceId,
        body: geofenceForm,
      })
      .then(getGeofenceAdapter);
  }

  createGeofence(geofenceForm: GeofenceForm): Promise<Geofence> {
    return this.apiBase
      .post({
        url: "/api/v1/geofences",
        body: geofenceForm,
      })
      .then(getGeofenceAdapter);
  }

  deleteGeofence(geofenceId: UUID) {
    return this.apiBase.delete({ url: "/api/v1/geofences/" + geofenceId });
  }

  getBuildingById(buildingId: number): Promise<Building> {
    return this.apiBase
      .get({
        url: "/api/v1/buildings/" + buildingId,
      })
      .then(getBuildingAdapter);
  }

  getBuildings(): Promise<readonly BuildingListElement[]> {
    return this.apiBase
      .get({
        url: "/api/v1/buildings",
      })
      .then((buildingList: Record<string, unknown>[]) =>
        buildingList.map((building: Record<string, unknown>) =>
          getBuildingAdapter(building)
        )
      );
  }

  patchBuilding(
    buildingId: number,
    buildingForm: Partial<BuildingForm>
  ): Promise<BuildingListElement> {
    return this.apiBase
      .put({
        url: "/api/v1/buildings/" + buildingId,
        body: buildingForm,
      })
      .then(getBuildingAdapter);
  }

  createBuilding(buildingForm: BuildingForm): Promise<BuildingListElement> {
    return this.apiBase
      .post({
        url: "/api/v1/buildings",
        body: buildingForm,
      })
      .then(getBuildingAdapter);
  }

  deleteBuilding(buildingId: number) {
    return this.apiBase.delete({ url: "/api/v1/buildings/" + buildingId });
  }

  getFloorById(floorId: number): Promise<Floor> {
    return this.apiBase
      .get({
        url: "/api/v1/floors/" + floorId,
      })
      .then(getFloorAdapter);
  }

  getFloorsOfBuilding(buildingId: number): Promise<readonly Floor[]> {
    return this.apiBase
      .get({
        url: `/api/v1/buildings/${buildingId}/floors`,
      })
      .then((buildingFloors: Record<string, unknown>[]) =>
        buildingFloors.map((floor: Record<string, unknown>) =>
          getFloorAdapter(floor)
        )
      );
  }

  patchFloor(floorId: number, floorForm: Partial<FloorForm>): Promise<Floor> {
    return this.apiBase
      .put({
        url: "/api/v1/floors/" + floorId,
        body: floorForm,
      })
      .then(getFloorAdapter);
  }

  createFloor(floorForm: FloorForm): Promise<Floor> {
    return this.apiBase
      .post({
        url: "/api/v1/floors",
        body: floorForm,
      })
      .then(getFloorAdapter);
  }

  deleteFloor(floorId: number) {
    return this.apiBase.delete({ url: "/api/v1/floors/" + floorId });
  }

  getPathsByBuildingId(buildingId: number): Promise<Paths> {
    return this.apiBase.get({
      url: `/api/v1/buildings/${buildingId}/paths`,
    }) as Promise<Paths>;
  }

  getPaths(): Promise<Paths[]> {
    return this.apiBase.get({
      url: "/api/v1/paths",
    }) as Promise<Paths[]>;
  }

  updatePath(buildingId: number, pathForm: Paths): Promise<Paths> {
    return this.apiBase.put({
      url: `/api/v1/buildings/${buildingId}/paths`,
      body: pathForm,
    }) as Promise<Paths>;
  }

  getPoiCategories(): Promise<readonly PoiCategory[]> {
    return this.apiBase.get({
      url: "/api/v1/poi_categories",
    }) as Promise<readonly PoiCategory[]>;
  }

  patchPoiCategory(
    poiCategoryId: number,
    poiCategoryForm: Partial<PoiCategoryForm>
  ): Promise<PoiCategory> {
    return this.apiBase.put({
      url: "/api/v1/poi_categories/" + poiCategoryId,
      body: poiCategoryForm,
    }) as Promise<PoiCategory>;
  }

  createPoiCategory(poiCategoryForm: PoiCategoryForm): Promise<PoiCategory> {
    return this.apiBase.post({
      url: "/api/v1/poi_categories",
      body: poiCategoryForm,
    }) as Promise<PoiCategory>;
  }

  deletePoiCategory(poiCategoryId: number) {
    return this.apiBase.delete({
      url: "/api/v1/poi_categories/" + poiCategoryId,
    });
  }

  /**
   * Returns the pois of a building.
   */
  getPoisOfBuilding(
    buildingId: number,
    type: "indoor" | "outdoor"
  ): Promise<readonly Poi[]> {
    const params = {};
    if (type) {
      params["type"] = type;
    }
    return this.apiBase.get({
      url: `/api/v1/buildings/${buildingId}/pois`,
      params,
    }) as Promise<Poi[]>;
  }

  /**
   * Returns all the pois of your organization.
   */
  getPois(buildingId?: number): Promise<readonly Poi[]> {
    const params = {};
    if (buildingId) {
      params["buildingId"] = buildingId;
    }
    return this.apiBase
      .get({ url: `/api/v1/pois`, params })
      .then((pois: Array<Record<string, unknown>>) => pois.map(getPoiAdapter));
  }

  patchPoi(poiId: number, poiForm: Partial<PoiUpdateForm>): Promise<Poi> {
    return this.apiBase
      .put({
        url: "/api/v1/pois/" + poiId,
        body: poiForm,
      })
      .then(getPoiAdapter);
  }

  createPoi(poiCreateForm: PoiCreateForm): Promise<Poi> {
    const poiCreateFormAdapted = postPoiAdapter(poiCreateForm);
    return this.apiBase
      .post({
        url: "/api/v1/pois",
        body: poiCreateFormAdapted,
      })
      .then(getPoiAdapter);
  }

  deletePoi(poiId: number) {
    return this.apiBase.delete({ url: "/api/v1/pois/" + poiId });
  }
}
