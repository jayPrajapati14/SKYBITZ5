import { useMovingAssetActions, useMovingAssetFilters, useMovingAssetRecentFilters } from "@/store/moving-asset.store";
import { AssetFilterIds } from "@/components/filters/form-controls/asset-filter-ids";
import { AssetFilterTypes } from "@/components/filters/form-controls/asset-filter-types";

type FiltersProps = {
  view: Extract<ViewType, "moving-assets" | "dashboards">;
};

export function AssetFilters({ view }: FiltersProps) {
  const { asset } = useMovingAssetFilters(view === "moving-assets");
  const recents = useMovingAssetRecentFilters();

  const { setFilter, setRecentFilter, setPinnedFilter, isFilterPinned } = useMovingAssetActions(
    view === "moving-assets"
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <AssetFilterIds
        ids={asset.ids ?? []}
        recentIds={recents.asset.ids ?? []}
        onChange={(ids) => setFilter("asset", "ids", ids)}
        onBlur={(ids) => setRecentFilter("asset", "ids", ids)}
        isPinned={isFilterPinned("asset", "ids")}
        onPinChange={view === "moving-assets" ? (status) => setPinnedFilter("asset", "ids", status) : undefined}
      />
      <AssetFilterTypes
        types={asset.types ?? []}
        recentTypes={recents.asset.types ?? []}
        onChange={(types) => setFilter("asset", "types", types)}
        onBlur={(types) => setRecentFilter("asset", "types", types)}
        isPinned={isFilterPinned("asset", "types")}
        onPinChange={view === "moving-assets" ? (status) => setPinnedFilter("asset", "types", status) : undefined}
      />
    </div>
  );
}
