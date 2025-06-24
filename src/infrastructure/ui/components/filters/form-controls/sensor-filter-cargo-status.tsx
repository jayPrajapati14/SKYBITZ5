import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { FilterFormControl } from "@/components/filters/filter-form-control";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/_/g, " ");

type SensorFilterStatusProps = {
  cargoStatuses: string[];
  onChange: (cargoStatuses: string[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function SensorFilterCargoStatus({ cargoStatuses, onChange, isPinned, onPinChange }: SensorFilterStatusProps) {
  const statuses: CargoStatus[] = ["LOADED", "MOUNTED", "PARTIALLY_LOADED", "BARE", "EMPTY", "FULL", "UNKNOWN"];

  return (
    <FilterFormControl label="Cargo Status" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={statuses}
        getOptionId={(option) => option}
        getOptionLabel={(option) => capitalize(option)}
        noOptionsText="No cargo status"
        placeholder="Type to find a Cargo Status"
        value={cargoStatuses || []}
        onChange={(_event, statuses) => onChange(statuses)}
      />
    </FilterFormControl>
  );
}
