/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
  PoiCategory,
  PoiCategoryForm,
  Pois,
  PoisCreateForm,
  PoisUpdateForm,
  SearchGeofence,
  UUID,
} from "../types";

function buildingMapper(building: Record<string, unknown>): Building {
  const buildingToReturn = {
    ...building,
  };

  buildingToReturn.userId = building.userUuid;
  delete buildingToReturn.event;
  delete buildingToReturn.userUuid;
  return buildingToReturn as Building;
}

function floorMapper(floor: Record<string, unknown>): Floor {
  const floorToReturn = {
    ...floor,
  };

  delete floorToReturn.projectId;
  return floorToReturn as Floor;
}

function geofenceMapper(geofence: Record<string, unknown>): Geofence {
  const geofenceToReturn = {
    ...geofence,
  };

  delete geofenceToReturn.CustomFields;
  delete geofenceToReturn.levelId;
  return geofenceToReturn as Geofence;
}

export default class CartographyApi {
  private readonly apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  async getGeofenceById(geofenceId: UUID): Promise<Geofence> {
    const geofence = (await this.apiBase.get({
      url: "/api/v1/geofences/" + geofenceId,
    })) as Record<string, unknown>;
    return geofenceMapper(geofence);
  }

  async searchGeofences(
    searchGeofence: SearchGeofence
  ): Promise<Paginated<Geofence>> {
    if (!searchGeofence.organizationId) {
      searchGeofence.organizationId = await this.apiBase.getJwtOrganizationId();
    }
    const paginatedGeofences = (await this.apiBase.get({
      url: "/api/v1/geofences",
      params: searchGeofence,
    })) as Paginated<Record<string, unknown>>;
    return {
      metadata: paginatedGeofences.metadata,
      data: paginatedGeofences.data.map((geofence: Record<string, unknown>) =>
        geofenceMapper(geofence)
      ),
    };
  }

  async patchGeofence(
    geofenceId: UUID,
    geofenceForm: Partial<GeofenceForm>
  ): Promise<Geofence> {
    const geofence = (await this.apiBase.put({
      url: "/api/v1/geofences/" + geofenceId,
      body: geofenceForm,
    })) as Record<string, unknown>;
    return geofenceMapper(geofence);
  }

  async createGeofence(geofenceForm: GeofenceForm): Promise<Geofence> {
    const geofence = (await this.apiBase.post({
      url: "/api/v1/geofences",
      body: geofenceForm,
    })) as Record<string, unknown>;
    return geofenceMapper(geofence);
  }

  async deleteGeofence(geofenceId: UUID) {
    await this.apiBase.delete({ url: "/api/v1/geofences/" + geofenceId });
  }

  async getBuildingById(buildingId: number): Promise<Building> {
    const building = (await this.apiBase.get({
      url: "/api/v1/buildings/" + buildingId,
    })) as Record<string, unknown>;
    return buildingMapper(building);
  }

  async getBuildings(): Promise<readonly BuildingListElement[]> {
    const buildingList = (await this.apiBase.get({
      url: "/api/v1/buildings",
    })) as Record<string, unknown>[];
    return buildingList.map((building: Record<string, unknown>) =>
      buildingMapper(building)
    );
  }

  async patchBuilding(
    buildingId: number,
    buildingForm: Partial<BuildingForm>
  ): Promise<BuildingListElement> {
    const building = (await this.apiBase.put({
      url: "/api/v1/buildings/" + buildingId,
      body: buildingForm,
    })) as Record<string, unknown>;
    return buildingMapper(building);
  }

  async createBuilding(
    buildingForm: BuildingForm
  ): Promise<BuildingListElement> {
    const building = (await this.apiBase.post({
      url: "/api/v1/buildings",
      body: buildingForm,
    })) as Record<string, unknown>;
    return buildingMapper(building);
  }

  async deleteBuilding(buildingId: number) {
    await this.apiBase.delete({ url: "/api/v1/buildings/" + buildingId });
  }

  async getFloorById(floorId: number): Promise<Floor> {
    const floor = (await this.apiBase.get({
      url: "/api/v1/floors/" + floorId,
    })) as Record<string, unknown>;
    return floorMapper(floor);
  }

  async searchFloor(buildingId: number): Promise<readonly Floor[]> {
    const buildingFloors = (await this.apiBase.get({
      url: `/api/v1/buildings/${buildingId}/floors`,
    })) as Record<string, unknown>[];
    return buildingFloors.map((floor: Record<string, unknown>) =>
      floorMapper(floor)
    );
  }

  async patchFloor(
    floorId: number,
    floorForm: Partial<FloorForm>
  ): Promise<Floor> {
    const floor = (await this.apiBase.put({
      url: "/api/v1/floors/" + floorId,
      body: floorForm,
    })) as Record<string, unknown>;
    return floorMapper(floor);
  }

  async createFloor(floorForm: FloorForm): Promise<Floor> {
    const floor = (await this.apiBase.post({
      url: "/api/v1/floors",
      body: floorForm,
    })) as Record<string, unknown>;
    return floorMapper(floor);
  }

  async deleteFloor(floorId: number) {
    await this.apiBase.delete({ url: "/api/v1/floors/" + floorId });
  }

  async getPathsByBuildingId(buildingId: number): Promise<Paths> {
    const path = (await this.apiBase.get({
      url: `/api/v1/buildings/${buildingId}/paths`,
    })) as Paths;
    return path;
  }

  async getPaths(): Promise<Paths[]> {
    return (await this.apiBase.get({
      url: "/api/v1/paths",
    })) as Paths[];
  }

  async updatePath(buildingId: number, pathForm: Paths): Promise<Paths> {
    return (await this.apiBase.put({
      url: `/api/v1/buildings/${buildingId}/paths`,
      body: pathForm,
    })) as Paths;
  }

  async getPoiCategories(): Promise<readonly PoiCategory[]> {
    return (await this.apiBase.get({
      url: "/api/v1/poi_categories",
    })) as PoiCategory[];
  }

  async patchPoiCategory(
    poiCategoryId: number,
    poiCategoryForm: Partial<PoiCategoryForm>
  ): Promise<PoiCategory> {
    return (await this.apiBase.put({
      url: "/api/v1/poi_categories/" + poiCategoryId,
      body: poiCategoryForm,
    })) as PoiCategory;
  }

  async createPoiCategory(
    poiCategoryForm: PoiCategoryForm
  ): Promise<PoiCategory> {
    return (await this.apiBase.post({
      url: "/api/v1/poi_categories",
      body: poiCategoryForm,
    })) as PoiCategory;
  }

  async deletePoiCategory(poiCategoryId: number) {
    await this.apiBase.delete({
      url: "/api/v1/poi_categories/" + poiCategoryId,
    });
  }

  async getInsidePoisByBuildingId(
    buildingId: number
  ): Promise<readonly Pois[]> {
    return (await this.apiBase.get({
      url: `/api/v1/buildings/${buildingId}/pois`,
    })) as Pois[];
  }

  async getOutsidePoisByBuildingId(
    buildingId: number
  ): Promise<readonly Pois[]> {
    return (await this.apiBase.get({
      url: `/api/v1/buildings/${buildingId}/exterior_pois`,
    })) as Pois[];
  }

  async getPois(buildingId?: number): Promise<readonly Pois[]> {
    const params = {};
    if (buildingId) {
      params["buildingId"] = buildingId;
    }
    return (await this.apiBase.get({ url: `/api/v1/pois`, params })) as Pois[];
  }

  async patchPoi(
    poiId: number,
    poisForm: Partial<PoisUpdateForm>
  ): Promise<Pois> {
    return (await this.apiBase.put({
      url: "/api/v1/pois/" + poiId,
      body: poisForm,
    })) as Pois;
  }

  async createPoi(poisCreateForm: PoisCreateForm): Promise<Pois> {
    return (await this.apiBase.post({
      url: "/api/v1/pois",
      body: poisCreateForm,
    })) as Pois;
  }

  async deletePoi(poiId: number) {
    await this.apiBase.delete({ url: "/api/v1/pois/" + poiId });
  }
}
