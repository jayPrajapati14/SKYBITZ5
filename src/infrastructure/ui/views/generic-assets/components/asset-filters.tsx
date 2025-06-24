import {
  useGenericAssetActions,
  useGenericAssetFilters,
  useGenericAssetRecentFilters,
} from "@/store/generic-asset.store";
import { AssetFilterIds } from "@/components/filters/form-controls/asset-filter-ids";
import { AssetFilterTypes } from "@/components/filters/form-controls/asset-filter-types";

type FiltersProps = {
  view: Extract<ViewType, "generic-assets" | "dashboards">;
};

export function AssetFilters({ view }: FiltersProps) {
  const { asset } = useGenericAssetFilters(view === "generic-assets");
  const recents = useGenericAssetRecentFilters();

  const { setFilter, setRecentFilter, setPinnedFilter, isFilterPinned } = useGenericAssetActions(
    view === "generic-assets"
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <AssetFilterIds
        ids={asset.ids ?? []}
        recentIds={recents.asset.ids ?? []}
        onChange={(ids) => setFilter("asset", "ids", ids)}
        onBlur={(ids) => setRecentFilter("asset", "ids", ids)}
        isPinned={isFilterPinned("asset", "ids")}
        onPinChange={view === "generic-assets" ? (status) => setPinnedFilter("asset", "ids", status) : undefined}
      />
      <AssetFilterTypes
        types={asset.types ?? []}
        recentTypes={recents.asset.types ?? []}
        onChange={(types) => setFilter("asset", "types", types)}
        onBlur={(types) => setRecentFilter("asset", "types", types)}
        isPinned={isFilterPinned("asset", "types")}
        onPinChange={view === "generic-assets" ? (status) => setPinnedFilter("asset", "types", status) : undefined}
      />
    </div>
  );
}
