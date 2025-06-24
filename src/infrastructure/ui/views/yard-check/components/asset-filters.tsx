import { useYardCheckActions, useYardCheckFilters, useYardCheckRecentFilters } from "@/store/yard-check.store";
// import { AssetFilterExcludeIds } from "@/components/filters/form-controls/asset-filter-exclude-ids";
import { AssetFilterIds } from "@/components/filters/form-controls/asset-filter-ids";
import { AssetFilterTypes } from "@/components/filters/form-controls/asset-filter-types";

type FiltersProps = {
  view: Extract<ViewType, "yard-check" | "dashboards">;
};

export function AssetFilters({ view }: FiltersProps) {
  const { asset } = useYardCheckFilters(view === "yard-check");
  const recents = useYardCheckRecentFilters();

  const { setFilter, setRecentFilter, setPinnedFilter, isFilterPinned } = useYardCheckActions(view === "yard-check");

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <AssetFilterTypes
        types={asset.types ?? []}
        recentTypes={recents.asset.types ?? []}
        onChange={(types) => setFilter("asset", "types", types)}
        onBlur={(types) => setRecentFilter("asset", "types", types)}
        isPinned={isFilterPinned("asset", "types")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("asset", "types", status) : undefined}
      />
      <AssetFilterIds
        ids={asset.ids ?? []}
        recentIds={recents.asset.ids ?? []}
        onChange={(ids) => setFilter("asset", "ids", ids)}
        onBlur={(ids) => setRecentFilter("asset", "ids", ids)}
        isPinned={isFilterPinned("asset", "ids")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("asset", "ids", status) : undefined}
      />
      {/* <AssetFilterExcludeIds
        ids={asset.excludedIds ?? []}
        recentIds={recents.asset.excludedIds ?? []}
        onChange={(ids) => setFilter("asset", "excludedIds", ids)}
        onBlur={(ids) => setRecentFilter("asset", "excludedIds", ids)}
        isPinned={isFilterPinned("asset", "excludedIds")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("asset", "excludedIds", status) : undefined}
      /> */}
    </div>
  );
}
