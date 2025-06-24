import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { FilterFormControl } from "@/components/filters/filter-form-control";
import { cargoStatusesOptions } from "@/domain/contants/status";

type StatusOption = { sensorType: SensorType; status: string; label: string };

type CargoStatusFilterProps = {
  cargoStatuses: string[];
  volumetricStatus: string[];
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
  onChangeCargo: (statuses: CargoStatus[]) => void;
  onChangeVolumetric: (statuses: VolumetricStatus[]) => void;
};

const groupLabelMap: Partial<Record<SensorType, string>> = {
  CARGO: "Cargo Sensor Status",
  VOLUMETRIC: "Volumetric Cargo Sensor Status",
};

export function SensorFilterCargoStatus({
  cargoStatuses,
  volumetricStatus,
  isPinned,
  onPinChange,
  onChangeCargo,
  onChangeVolumetric,
}: CargoStatusFilterProps) {
  const getOptionLabel = (status: string, sensorType: SensorType) =>
    cargoStatusesOptions.find((option) => option.sensorType === sensorType && option.status === status)?.label ??
    status;

  const selectedOptions: StatusOption[] = [
    ...cargoStatuses.map((status) => ({
      sensorType: "CARGO" as const,
      status,
      label: getOptionLabel(status, "CARGO"),
    })),
    ...volumetricStatus.map((status) => ({
      sensorType: "VOLUMETRIC" as const,
      status,
      label: getOptionLabel(status, "VOLUMETRIC"),
    })),
  ];

  return (
    <FilterFormControl label="Cargo Status" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync<StatusOption>
        getOptions={cargoStatusesOptions}
        getOptionId={(option) => `${option.sensorType}-${option.status}`}
        getOptionLabel={(option) => option.label}
        groupBy={(option) => option.sensorType}
        getGroupLabel={(group) => groupLabelMap[group as SensorType] || group}
        noOptionsText="No cargo status"
        placeholder="Type to find a Cargo Status..."
        value={selectedOptions}
        onChange={(_event, selectedStatuses) => {
          const cargoStatuses = selectedStatuses
            .filter((status) => status.sensorType === "CARGO")
            .map((status) => status.status) as CargoStatus[];
          const volumetricStatuses = selectedStatuses
            .filter((status) => status.sensorType === "VOLUMETRIC")
            .map((status) => status.status) as VolumetricStatus[];

          onChangeCargo(cargoStatuses);
          onChangeVolumetric(volumetricStatuses);
        }}
      />
      <div className="tw-pl-4 tw-pt-1 tw-text-xs tw-text-text-secondary">
        * indicates Volumetric Cargo Sensor status
      </div>
    </FilterFormControl>
  );
}
