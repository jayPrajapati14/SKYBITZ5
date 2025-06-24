import { useIdleAssetActions, useIdleAssetFilters, useIdleAssetRecentFilters } from "@/store/idle-asset.store";
import { AssetFilterIds } from "@/components/filters/form-controls/asset-filter-ids";
import { AssetFilterTypes } from "@/components/filters/form-controls/asset-filter-types";

type FiltersProps = {
  view: Extract<ViewType, "idle-assets" | "dashboards">;
};

export function AssetFilters({ view }: FiltersProps) {
  const { asset } = useIdleAssetFilters(view === "idle-assets");
  const recents = useIdleAssetRecentFilters();

  const { setFilter, setRecentFilter, setPinnedFilter, isFilterPinned } = useIdleAssetActions(view === "idle-assets");

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <AssetFilterIds
        ids={asset.ids ?? []}
        recentIds={recents.asset.ids ?? []}
        onChange={(ids) => setFilter("asset", "ids", ids)}
        onBlur={(ids) => setRecentFilter("asset", "ids", ids)}
        isPinned={isFilterPinned("asset", "ids")}
        onPinChange={view === "idle-assets" ? (status) => setPinnedFilter("asset", "ids", status) : undefined}
      />
      <AssetFilterTypes
        types={asset.types ?? []}
        recentTypes={recents.asset.types ?? []}
        onChange={(types) => setFilter("asset", "types", types)}
        onBlur={(types) => setRecentFilter("asset", "types", types)}
        isPinned={isFilterPinned("asset", "types")}
        onPinChange={view === "idle-assets" ? (status) => setPinnedFilter("asset", "types", status) : undefined}
      />
    </div>
  );
}
