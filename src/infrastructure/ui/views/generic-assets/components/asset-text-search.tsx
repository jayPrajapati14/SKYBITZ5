import { useGenericAssetActions, useGenericAssetFilters } from "@/store/generic-asset.store";
import { AssetTextSearch } from "@/components/filters/form-controls/asset-filter-text-search";

type FiltersProps = {
  view: Extract<ViewType, "generic-assets" | "dashboards">;
};

export function AssetTextSearchFilter({ view }: FiltersProps) {
  const filters = useGenericAssetFilters(view === "generic-assets");
  const { setFilter, setPinnedFilter, isFilterPinned } = useGenericAssetActions(view === "generic-assets");

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
