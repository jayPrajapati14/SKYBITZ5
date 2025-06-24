import { useYardCheckActions, useYardCheckFilters } from "@/store/yard-check.store";
import { SensorFilterCargoStatus } from "@/infrastructure/ui/components/filters/form-controls/sensor-filter-cargo-status";

type FiltersProps = {
  view: Extract<ViewType, "yard-check" | "dashboards">;
};

export function SensorFilters({ view }: FiltersProps) {
  const { sensor } = useYardCheckFilters(view === "yard-check");
  const { setFilter, setPinnedFilter, isFilterPinned } = useYardCheckActions(view === "yard-check");

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <SensorFilterCargoStatus
        cargoStatuses={sensor.cargoStatuses || []}
        onChange={(statuses) => setFilter("sensor", "cargoStatuses", statuses)}
        isPinned={isFilterPinned("sensor", "cargoStatuses")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("sensor", "cargoStatuses", status) : undefined}
      />
    </div>
  );
}
