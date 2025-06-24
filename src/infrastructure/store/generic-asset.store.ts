import isEqual from "lodash/isEqual";
import { getCurrentUserId } from "@/domain/services/user/user.service";
import { createFilterStore } from "./create-filter-store";
import { CombinedCountFilters } from "./create-filter-store";

const VERSION = 6;

const initialFilterState: GenericAssetFilters = {
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
    motionStatuses: [],
  },
  operational: {
    assetLocationType: undefined,
    idleTime: undefined,
    lastReported: 28,
  },
  display: {},
};

const userId = getCurrentUserId();
const combinedCountFilters: CombinedCountFilters<GenericAssetFilters> = {
  sensor: ["cargoStatuses", "volumetricStatuses"],
};

const useGenericAssetStore = createFilterStore<GenericAssetFilters>(
  VERSION,
  `${userId}:generic-asset-filters`,
  initialFilterState,
  [],
  combinedCountFilters
);

export const useGenericAssetFilterBar = () => useGenericAssetStore((state) => state.showFilterBar);

export const useGenericAssetRecentFilters = () => useGenericAssetStore((state) => state.recentFilters);

export const useGenericAssetFilters = (selectFromView = false) =>
  useGenericAssetStore(({ viewFilters, baseFilters }) => (selectFromView ? viewFilters : baseFilters));

export const useGenericAssetFiltersEqual = () =>
  useGenericAssetStore((state) => {
    console.info(state.baseFilters, state.viewFilters);
    return isEqual(state.baseFilters, state.viewFilters);
  });

export const useGenericAssetActions = (selectFromView = false) =>
  useGenericAssetStore((state) => ({
    ...state.actions,
    setFilter: selectFromView ? state.actions.setViewFilter : state.actions.setBaseFilter,
    getFilterCounts: () => state.actions.getFilterCounts(selectFromView),
    resetViewFilters: (useTemporal?: boolean) => state.actions.resetViewFilters(useTemporal),
  }));

export const useGenericAssetFiltersCounts = (selectFromView = false) =>
  useGenericAssetStore((state) => state.actions.getFilterCounts(selectFromView));

export const useGenericAssetPaginationModel = () => useGenericAssetStore((state) => state.paginationModel);
