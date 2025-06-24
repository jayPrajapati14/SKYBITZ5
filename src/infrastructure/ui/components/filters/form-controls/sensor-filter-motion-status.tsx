import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { FilterFormControl } from "@/components/filters/filter-form-control";

type SensorFilterStatusProps = {
  motionStatuses: string[];
  onChange: (cargoStatuses: string[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
  disabled?: boolean;
  permanentOptions?: string[];
};
type StatusOption = { sensorType: SensorType | null; status: string; label: string };

const statusOptions: StatusOption[] = [
  { sensorType: "MOTION", status: "IDLE", label: "Idle" },
  { sensorType: "MOTION", status: "MOVING", label: "Moving" },
  { sensorType: null, status: "NOT_ENABLED", label: "Not Enabled" },
];

const groupLabelMap: Partial<Record<SensorType, string>> = {
  MOTION: "Motion Sensor Status",
};

export function SensorFilterMotionStatus({
  motionStatuses,
  onChange,
  isPinned,
  onPinChange,
  disabled = false,
  permanentOptions = [],
}: SensorFilterStatusProps) {
  const getOptionLabel = (status: string) => statusOptions.find((option) => option.status === status)?.label ?? status;
  const getSensorType = (status: string) =>
    statusOptions.find((option) => option.status === status)?.sensorType ?? null;

  const selectedOptions: StatusOption[] = [
    ...motionStatuses.map((status) => ({
      sensorType: getSensorType(status),
      status,
      label: getOptionLabel(status),
    })),
  ];

  return (
    <FilterFormControl label="Motion Status" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync<StatusOption>
        getOptions={statusOptions}
        getOptionId={(option) => `${option.status}`}
        getOptionLabel={(option) => option.label}
        groupBy={(option) => option.sensorType ?? ""}
        getGroupLabel={(group) => groupLabelMap[group as SensorType]}
        noOptionsText="No motion status"
        placeholder="Type to find a Motion Status"
        value={selectedOptions}
        disabled={disabled}
        permanentOptions={permanentOptions}
        onChange={(_event, selectedStatuses) => {
          const statuses = selectedStatuses.map((status) => status.status);
          onChange(statuses);
        }}
      />
    </FilterFormControl>
  );
}
