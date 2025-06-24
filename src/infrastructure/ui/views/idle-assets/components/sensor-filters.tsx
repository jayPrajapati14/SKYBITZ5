import { useIdleAssetActions, useIdleAssetFilters } from "@/store/idle-asset.store";
import { SensorFilterCargoStatus } from "@/infrastructure/ui/components/filters/form-controls/sensor-filter-cargo-status-2";
import { SensorFilterMotionStatus } from "@/infrastructure/ui/components/filters/form-controls/sensor-filter-motion-status";

type FiltersProps = {
  view: Extract<ViewType, "idle-assets" | "dashboards">;
};

export function SensorFilters({ view }: FiltersProps) {
  const { sensor } = useIdleAssetFilters(view === "idle-assets");
  const { setFilter, setPinnedFilter, isFilterPinned } = useIdleAssetActions(view === "idle-assets");

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <SensorFilterCargoStatus
        cargoStatuses={sensor.cargoStatuses || []}
        volumetricStatus={sensor.volumetricStatuses || []}
        onChangeCargo={(statuses) => setFilter("sensor", "cargoStatuses", statuses)}
        onChangeVolumetric={(statuses) => setFilter("sensor", "volumetricStatuses", statuses)}
        isPinned={isFilterPinned("sensor", "cargoStatuses")}
        onPinChange={
          view === "idle-assets" ? (status) => setPinnedFilter("sensor", "cargoStatuses", status) : undefined
        }
      />
      <SensorFilterMotionStatus
        motionStatuses={sensor.motionStatuses || []}
        onChange={(statuses) => setFilter("sensor", "motionStatuses", statuses)}
        isPinned={isFilterPinned("sensor", "motionStatuses")}
        onPinChange={
          view === "idle-assets" ? (status) => setPinnedFilter("sensor", "motionStatuses", status) : undefined
        }
        permanentOptions={["IDLE"]}
        disabled
      />
    </div>
  );
}
