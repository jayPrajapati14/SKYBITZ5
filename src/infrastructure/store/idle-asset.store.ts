import { getCurrentUserId } from "@/domain/services/user/user.service";
import { createFilterStore } from "./create-filter-store";
import isEqual from "lodash/isEqual";
import { CombinedCountFilters } from "./create-filter-store";

const VERSION = 7;

const initialFilterState: IdleAssetFilters = {
  asset: {
    types: [],
    ids: [],
    excludedIds: [],
    byTextSearch: "",
  },
  location: {
    types: [],
    names: [],
    groups: [],
    countries: [],
    states: [],
    zipCode: undefined,
  },
  sensor: {
    cargoStatuses: [],
    volumetricStatuses: [],
    motionStatuses: ["IDLE"],
  },
  operational: {
    assetLocationType: undefined,
    idleTime: undefined,
    lastReported: 28,
  },
  display: {},
};

const userId = getCurrentUserId();
const combinedCountFilters: CombinedCountFilters<IdleAssetFilters> = {
  sensor: ["cargoStatuses", "volumetricStatuses"],
};

const useIdleAssetStore = createFilterStore<IdleAssetFilters>(
  VERSION,
  `${userId}:idle-asset-filters`,
  initialFilterState,
  [],
  combinedCountFilters
);

export const useIdleAssetFilterBar = () => useIdleAssetStore((state) => state.showFilterBar);

export const useIdleAssetRecentFilters = () => useIdleAssetStore((state) => state.recentFilters);

export const useIdleAssetFilters = (selectFromView = false) =>
  useIdleAssetStore(({ viewFilters, baseFilters }) => (selectFromView ? viewFilters : baseFilters));

export const useIdleAssetFiltersEqual = () =>
  useIdleAssetStore((state) => {
    return isEqual(state.baseFilters, state.viewFilters);
  });

export const useIdleAssetActions = (selectFromView = false) =>
  useIdleAssetStore((state) => ({
    ...state.actions,
    setFilter: selectFromView ? state.actions.setViewFilter : state.actions.setBaseFilter,
    getFilterCounts: () => state.actions.getFilterCounts(selectFromView),
    resetViewFilters: (useTemporal?: boolean) => state.actions.resetViewFilters(useTemporal),
  }));

export const useIdleAssetFiltersCounts = (selectFromView = false) =>
  useIdleAssetStore((state) => state.actions.getFilterCounts(selectFromView));

export const useIdleAssetPaginationModel = () => useIdleAssetStore((state) => state.paginationModel);
