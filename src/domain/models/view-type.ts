export const viewTypes = [
  "yard-check",
  "accrued-distance",
  "reports",
  "generic-assets",
  "dashboards",
  "idle-assets",
  "moving-assets",
] as const;
declare global {
  export type ViewType = (typeof viewTypes)[number];
}
