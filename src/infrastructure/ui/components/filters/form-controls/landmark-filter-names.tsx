import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { getLandmarks } from "@/domain/services/landmark/landmark.service";
import { FilterFormControl } from "@/components/filters/filter-form-control";

type LandmarkFilterNamesProps = {
  names: Landmark[];
  recentNames: Landmark[];
  onChange: (names: Landmark[]) => void;
  onBlur: (names: Landmark[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
  includeAll?: boolean;
};

export function LandmarkFilterNames({
  names,
  recentNames,
  onChange,
  onBlur,
  isPinned,
  onPinChange,
  includeAll = false,
}: LandmarkFilterNamesProps) {
  return (
    <FilterFormControl label="Landmark Name" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={(inputText: string) => getLandmarks({ name: inputText, limit: 50, includeAll })}
        getOptionId={(option) => option.id}
        getOptionLabel={(option) => option.name ?? option.id.toString()}
        noOptionsText="No landmarks"
        placeholder="Type to find a Landmark Name"
        value={names || []}
        defaultOptions={recentNames}
        onChange={(_event, landmarks) => onChange(landmarks)}
        onBlur={() => onBlur(names)}
      />
    </FilterFormControl>
  );
}
