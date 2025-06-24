import { useYardCheckActions, useYardCheckFilters } from "@/store/yard-check.store";
import { AssetTextSearch } from "@/components/filters/form-controls/asset-filter-text-search";

type FiltersProps = {
  view: Extract<ViewType, "yard-check" | "dashboards">;
};

export function AssetTextSearchFilter({ view }: FiltersProps) {
  const filters = useYardCheckFilters(view === "yard-check");
  const { setFilter, setPinnedFilter, isFilterPinned } = useYardCheckActions(view === "yard-check");

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
