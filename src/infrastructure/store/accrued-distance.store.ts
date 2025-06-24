import { getCurrentUserId } from "@/domain/services/user/user.service";
import { createFilterStore } from "./create-filter-store";

// Version number used to invalidate cached data between different versions.
// Increment this number when making breaking changes or structural modifications
// to invalidate cached data and force a fresh state.
const VERSION = 1;

const initialFilterState: AccruedDistanceFilters = {
  asset: {},
  operational: {
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 7)),
      to: new Date(),
    },
  },
  display: {},
};

const userId = getCurrentUserId();

const useAccruedDistanceStore = createFilterStore<AccruedDistanceFilters>(
  VERSION,
  `${userId}:accrued-distance-filters`,
  initialFilterState
);

export const useAccruedDistanceFilterBar = () => useAccruedDistanceStore((state) => state.showFilterBar);
export const useAccruedDistanceRecentFilters = () => useAccruedDistanceStore((state) => state.recentFilters);

// Get filter view or base filters based on selectFromView flag
export const useAccruedDistanceFilters = (selectFromView = false) =>
  useAccruedDistanceStore((state) => (selectFromView ? state.viewFilters : state.baseFilters));

// Get actions based on selectFromView flag
export const useAccruedDistanceActions = (selectFromView = false) =>
  useAccruedDistanceStore((state) => ({
    ...state.actions,
    setFilter: selectFromView ? state.actions.setViewFilter : state.actions.setBaseFilter,
    getFilterCounts: () => state.actions.getFilterCounts(selectFromView),
    resetViewFilters: (useTemporal?: boolean) => state.actions.resetViewFilters(useTemporal),
  }));

// Get filter counts based on selectFromView flag
export const useAccruedDistanceFiltersCounts = (selectFromView = false) =>
  useAccruedDistanceStore((state) => state.actions.getFilterCounts(selectFromView));

export const useAccruedDistancePaginationModel = () => useAccruedDistanceStore((state) => state.paginationModel);
