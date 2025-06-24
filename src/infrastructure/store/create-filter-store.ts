import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { initialPaginationModel } from "./store.constants";
import { PaginationModel } from "./store.types";
import isEqual from "lodash/isEqual";

type GenericFilters = Record<string, Record<string, unknown>>;

export type PinnedFilter<T extends GenericFilters> = {
  [G in keyof T]: {
    group: G;
    filterType: keyof T[G];
  };
}[keyof T];

export type FiltersCount<F extends GenericFilters> = {
  [K in keyof F]: number;
};

export type FiltersCountWithTotal<F extends GenericFilters> = FiltersCount<F> & {
  total: number;
};

export type CombinedCountFilters<F extends GenericFilters> = {
  [G in keyof F]?: (keyof F[G])[];
};

export type FilterState<F extends GenericFilters> = {
  showFilterBar: boolean;
  recentFilters: F;
  baseFilters: F;
  viewFilters: F;
  pinnedFilters: Array<PinnedFilter<F>>;
  paginationModel: PaginationModel;
  actions: {
    toggleFilterBar: () => void;
    setBaseFilter: <G extends keyof F, FT extends keyof F[G]>(group: G, filterType: FT, value: F[G][FT]) => void;
    setViewFilter: <G extends keyof F, FT extends keyof F[G]>(group: G, filterType: FT, value: F[G][FT]) => void;
    saveBaseFilters: () => void;
    setRecentFilter: <G extends keyof F, FT extends keyof FilterState<F>["recentFilters"][G]>(
      group: G,
      filterType: FT,
      value: FilterState<F>["recentFilters"][G][FT]
    ) => void;
    resetBaseFilters: (newFilters?: F) => void;
    resetViewFilters: (useTemporal?: boolean) => void;
    getFilterCounts: (selectFromView?: boolean) => FiltersCountWithTotal<F>;
    setPinnedFilter: <G extends keyof F, FT extends keyof F[G]>(group: G, filterType: FT, value: boolean) => void;
    setPaginationModel: (model: PaginationModel) => void;
    isFilterPinned: <G extends keyof F, FT extends keyof F[G]>(group: G, filterType: FT) => boolean;
    filtersPinnedCount: () => number;
    emptyViewFilters: () => void;
    fillViewFilters: (newFilters?: F) => void;
    activeFiltersCount: <G extends keyof F, FT extends keyof F[G]>(group: G, filterType: FT) => number;
  };
};

function transformDates(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) return obj.map(transformDates);

  if (obj instanceof Date) return { _type: "date", value: obj.toISOString() };

  if (typeof obj === "object")
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, transformDates(value)]));

  return obj;
}

function restoreDates(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) return obj.map(restoreDates);

  if (typeof obj === "object") {
    if ("_type" in obj && "value" in obj && obj._type === "date" && typeof obj.value === "string") {
      return new Date(obj.value);
    }
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, restoreDates(value)]));
  }

  return obj;
}

/**
 * Creates a Zustand store for managing filters with persistence capabilities
 *
 * @param version - Version number used to invalidate cached data between
 *   different versions. When this number changes, Zustand will
 *   clear the persisted storage to prevent conflicts with
 *   potentially incompatible stored data structures
 *
 * @param storeKey - Unique identifier for the store in local storage, following
 *   the format `userId:filter-store-name`. This format allows
 *   different users to have their own filter states when
 *   using the same browser
 *
 * @param initialFilters - Initial state of filters. Defines the structure and
 *   default values for all filter groups
 *
 * @param initialPinnedFilters - Array of filters that should be pinned by
 *   default. Optional, defaults to empty array
 *
 * @returns A Zustand store with filter management functionality
 */
export const createFilterStore = <F extends GenericFilters>(
  version: number,
  storeKey: `${string}:${string}`,
  initialFilters: F,
  initialPinnedFilters: Array<PinnedFilter<F>> = [],
  combinedCountFilters: CombinedCountFilters<F> = {}
) => {
  const initialTemporalFilters = Object.fromEntries(
    Object.entries(initialFilters).map(([group, filters]) => [
      group,
      Object.fromEntries(
        Object.entries(filters).map(([key]) => [key, Array.isArray(initialFilters[group][key]) ? [] : null])
      ),
    ])
  ) as F;

  return create<FilterState<F>>()(
    persist(
      (set, get) => ({
        showFilterBar: true,
        baseFilters: structuredClone(initialFilters),
        viewFilters: structuredClone(initialFilters),
        recentFilters: structuredClone(initialFilters),
        pinnedFilters: structuredClone(initialPinnedFilters),
        paginationModel: structuredClone(initialPaginationModel),
        sortModel: [],
        actions: {
          toggleFilterBar: () => set((state) => ({ showFilterBar: !state.showFilterBar })),
          setBaseFilter: (group, filterType, value) =>
            set((state) => ({
              baseFilters: {
                ...state.baseFilters,
                [group]: {
                  ...state.baseFilters[group],
                  [filterType]: value,
                },
              },
            })),
          setViewFilter: (group, filterType, value) =>
            set((state) => ({
              viewFilters: {
                ...state.viewFilters,
                [group]: {
                  ...state.viewFilters[group],
                  [filterType]: value,
                },
              },
              paginationModel: structuredClone(initialPaginationModel),
            })),
          setRecentFilter: (group, filterType, value) =>
            set((state) => {
              const currentValues = (state.recentFilters[group]?.[filterType] || []) as unknown[];
              const newValues = Array.isArray(value)
                ? [...value, ...currentValues].slice(0, 5)
                : [value, ...currentValues].slice(0, 5);

              return {
                recentFilters: {
                  ...state.recentFilters,
                  [group]: { ...state.recentFilters[group], [filterType]: newValues },
                },
              };
            }),
          setPinnedFilter: (group, filterType, value) =>
            set((state) => {
              if (value) {
                if (!state.pinnedFilters.some((f) => f.group === group && f.filterType === filterType)) {
                  return {
                    pinnedFilters: [...state.pinnedFilters, { group, filterType } as PinnedFilter<F>],
                  };
                }
              } else {
                return {
                  pinnedFilters: state.pinnedFilters.filter((f) => !(f.group === group && f.filterType === filterType)),
                };
              }
              return state;
            }),
          saveBaseFilters: () => {
            set((state) => ({
              baseFilters: structuredClone(state.viewFilters),
            }));
          },
          resetBaseFilters: (newFilters = initialFilters) =>
            set(() => ({
              baseFilters: structuredClone(newFilters),
            })),
          emptyViewFilters: () =>
            set(() => ({
              viewFilters: structuredClone(initialTemporalFilters),
            })),
          fillViewFilters: (newFilters = initialFilters) =>
            set(() => ({
              viewFilters: { ...newFilters },
            })),
          resetViewFilters: (useInitial = false) =>
            set((state) => ({
              viewFilters: structuredClone(useInitial ? initialFilters : state.baseFilters),
              paginationModel: structuredClone(initialPaginationModel),
            })),
          isFilterPinned: (group, filterType) =>
            get().pinnedFilters.some((f) => f.group === group && f.filterType === filterType),
          getFilterCounts: (selectFromView = false) => {
            const state = get();
            const filters = selectFromView ? state.viewFilters : state.baseFilters;

            const counts = Object.fromEntries(
              Object.keys(filters).map((filterKey: keyof F) => [filterKey, 0])
            ) as FiltersCount<F>;

            for (const group of Object.keys(counts) as Array<keyof FiltersCount<F>>) {
              if (group === "display") continue;
              const groupFilters = filters[group];
              const defaultFilters = initialFilters[group];
              const combinedDefaults = combinedCountFilters[group] || [];
              // Check combined filters first
              const anyNonEmpty = combinedDefaults.some((filterType) => {
                const filterValue = groupFilters[filterType as keyof typeof groupFilters] as unknown;
                return (
                  (Array.isArray(filterValue) && filterValue.length > 0) ||
                  (typeof filterValue === "boolean" && filterValue !== undefined) ||
                  (typeof filterValue === "number" && filterValue > 0) ||
                  (typeof filterValue === "string" && filterValue.length > 0) ||
                  (typeof filterValue === "object" && filterValue !== null && Object.keys(filterValue).length > 0)
                );
              });
              if (anyNonEmpty) {
                counts[group] += 1;
              }

              // Track filters already counted in combined groups to avoid double-counting
              const countedFilters = new Set(combinedDefaults.flatMap((c) => c));

              for (const filterType in groupFilters) {
                // Skip if already counted in a combined group
                if (countedFilters.has(filterType)) continue;
                const filterValue = groupFilters[filterType];
                const defaultValue = defaultFilters[filterType];

                const shouldIncrement =
                  (filterValue != null && filterValue != "" && filterValue === defaultValue) ||
                  (Array.isArray(filterValue) && filterValue.length > 0 && isEqual(filterValue, defaultValue)) ||
                  (((!Array.isArray(filterValue) && filterValue != defaultValue) ||
                    (Array.isArray(filterValue) && !isEqual(filterValue, defaultValue))) &&
                    ((Array.isArray(filterValue) && filterValue.length > 0) ||
                      (typeof filterValue === "boolean" && filterValue !== undefined) ||
                      (typeof filterValue === "number" && filterValue > 0) ||
                      (typeof filterValue === "string" && filterValue.length > 0) ||
                      (typeof filterValue === "object" &&
                        filterValue !== null &&
                        Object.keys(filterValue).length > 0)));
                if (shouldIncrement) counts[group] += 1;
              }
            }

            return {
              ...counts,
              total: Object.values(counts).reduce((acc, curr) => acc + curr, 0),
            };
          },
          filtersPinnedCount: () => get().pinnedFilters.length,
          setPaginationModel: (paginationModel) => set(() => ({ paginationModel })),
          activeFiltersCount: (group, filterType) => {
            const state = get();
            const filters = state.viewFilters;
            const groupFilters = filters[group];
            const defaultFilters = initialFilters[group];
            const filterValue = groupFilters[filterType];
            const defaultValue = defaultFilters[filterType];

            if (
              (filterValue != null && filterValue != "" && filterValue === defaultValue) ||
              (Array.isArray(filterValue) && filterValue.length > 0 && isEqual(filterValue, defaultValue))
            ) {
              return 1;
            }
            if (isEqual(filterValue, defaultValue)) return 0;
            if (Array.isArray(filterValue)) return filterValue.length > 0 ? filterValue.length : 0;
            return filterValue !== undefined && filterValue !== null ? 1 : 0;
          },
        },
      }),
      {
        version,
        partialize: (state) => ({
          paginationModel: state.paginationModel,
          showFilterBar: state.showFilterBar,
          baseFilters: state.baseFilters,
          viewFilters: state.viewFilters,
          recentFilters: state.recentFilters,
          pinnedFilters: state.pinnedFilters,
        }),
        name: storeKey,
        serialize: (state) => JSON.stringify(transformDates(state)),
        deserialize: (str) => restoreDates(JSON.parse(str)) as StorageValue<FilterState<F>>,
      }
    )
  );
};
