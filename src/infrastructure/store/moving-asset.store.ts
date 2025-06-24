import { getCurrentUserId } from "@/domain/services/user/user.service";
import { createFilterStore } from "./create-filter-store";
import isEqual from "lodash/isEqual";
import { CombinedCountFilters } from "./create-filter-store";

const VERSION = 6;

const initialFilterState: MovingAssetFilters = {
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
    motionStatuses: ["MOVING"],
  },
  operational: {
    lastReported: 28,
    assetLocationType: undefined,
  },
  display: {},
};

const userId = getCurrentUserId();
const combinedCountFilters: CombinedCountFilters<MovingAssetFilters> = {
  sensor: ["cargoStatuses", "volumetricStatuses"],
};

const useMovingAssetStore = createFilterStore<MovingAssetFilters>(
  VERSION,
  `${userId}:moving-asset-filters`,
  initialFilterState,
  [],
  combinedCountFilters
);

export const useMovingAssetFilterBar = () => useMovingAssetStore((state) => state.showFilterBar);

export const useMovingAssetRecentFilters = () => useMovingAssetStore((state) => state.recentFilters);

export const useMovingAssetFilters = (selectFromView = false) =>
  useMovingAssetStore(({ viewFilters, baseFilters }) => (selectFromView ? viewFilters : baseFilters));

export const useMovingAssetFiltersEqual = () =>
  useMovingAssetStore((state) => {
    return isEqual(state.baseFilters, state.viewFilters);
  });

export const useMovingAssetActions = (selectFromView = false) =>
  useMovingAssetStore((state) => ({
    ...state.actions,
    setFilter: selectFromView ? state.actions.setViewFilter : state.actions.setBaseFilter,
    getFilterCounts: () => state.actions.getFilterCounts(selectFromView),
    resetViewFilters: (useTemporal?: boolean) => state.actions.resetViewFilters(useTemporal),
  }));

export const useMovingAssetFiltersCounts = (selectFromView = false) =>
  useMovingAssetStore((state) => state.actions.getFilterCounts(selectFromView));

export const useMovingAssetPaginationModel = () => useMovingAssetStore((state) => state.paginationModel);
