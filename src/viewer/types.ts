import { UUID } from "../types";

export interface ViewerOptions {
  domElement: HTMLElement;
  profile?: string;
  apiKey?: string;
}

export interface RTDataCustomizers {
  deviceId: UUID;
  tooltip?: string;
  iconUrl?: string;
}
