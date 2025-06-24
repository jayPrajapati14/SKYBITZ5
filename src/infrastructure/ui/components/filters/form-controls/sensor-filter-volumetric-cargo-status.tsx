import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { FilterFormControl } from "@/components/filters/filter-form-control";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/_/g, " ");

type SensorFilterStatusProps = {
  volumetricStatus: string[];
  onChange: (volumetricStatus: string[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function SensorFilterVolumetricCargoStatus({
  volumetricStatus,
  onChange,
  isPinned,
  onPinChange,
}: SensorFilterStatusProps) {
  const statuses: VolumetricStatus[] = ["EMPTY", "PARTIALLY_LOADED", "LOADED", "UNKNOWN"];

  return (
    <FilterFormControl label="Volumetric Cargo Status (SkyCamera)" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={statuses}
        getOptionId={(option) => option}
        getOptionLabel={(option) => capitalize(option)}
        noOptionsText="No volumetric cargo status"
        placeholder="Type to find a Volumetric Cargo Status..."
        value={volumetricStatus || []}
        onChange={(_event, statuses) => onChange(statuses)}
      />
    </FilterFormControl>
  );
}
