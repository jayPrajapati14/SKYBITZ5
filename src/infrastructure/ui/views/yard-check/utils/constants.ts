import { orange, blue, red } from "@mui/material/colors";

export const DEFAULT_MAP_ZOOM = 11;
export const CLUSTER_MAX_ZOOM = 16;
export const CLUSTER_RADIUS = 40;
export const CLUSTER_BUFFER = 128;
export const IDLE_ASSET_COLOR = {
  HIGH: red[500], // 7+ days
  MID: orange[400], // 3-7 days
  LOW: blue[400], // 0-3 days
} as const;
export const DEFAULT_MAP = {
  ZOOM: 4,
  LATITUDE: 39.8283,
  LONGITUDE: -98.5795,
} as const;
