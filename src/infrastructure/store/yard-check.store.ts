import isEqual from "lodash/isEqual";
import { getCurrentUserId } from "@/domain/services/user/user.service";
import { createFilterStore } from "./create-filter-store";
import { CombinedCountFilters } from "./create-filter-store";

// Version number used to invalidate cached data between different versions.
// Increment this number when making breaking changes or structural modifications
// to invalidate cached data and force a fresh state.
const VERSION = 8;

const initialFilterState: YardCheckFilters = {
  landmark: {
    types: [],
    names: [],
    groups: [],
  },
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
    assetLocationType: "AT_LANDMARK",
    idleTime: undefined,
    lastReported: 28,
  },
  display: {},
};

const userId = getCurrentUserId();
const combinedCountFilters: CombinedCountFilters<YardCheckFilters> = {
  sensor: ["cargoStatuses", "volumetricStatuses"],
};

const useYardCheckStore = createFilterStore<YardCheckFilters>(
  VERSION,
  `${userId}:yard-check-filters`,
  initialFilterState,
  [],
  combinedCountFilters
);

export const useYardCheckFilterBar = () => useYardCheckStore((state) => state.showFilterBar);

export const useYardCheckRecentFilters = () => useYardCheckStore((state) => state.recentFilters);

// Get filter view or base filters based on selectFromView flag
export const useYardCheckFilters = (selectFromView = false) =>
  useYardCheckStore(({ viewFilters, baseFilters }) => (selectFromView ? viewFilters : baseFilters));

export const useYardCheckFiltersEqual = () =>
  useYardCheckStore((state) => {
    return isEqual(state.baseFilters, state.viewFilters);
  });

// Get actions based on selectFromView flag
export const useYardCheckActions = (selectFromView = false) =>
  useYardCheckStore((state) => ({
    ...state.actions,
    setFilter: selectFromView ? state.actions.setViewFilter : state.actions.setBaseFilter,
    getFilterCounts: () => state.actions.getFilterCounts(selectFromView),
    resetViewFilters: (useTemporal?: boolean) => state.actions.resetViewFilters(useTemporal),
  }));

// Get filter counts based on selectFromView flag
export const useYardCheckFiltersCounts = (selectFromView = false) =>
  useYardCheckStore((state) => state.actions.getFilterCounts(selectFromView));

export const useYardCheckPaginationModel = () => useYardCheckStore((state) => state.paginationModel);
