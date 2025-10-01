import type { UUID } from "../types";

export interface ViewerOptions {
  domElement: HTMLElement;
  profile?: string;
  apiKey?: string;
}

export interface RTDataCustomizer {
  deviceId: UUID;
  tooltip?: string;
  iconUrl?: string;
}
