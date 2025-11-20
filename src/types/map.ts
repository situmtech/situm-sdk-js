import type { LatLng } from "./coordinates";

interface Camera {
  zoom: number | null;
  bearing: number | null;
  pitch: number | null;
  transitionDuration: number | null;
  center: LatLng | null;
}

export type { Camera };
