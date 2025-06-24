import { useIdleAssetActions, useIdleAssetFilters } from "@/store/idle-asset.store";
import { AssetTextSearch } from "@/components/filters/form-controls/asset-filter-text-search";

type FiltersProps = {
  view: Extract<ViewType, "idle-assets" | "dashboards">;
};

export function AssetTextSearchFilter({ view }: FiltersProps) {
  const filters = useIdleAssetFilters(view === "idle-assets");
  const { setFilter, setPinnedFilter, isFilterPinned } = useIdleAssetActions(view === "idle-assets");

  return (
    <AssetTextSearch
      label="Filter By Text Search"
      placeholder="Search Assets"
      byTextSearch={filters.asset.byTextSearch}
      onChange={(asset) => setFilter("asset", "byTextSearch", asset)}
      isPinned={isFilterPinned("asset", "byTextSearch")}
      onPinChange={(status) => setPinnedFilter("asset", "byTextSearch", status)}
    />
  );
}
