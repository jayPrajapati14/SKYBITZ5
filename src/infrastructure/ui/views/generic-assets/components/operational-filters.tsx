import { OperationalFilterLandmark } from "@/components/filters/form-controls/operational-filter-landmark";
import { useGenericAssetActions } from "@/store/generic-asset.store";
import { useGenericAssetFilters } from "@/store/generic-asset.store";
import { OperationalFilterLastReported } from "@/components/filters/form-controls/operational-filter-last-reported";
import { OperationalFilterIdleTime } from "@/components/filters/form-controls/operational-filter-idle-time";

type FiltersProps = {
  view: Extract<ViewType, "generic-assets" | "dashboards">;
};

export function OperationalFilters({ view }: FiltersProps) {
  const { operational } = useGenericAssetFilters(view === "generic-assets");
  const { setFilter, setPinnedFilter, isFilterPinned } = useGenericAssetActions(view === "generic-assets");

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <OperationalFilterLandmark
        assetLocationType={operational.assetLocationType}
        onChange={(assetLocationType) => setFilter("operational", "assetLocationType", assetLocationType)}
        isPinned={isFilterPinned("operational", "assetLocationType")}
        onPinChange={
          view === "generic-assets"
            ? (status) => setPinnedFilter("operational", "assetLocationType", status)
            : undefined
        }
      />
      <OperationalFilterIdleTime
        idleTime={operational.idleTime}
        onChange={(idleTime) => setFilter("operational", "idleTime", idleTime)}
        isPinned={isFilterPinned("operational", "idleTime")}
        onPinChange={
          view === "generic-assets" ? (status) => setPinnedFilter("operational", "idleTime", status) : undefined
        }
      />
      <OperationalFilterLastReported
        lastReported={operational.lastReported}
        onChange={(lastReported) => setFilter("operational", "lastReported", lastReported)}
        isPinned={isFilterPinned("operational", "lastReported")}
        onPinChange={
          view === "generic-assets" ? (status) => setPinnedFilter("operational", "lastReported", status) : undefined
        }
      />
    </div>
  );
}
