import { OperationalFilterLandmark } from "@/components/filters/form-controls/operational-filter-landmark";
import { useIdleAssetActions } from "@/store/idle-asset.store";
import { useIdleAssetFilters } from "@/store/idle-asset.store";
import { OperationalFilterLastReported } from "@/components/filters/form-controls/operational-filter-last-reported";
import { OperationalFilterIdleTime } from "@/components/filters/form-controls/operational-filter-idle-time";

type FiltersProps = {
  view: Extract<ViewType, "idle-assets" | "dashboards">;
};

export function OperationalFilters({ view }: FiltersProps) {
  const { operational } = useIdleAssetFilters(view === "idle-assets");
  const { setFilter, setPinnedFilter, isFilterPinned } = useIdleAssetActions(view === "idle-assets");

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <OperationalFilterLandmark
        assetLocationType={operational.assetLocationType}
        onChange={(assetLocationType) => setFilter("operational", "assetLocationType", assetLocationType)}
        isPinned={isFilterPinned("operational", "assetLocationType")}
        onPinChange={
          view === "idle-assets" ? (status) => setPinnedFilter("operational", "assetLocationType", status) : undefined
        }
      />
      <OperationalFilterIdleTime
        idleTime={operational.idleTime}
        onChange={(idleTime) => setFilter("operational", "idleTime", idleTime)}
        isPinned={isFilterPinned("operational", "idleTime")}
        onPinChange={
          view === "idle-assets" ? (status) => setPinnedFilter("operational", "idleTime", status) : undefined
        }
      />
      <OperationalFilterLastReported
        lastReported={operational.lastReported}
        onChange={(lastReported) => setFilter("operational", "lastReported", lastReported)}
        isPinned={isFilterPinned("operational", "lastReported")}
        onPinChange={
          view === "idle-assets" ? (status) => setPinnedFilter("operational", "lastReported", status) : undefined
        }
      />
    </div>
  );
}
