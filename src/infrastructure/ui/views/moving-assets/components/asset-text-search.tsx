import { useMovingAssetActions, useMovingAssetFilters } from "@/store/moving-asset.store";
import { AssetTextSearch } from "@/components/filters/form-controls/asset-filter-text-search";

type FiltersProps = {
  view: Extract<ViewType, "moving-assets" | "dashboards">;
};

export function AssetTextSearchFilter({ view }: FiltersProps) {
  const filters = useMovingAssetFilters(view === "moving-assets");
  const { setFilter, setPinnedFilter, isFilterPinned } = useMovingAssetActions(view === "moving-assets");

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
