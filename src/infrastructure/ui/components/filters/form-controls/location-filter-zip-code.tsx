import { FilterFormControl } from "@/components/filters/filter-form-control";
import { Input } from "@/components/input/input";

type LocationFilterZipCodeProps = {
  zipCode?: string;
  onChange: (zipCode?: string) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function LocationFilterZipCode({ zipCode, onChange, isPinned, onPinChange }: LocationFilterZipCodeProps) {
  return (
    <FilterFormControl label="US Zip Code" pinned={isPinned} onPinClick={onPinChange}>
      <Input
        placeholder="Filter by Zip Code"
        value={zipCode ?? ""}
        onChange={onChange}
        clear={() => onChange(undefined)}
      />
    </FilterFormControl>
  );
}
