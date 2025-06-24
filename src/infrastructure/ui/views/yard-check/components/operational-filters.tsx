import { OperationalFilterLandmark } from "@/components/filters/form-controls/operational-filter-landmark";
import { useYardCheckActions } from "@/store/yard-check.store";
import { useYardCheckFilters } from "@/store/yard-check.store";
import { OperationalFilterLastReported } from "@/components/filters/form-controls/operational-filter-last-reported";
import { OperationalFilterIdleTime } from "@/components/filters/form-controls/operational-filter-idle-time";

type FiltersProps = {
  view: Extract<ViewType, "yard-check" | "dashboards">;
};

export function OperationalFilters({ view }: FiltersProps) {
  const { operational } = useYardCheckFilters(view === "yard-check");
  const { setFilter, setPinnedFilter, isFilterPinned } = useYardCheckActions(view === "yard-check");

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <OperationalFilterLandmark
        assetLocationType={operational.assetLocationType}
        onChange={(assetLocationType) => setFilter("operational", "assetLocationType", assetLocationType)}
        isPinned={isFilterPinned("operational", "assetLocationType")}
        onPinChange={
          view === "yard-check" ? (status) => setPinnedFilter("operational", "assetLocationType", status) : undefined
        }
        disabled
      />
      <OperationalFilterIdleTime
        idleTime={operational.idleTime}
        onChange={(idleTime) => setFilter("operational", "idleTime", idleTime)}
        isPinned={isFilterPinned("operational", "idleTime")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("operational", "idleTime", status) : undefined}
      />
      <OperationalFilterLastReported
        lastReported={operational.lastReported}
        onChange={(lastReported) => setFilter("operational", "lastReported", lastReported)}
        isPinned={isFilterPinned("operational", "lastReported")}
        onPinChange={
          view === "yard-check" ? (status) => setPinnedFilter("operational", "lastReported", status) : undefined
        }
      />
    </div>
  );
}
