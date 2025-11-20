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
import { getAdapter as getCurrentOrganizationAdapter } from "../adapters/OrganizationAdapter";
import {
  getAdapter as getPoiAdapter,
  type ServerPoiGet,
} from "../adapters/PoiAdapter";
import { getAdapter as getPoiCategoryAdapter } from "../adapters/PoiCategoryAdapter";
import type ApiBase from "../apiBase";
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
  PathSearch,
  Paths,
  Poi,
  PoiCategory,
  PoiCategoryForm,
  PoiCreateForm,
  PoiSearch,
  PoiUpdateForm,
} from "../types/cartography";
import type { ID, Organization, Paginated, UUID } from "../types/models";

/**
 * Service that exposes the cartography domain.
 *
 * Represents the CartographyAPI class that provides methods for
 * listing/creating/updating/deleting buildings, floors, geofences, POIs, paths, and POI categories.
 **/
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
   * Retrieves a list of buildings.
   *
   * @param {Object} params - The parameters for the request.
   * @param {string} [params.view="compact"] - The view of the buildings.
   * @returns Promise<readonly BuildingListElement[]> - A promise that resolves to a list of building list elements.
   */
  getBuildings(
    params: { view?: "compact" } = {},
  ): Promise<readonly BuildingListElement[]> {
    if (this.apiBase.getConfiguration().compact) {
      params.view = "compact";
    }

    return this.apiBase
      .get<BuildingListElement[]>({
        params,
        url: "/api/v1/buildings",
      })
      .then((buildingList) =>
        buildingList.map((building: Record<string, unknown>) =>
          getBuildingAdapter(building),
        ),
      );
  }

  /**
   * Returns the building information for a given ID.
   *
   * @param {ID} buildingId - The ID of the building to fetch.
   * @param {Object} [params] - The parameters for the request.
   * @param {string} [params.view="compact"] - The view of the building.
   * @returns Promise<Building> - A promise that resolves to the building information.
   */
  getBuildingById(
    buildingId: ID,
    params: { view?: "compact" } = {},
  ): Promise<Building> {
    if (this.apiBase.getConfiguration().compact) {
      params.view = "compact";
    }

    return this.apiBase
      .get<Building>({
        params,
        url: `/api/v1/buildings/${buildingId}`,
      })
      .then(getBuildingAdapter);
  }

  /**
   * Retrieves the current organization from the API.
   *
   * @returns Promise<Organization> A promise that resolves to the current organization.
   */
  getCurrentOrganization(): Promise<Organization> {
    return this.apiBase
      .get<Organization>({
        url: "/api/v1/organizations/current_organization",
      })
      .then((org) =>
        getCurrentOrganizationAdapter(org, this.apiBase.getDomain()),
      );
  }

  /**
   * Updates a building given its id and the information to update
   *
   * @param {ID} buildingId - the building id to update
   * @param {Partial<BuildingForm>} buildingForm - the building information to use
   * @returns Promise<BuildingListElement> A promise that resolves to the updated building
   */
  patchBuilding(
    buildingId: ID,
    buildingForm: BuildingForm,
  ): Promise<BuildingListElement> {
    return this.apiBase
      .put<Building>({
        body: buildingForm,
        url: `/api/v1/buildings/${buildingId}`,
      })
      .then(getBuildingAdapter);
  }
  /**
   * Creates a new building in the API.
   *
   * @param {BuildingForm} buildingForm - The building information used to create it.
   * @returns Promise<BuildingListElement> A promise that resolves to the created building.
   */
  createBuilding(buildingForm: BuildingForm): Promise<BuildingListElement> {
    return this.apiBase
      .post<Building>({
        body: buildingForm,
        url: "/api/v1/buildings",
      })
      .then(getBuildingAdapter);
  }

  /**
   * Deletes a building given its id
   *
   * @param {ID} buildingId - The building id to delete
   * @returns Promise<void> A promise that resolves after deleting the building
   */
  deleteBuilding(buildingId: ID): Promise<void> {
    return this.apiBase.delete({
      url: `/api/v1/buildings/${buildingId}`,
    });
  }

  /**
   * Returns a list of floors given a search criteria
   *
   * @param {FloorSearch} params - the list of parameters to filter the response
   * @returns Promise<readonly Floor[]> A promise that resolves to a list of floors
   */
  getFloors(params: FloorSearch = {}): Promise<readonly Floor[]> {
    const url =
      params.buildingId > 0
        ? `/api/v1/buildings/${params.buildingId}/floors`
        : `/api/v1/floors`;

    return this.apiBase
      .get<Floor[]>({ url })
      .then((buildingFloors) =>
        buildingFloors.map((floor) => getFloorAdapter(floor)),
      );
  }

  /**
   * Retrieves a floor by its ID.
   *
   * @param {ID} floorId - The ID of the floor to retrieve
   * @returns Promise<Floor> A promise that resolves to the retrieved floor
   */
  getFloorById(floorId: ID): Promise<Floor> {
    return this.apiBase
      .get<Floor>({
        url: `/api/v1/floors/${floorId}`,
      })
      .then(getFloorAdapter);
  }

  /**
   * Updates a floor given its id and the information to update
   *
   * @param {ID} floorId - the floor id to update
   * @param {Partial<FloorForm>} floorForm - the floor information to use
   * @returns Promise<Floor> Promise that resolves to the updated floor
   */
  patchFloor(floorId: ID, floorForm: FloorForm): Promise<Floor> {
    return this.apiBase
      .put<Floor>({
        body: floorForm,
        url: `/api/v1/floors/${floorId}`,
      })
      .then(getFloorAdapter);
  }

  /**
   * Creates a new floor
   *
   * @param {FloorForm} floorForm - The floor information used to create it
   * @returns Promise<Floor> Promise that resolves to the created floor
   */
  createFloor(floorForm: FloorForm): Promise<Floor> {
    return this.apiBase
      .post<Floor>({
        body: floorForm,
        url: "/api/v1/floors",
      })
      .then(getFloorAdapter);
  }

  /**
   * Deletes a floor given its ID.
   *
   * @param {ID} floorId - The ID of the floor to delete
   * @returns Promise<void> Promise that resolves once the floor is deleted
   */
  deleteFloor(floorId: ID) {
    return this.apiBase.delete({ url: `/api/v1/floors/${floorId}` });
  }

  /**
   * Retrieves a paginated list of geofences based on the provided search parameters.
   * If no organizationId is provided in the search parameters, it retrieves the organizationId from the JWT.
   *
   * @param {GeofenceSearch} [params={}] - The search parameters for the geofences.
   * @returns Promise<Paginated<Geofence>> A promise that resolves to a paginated list of geofences.
   */
  async getGeofences(
    params: GeofenceSearch = {},
  ): Promise<Paginated<Geofence>> {
    const authSession = await this.apiBase.getAuthSession();
    if (!params.organizationId) {
      params.organizationId = authSession.organizationId;
    }

    return this.apiBase
      .get<Paginated<Geofence>>({
        params: params,
        url: "/api/v1/geofences/search",
      })
      .then((result) => ({
        data: result.data.map((geofence: Record<string, unknown>) =>
          getGeofenceAdapter(geofence),
        ),
        metadata: result.metadata,
      }));
  }

  /**
   * Retrieves a geofence by its ID.
   *
   * @param {UUID} geofenceId - The ID of the geofence to retrieve.
   * @returns Promise<Geofence> - A Promise that resolves to the retrieved geofence.
   */
  getGeofenceById(geofenceId: UUID): Promise<Geofence> {
    return this.apiBase
      .get<Geofence>({
        url: `/api/v1/geofences/${geofenceId}`,
      })
      .then(getGeofenceAdapter);
  }

  /**
   * Updates a geofence with the specified ID using the provided data.
   *
   * @param {UUID} geofenceId - The ID of the geofence to update.
   * @param {Partial<GeofenceForm>} geofenceForm - The partial data to update the geofence with.
   * @returns Promise<Geofence> - A Promise that resolves to the updated geofence.
   */
  patchGeofence(
    geofenceId: UUID,
    geofenceForm: Partial<GeofenceForm>,
  ): Promise<Geofence> {
    return this.apiBase
      .put<Geofence>({
        body: geofenceForm,
        url: `/api/v1/geofences/${geofenceId}`,
      })
      .then(getGeofenceAdapter);
  }

  /**
   * Creates a new geofence.
   *
   * @param {GeofenceForm} geofenceForm - The geofence information used to create it.
   * @returns Promise<Geofence> A Promise that resolves to the created geofence.
   */
  createGeofence(geofenceForm: GeofenceForm): Promise<Geofence> {
    return this.apiBase
      .post<Geofence>({
        body: geofenceForm,
        url: "/api/v1/geofences",
      })
      .then(getGeofenceAdapter);
  }

  /**
   * Deletes a geofence by its ID.
   *
   * @param {UUID} geofenceId - The ID of the geofence to delete.
   * @returns Promise<void>
   */
  deleteGeofence(geofenceId: UUID) {
    return this.apiBase.delete({ url: `/api/v1/geofences/${geofenceId}` });
  }

  /**
   * Retrieves paths based on the provided parameters.
   *
   * @param {PathSearch} params - The search parameters for fetching paths.
   * @returns Promise<Paths[]> - A Promise that resolves to an array of paths.
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
   * @param {number} buildingId - the building id to update paths from
   * @param {Paths} pathForm - the path information to use
   * @returns Promise<Paths>
   */
  patchPath(buildingId: number, pathForm: Paths): Promise<Paths> {
    return this.apiBase.put<Paths>({
      body: pathForm,
      url: `/api/v1/buildings/${buildingId}/paths`,
    });
  }

  /**
   * Retrieves a list of Poi objects based on the provided search parameters.
   *
   * @param {PoiSearch} [params] - Optional search parameters to filter the Poi objects.
   * @returns Promise<Poi[]> - A Promise that resolves to an array of Poi objects.
   */
  async getPois(params: PoiSearch = {}): Promise<Poi[]> {
    const url =
      params.buildingId && params.buildingId > 0
        ? `/api/v1/buildings/${params.buildingId}/pois`
        : `/api/v1/pois`;

    if (this.apiBase.getConfiguration().compact) {
      params.view = "compact";
    }

    if (params.buildingId) {
      delete params.buildingId;
    }

    return this.apiBase
      .get<ServerPoiGet[]>({ params, url })
      .then((pois) => pois.map(getPoiAdapter));
  }

  /**
   * Updates a POI (Point of Interest) with the given ID using the provided form data.
   *
   * @param {number} poiId - The ID of the POI to update.
   * @param {PoiUpdateForm} poiForm - The form data containing the updated POI information.
   * @returns Promise<Poi> A Promise that resolves to the updated POI object.
   */
  patchPoi(poiId: number, poiForm: PoiUpdateForm): Promise<Poi> {
    return this.apiBase
      .put<Poi>({
        body: poiForm,
        url: `/api/v1/pois/${poiId}`,
      })
      .then(getPoiAdapter);
  }

  /**
   * Creates a new POI
   *
   * @param {PoiCreateForm} poiForm - The poi information used to create it
   * @returns Promise<Poi> A Promise that resolves to the created POI object.
   */
  createPoi(poiForm: PoiCreateForm): Promise<Poi> {
    return this.apiBase
      .post<Poi>({
        body: poiForm,
        url: "/api/v1/pois",
      })
      .then(getPoiAdapter);
  }

  /**
   * Deletes a POI given its id.
   *
   * @param {number} poiId - The POI id to delete.
   * @returns Promise<void> A Promise that resolves to void.
   */
  deletePoi(poiId: number): Promise<void> {
    return this.apiBase.delete({ url: `/api/v1/pois/${poiId}` });
  }

  /**
   * Creates an array of POIs in bulk.
   *
   * @param {PoiCreateForm[]} pois - An array of POI objects to create.
   * @returns Promise<Poi[]> A Promise that resolves to an array of created POIs.
   */
  createPoisBulk(pois: PoiCreateForm[]): Promise<Poi[]> {
    return this.apiBase
      .post<Poi[]>({
        body: pois,
        url: "/api/v1/pois_bulk",
      })
      .then((createdPois) => createdPois.map(getPoiAdapter));
  }

  /**
   * Updates an array of POIs in bulk.
   *
   * @param {PoiUpdateForm[]} poiUpdateForms - An array of POI update forms.
   * @returns Promise<Poi[]> An array of Promises that resolves to an array of
   *                          updated POIs or reject if the update has failed.
   */
  patchPoisBulk(
    poiUpdateForms: (PoiUpdateForm & { id: number })[],
  ): Promise<Poi[]> {
    const updates = poiUpdateForms.map((form) => {
      const id = form.id;
      delete form.id;
      const info = form;

      return this.patchPoi(id, info);
    });

    return Promise.all(updates);
  }

  /**
   * Deletes an array of POIs in batch.
   *
   * @param {number[]} poiIds - An array of POI ids to delete.
   * @returns Promise<void[]> A Promise that resolves to void.
   */

  // biome-ignore lint/suspicious/noConfusingVoidType: This is fine, it's a Promise<void[]>
  deletePoisBulk(poiIds: number[]): Promise<void[]> {
    const deletions = poiIds.map((poiId) =>
      this.apiBase.delete({ url: `/api/v1/pois/${poiId}` }),
    );

    return Promise.all(deletions);
  }

  /**
   * Retrieves a list of POI categories.
   *
   * @returns Promise<PoiCategory[]> A Promise that resolves to an array of POICategory objects.
   */
  getPoiCategories(): Promise<PoiCategory[]> {
    return this.apiBase
      .get<PoiCategory[]>({
        url: "/api/v1/poi_categories",
      })
      .then((poiCategories) =>
        poiCategories.map((p) =>
          getPoiCategoryAdapter(p, this.apiBase.getDomain()),
        ),
      );
  }

  /**
   * Patches a POI category.
   *
   * @param {number} poiCategoryId - The ID of the POI category to patch.
   * @param {Partial<PoiCategoryForm>} poiCategoryForm - The partial POI category form.
   * @returns Promise<PoiCategory> A promise that resolves to the updated POI category.
   */
  patchPoiCategory(
    poiCategoryId: number,
    poiCategoryForm: Partial<PoiCategoryForm>,
  ): Promise<PoiCategory> {
    return this.apiBase.put<PoiCategory>({
      body: poiCategoryForm,
      url: `/api/v1/poi_categories/${poiCategoryId}`,
    });
  }

  /**
   * Creates a new POI category.
   *
   * @param {PoiCategoryForm} poiCategoryForm - The form data for the POI category to be created.
   * @returns Promise<PoiCategory> A promise that resolves to the created POI category.
   */
  createPoiCategory(poiCategoryForm: PoiCategoryForm): Promise<PoiCategory> {
    return this.apiBase.post<PoiCategory>({
      body: poiCategoryForm,
      url: "/api/v1/poi_categories",
    });
  }

  /**
   * Deletes a POI category.
   *
   * @param {number} poiCategoryId - The ID of the POI category to delete.
   * @returns void A Promise that resolves when the deletion is successful.
   */
  deletePoiCategory(poiCategoryId: number) {
    return this.apiBase.delete({
      url: `/api/v1/poi_categories/${poiCategoryId}`,
    });
  }
}
