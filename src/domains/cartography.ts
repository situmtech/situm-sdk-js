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
import { getAdapter as getCurrentOrganization } from "../adapters/OrganizationAdapter";
import {
  getAdapter as getPoiAdapter,
  postAdapter as postPoiAdapter,
  ServerPoiGet,
} from "../adapters/PoiAdapter";
import { getAdapter as getPoiCategoryAdapter } from "../adapters/PoiCategoryAdapter";
import ApiBase from "../apiBase";
import type {
  Building,
  BuildingForm,
  BuildingListElement,
  Floor,
  FloorForm,
  FloorSearch,
  Geofence,
  GeofenceForm,
  GeofenceSearch,
  ID,
  Organization,
  Paginated,
  Paths,
  PathSearch,
  Poi,
  PoiCategory,
  PoiCategoryForm,
  PoiCreateForm,
  PoiSearch,
  PoiUpdateForm,
  UUID,
} from "../types";

export default class CartographyApi {
  private readonly apiBase: ApiBase;

  /**
   * Initializes the cartography domain
   * @param apiBase The connector to interact with the API
   */
  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  /**
   * Returns a list of buildings
   *
   * @returns Promise<BuildingListElement[]>
   */
  getBuildings(): Promise<readonly BuildingListElement[]> {
    return this.apiBase
      .get<BuildingListElement[]>({
        url: "/api/v1/buildings",
      })
      .then((buildingList) =>
        buildingList.map((building: Record<string, unknown>) =>
          getBuildingAdapter(building)
        )
      );
  }

  /**
   * Returns the building information for a given ID
   *
   * @param buildingId The building id to fetch
   * @returns Promise<Building>
   */
  getBuildingById(buildingId: ID): Promise<Building> {
    return this.apiBase
      .get<Building>({
        url: "/api/v1/buildings/" + buildingId,
        headers: { "Content-Type": "application/json" },
      })
      .then(getBuildingAdapter);
  }

  /**
   * Returns the user's current organization
   *
   * @returns Promise<Organization>
   */
  getCurrentOrganization(): Promise<Organization> {
    return this.apiBase
      .get<Organization>({
        url: "/api/v1/organizations/current_organization",
      })
      .then((org) => getCurrentOrganization(org, this.apiBase.getDomain()));
  }

  /**
   * Updates a building given its id and the information to update
   *
   * @param buildingId the building id to update
   * @param buildingForm the building information to use
   * @returns Promise<BuildingListElement>
   */
  patchBuilding(
    buildingId: ID,
    buildingForm: Partial<BuildingForm>
  ): Promise<BuildingListElement> {
    return this.apiBase
      .put<Building>({
        url: "/api/v1/buildings/" + buildingId,
        body: buildingForm,
      })
      .then(getBuildingAdapter);
  }

  /**
   * Creates a new building in your organization
   *
   * @param buildingForm The building information used to create it
   * @return Promise<BuildingListElement>
   */
  createBuilding(buildingForm: BuildingForm): Promise<BuildingListElement> {
    return this.apiBase
      .post<Building>({
        url: "/api/v1/buildings",
        body: buildingForm,
      })
      .then(getBuildingAdapter);
  }

  /**
   * Deletes a building given its id
   *
   * @param buildingId The building id to delete
   * @returns void
   */
  deleteBuilding(buildingId: ID): Promise<void> {
    return this.apiBase.delete({
      url: "/api/v1/buildings/" + buildingId,
    });
  }

  /**
   * Returns a list of floors given a search criteria
   *
   * @param params the list of parameters to filter the response
   * @returns Promise<Floor[]>
   */
  getFloors(params: FloorSearch = {}): Promise<readonly Floor[]> {
    const url =
      params.buildingId > 0
        ? `/api/v1/buildings/${params.buildingId}/floors`
        : `/api/v1/floors`;

    return this.apiBase
      .get<Floor[]>({ url })
      .then((buildingFloors) =>
        buildingFloors.map((floor) => getFloorAdapter(floor))
      );
  }

  /**
   * Returns a floor given its id
   *
   * @param floorId The floor id to fetch
   * @return Promise<Floor>
   */
  getFloorById(floorId: ID): Promise<Floor> {
    return this.apiBase
      .get<Floor>({
        url: "/api/v1/floors/" + floorId,
      })
      .then(getFloorAdapter);
  }

  /**
   * Updates a floor given its id and the information to update
   *
   * @param floorId the floor id to update
   * @param floorForm the floor information to use
   * @returns Promise<Floor>
   */
  patchFloor(floorId: ID, floorForm: Partial<FloorForm>): Promise<Floor> {
    return this.apiBase
      .put<Floor>({
        url: "/api/v1/floors/" + floorId,
        body: floorForm,
      })
      .then(getFloorAdapter);
  }

  /**
   * Creates a new floor
   *
   * @param floorForm The floor information used to create it
   * @return Promise<Floor>
   */
  createFloor(floorForm: FloorForm): Promise<Floor> {
    return this.apiBase
      .post<Floor>({
        url: "/api/v1/floors",
        body: floorForm,
      })
      .then(getFloorAdapter);
  }

  /**
   * Deletes a floor given its id
   *
   * @param floorId The floor id to delete
   * @returns void
   */
  deleteFloor(floorId: ID) {
    return this.apiBase.delete({ url: "/api/v1/floors/" + floorId });
  }

  /**
   * Returns a list of geofences given a search criteria
   *
   * @param params the list of geofences to filter the response
   * @returns Promise<Floor[]>
   */
  async getGeofences(
    params: GeofenceSearch = {}
  ): Promise<Paginated<Geofence>> {
    if (!params.organizationId) {
      params.organizationId = await this.apiBase.getJwtOrganizationId();
    }

    return this.apiBase
      .get<Paginated<Geofence>>({
        url: "/api/v1/geofences",
        params: params,
      })
      .then((result) => ({
        metadata: result.metadata,
        data: result.data.map((geofence: Record<string, unknown>) =>
          getGeofenceAdapter(geofence)
        ),
      }));
  }

  /**
   * Returns a geofence given its id
   *
   * @param geofenceId The geofence id to fetch
   * @return Promise<Geofence>
   */
  getGeofenceById(geofenceId: UUID): Promise<Geofence> {
    return this.apiBase
      .get<Geofence>({
        url: "/api/v1/geofences/" + geofenceId,
      })
      .then(getGeofenceAdapter);
  }

  /**
   * Updates a geofence given its id and the information to update
   *
   * @param geofenceId the geofence id to update
   * @param geofenceForm the geofence information to use
   * @returns Promise<Geofence>
   */
  patchGeofence(
    geofenceId: UUID,
    geofenceForm: Partial<GeofenceForm>
  ): Promise<Geofence> {
    return this.apiBase
      .put<Geofence>({
        url: "/api/v1/geofences/" + geofenceId,
        body: geofenceForm,
      })
      .then(getGeofenceAdapter);
  }

  /**
   * Creates a new geofence
   *
   * @param geofenceForm The geofence information used to create it
   * @return Promise<Geofence>
   */
  createGeofence(geofenceForm: GeofenceForm): Promise<Geofence> {
    return this.apiBase
      .post<Geofence>({
        url: "/api/v1/geofences",
        body: geofenceForm,
      })
      .then(getGeofenceAdapter);
  }

  /**
   * Deletes a geofence given its id
   *
   * @param geofenceId The geofence id to delete
   * @returns Promise<void>
   */
  deleteGeofence(geofenceId: UUID) {
    return this.apiBase.delete({ url: "/api/v1/geofences/" + geofenceId });
  }

  /**
   * Returns a list of paths given a search criteria
   *
   * @param params the list of geofences to filter the response
   * @returns Promise<Paths[]>
   */
  getPaths(params: PathSearch = {}): Promise<Paths[]> {
    const url = params.buildingId
      ? `/api/v1/buildings/${params.buildingId}/paths`
      : "/api/v1/paths";

    return this.apiBase.get<Paths[]>({ url });
  }

  /**
   * Updates a path given its id and the information to update
   *
   * @param buildingId the building id to update paths from
   * @param pathForm the path information to use
   * @returns Promise<Paths>
   */
  patchPath(buildingId: number, pathForm: Paths): Promise<Paths> {
    return this.apiBase.put<Paths>({
      url: `/api/v1/buildings/${buildingId}/paths`,
      body: pathForm,
    });
  }

  /**
   * Returns a list of pois given a search criteria
   *
   * @param params the criteria to filter pois with
   * @returns Array<Poi>
   */
  async getPois(params: PoiSearch = {}): Promise<Poi[]> {
    const url =
      params.buildingId && params.buildingId > 0
        ? `/api/v1/buildings/${params.buildingId}/pois`
        : `/api/v1/pois`;

    if (params.buildingId) {
      delete params.buildingId;
    }

    return this.apiBase
      .get<ServerPoiGet[]>({ url, params })
      .then((pois) => pois.map(getPoiAdapter));
  }

  /**
   * Updates a POI given its id and the information to update
   *
   * @param poiId the poi id to update
   * @param poiForm the poi information to use
   * @returns Promise<Poi>
   */
  patchPoi(poiId: number, poiForm: Partial<PoiUpdateForm>): Promise<Poi> {
    return this.apiBase
      .put<Poi>({
        url: "/api/v1/pois/" + poiId,
        body: poiForm,
      })
      .then(getPoiAdapter);
  }

  /**
   * Creates a new POI
   *
   * @param poiForm The poi information used to create it
   * @return Promise<Poi>
   */
  createPoi(poiCreateForm: PoiCreateForm): Promise<Poi> {
    const poiCreateFormAdapted = postPoiAdapter(poiCreateForm);

    return this.apiBase
      .post<Poi>({
        url: "/api/v1/pois",
        body: poiCreateFormAdapted,
      })
      .then(getPoiAdapter);
  }

  /**
   * Deletes a POI given its id
   *
   * @param poiId The POI id to delete
   * @returns Promise<void>
   */
  deletePoi(poiId: number): Promise<unknown> {
    return this.apiBase.delete({ url: "/api/v1/pois/" + poiId });
  }

  /**
   * Returns a list of POI categories
   *
   * @param buildingId the building id to filter from
   * @returns Promise<PoiCategory[]>
   */
  getPoiCategories(): Promise<PoiCategory[]> {
    return this.apiBase
      .get<PoiCategory[]>({
        url: "/api/v1/poi_categories",
      })
      .then((poiCategories) =>
        poiCategories.map((p) =>
          getPoiCategoryAdapter(p, this.apiBase.getDomain())
        )
      );
  }

  /**
   * Updates a POI category given its id and the information to update
   *
   * @param poiCategoryId the poi category id to update
   * @param poiCategoryForm the poi category information to use
   * @returns Promise<PoiCategory>
   */
  patchPoiCategory(
    poiCategoryId: number,
    poiCategoryForm: Partial<PoiCategoryForm>
  ): Promise<PoiCategory> {
    return this.apiBase.put<PoiCategory>({
      url: "/api/v1/poi_categories/" + poiCategoryId,
      body: poiCategoryForm,
    });
  }

  /**
   * Creates a new POI category
   *
   * @param poiCategoryForm The poi category information used to create it
   * @return Promise<PoiCategory>
   */
  createPoiCategory(poiCategoryForm: PoiCategoryForm): Promise<PoiCategory> {
    return this.apiBase.post<PoiCategory>({
      url: "/api/v1/poi_categories",
      body: poiCategoryForm,
    });
  }

  /**
   * Deletes a POI category given its id
   *
   * @param poiCategoryId The POI category id to delete
   * @returns Promise<void>
   */
  deletePoiCategory(poiCategoryId: number) {
    return this.apiBase.delete({
      url: "/api/v1/poi_categories/" + poiCategoryId,
    });
  }
}
