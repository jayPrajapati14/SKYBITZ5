import { useYardCheckActions, useYardCheckFilters } from "@/store/yard-check.store";
import { SensorFilterCargoStatus } from "@/infrastructure/ui/components/filters/form-controls/sensor-filter-cargo-status-2";
import { SensorFilterMotionStatus } from "@/infrastructure/ui/components/filters/form-controls/sensor-filter-motion-status";
// import { SensorFilterVolumetricCargoStatus } from "@/infrastructure/ui/components/filters/form-controls/sensor-filter-volumetric-cargo-status";

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
        volumetricStatus={sensor.volumetricStatuses || []}
        onChangeCargo={(statuses) => setFilter("sensor", "cargoStatuses", statuses)}
        onChangeVolumetric={(statuses) => setFilter("sensor", "volumetricStatuses", statuses)}
        isPinned={isFilterPinned("sensor", "cargoStatuses")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("sensor", "cargoStatuses", status) : undefined}
      />
      {/* <SensorFilterVolumetricCargoStatus
        volumetricStatus={sensor.volumetricStatuses || []}
        onChange={(statuses) => setFilter("sensor", "volumetricStatuses", statuses)}
        isPinned={isFilterPinned("sensor", "volumetricStatuses")}
        onPinChange={
          view === "yard-check" ? (status) => setPinnedFilter("sensor", "volumetricStatuses", status) : undefined
        }
      /> */}
      <SensorFilterMotionStatus
        motionStatuses={sensor.motionStatuses || []}
        onChange={(statuses) => setFilter("sensor", "motionStatuses", statuses)}
        isPinned={isFilterPinned("sensor", "motionStatuses")}
        onPinChange={
          view === "yard-check" ? (status) => setPinnedFilter("sensor", "motionStatuses", status) : undefined
        }
      />
    </div>
  );
}
