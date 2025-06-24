import { useMovingAssetActions } from "@/store/moving-asset.store";
import { useMovingAssetFilters } from "@/store/moving-asset.store";
import { OperationalFilterLastReported } from "@/components/filters/form-controls/operational-filter-last-reported";
import { OperationalFilterLandmark } from "@/components/filters/form-controls/operational-filter-landmark";

type FiltersProps = {
  view: Extract<ViewType, "moving-assets" | "dashboards">;
};

export function OperationalFilters({ view }: FiltersProps) {
  const { operational } = useMovingAssetFilters(view === "moving-assets");
  const { setFilter, setPinnedFilter, isFilterPinned } = useMovingAssetActions(view === "moving-assets");

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <OperationalFilterLandmark
        assetLocationType={operational.assetLocationType}
        onChange={(assetLocationType) => setFilter("operational", "assetLocationType", assetLocationType)}
        isPinned={isFilterPinned("operational", "assetLocationType")}
        onPinChange={
          view === "moving-assets" ? (status) => setPinnedFilter("operational", "assetLocationType", status) : undefined
        }
      />
      <OperationalFilterLastReported
        lastReported={operational.lastReported}
        onChange={(lastReported) => setFilter("operational", "lastReported", lastReported)}
        isPinned={isFilterPinned("operational", "lastReported")}
        onPinChange={
          view === "moving-assets" ? (status) => setPinnedFilter("operational", "lastReported", status) : undefined
        }
      />
    </div>
  );
}
