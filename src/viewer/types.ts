import type { ID, UUID } from "../types";

export interface ViewerOptions {
  domElement: HTMLElement;
  profile?: string;
  apiKey?: string;
  buildingId?: ID;
  deviceID?: string;
  fixedPoiID?: ID;
}

export interface RTDataCustomizer {
  deviceId: UUID;
  tooltip?: string;
  iconUrl?: string;
}
