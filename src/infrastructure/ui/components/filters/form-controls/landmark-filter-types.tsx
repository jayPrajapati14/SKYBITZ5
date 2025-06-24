import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { getLandmarkTypes } from "@/domain/services/landmark/landmark.service";
import { FilterFormControl } from "@/components/filters/filter-form-control";
import { CONFIG } from "@/domain/config";
import { useQuery } from "@tanstack/react-query";

function useGetLandmarkTypes() {
  const { data, isLoading } = useQuery({
    queryKey: ["landmark-types"],
    queryFn: getLandmarkTypes,
    staleTime: CONFIG.staticValuesStaleTime,
  });

  return { landmarkTypes: data ?? [], isLoading };
}

type LandmarkFilterTypesProps = {
  types: LandmarkType[];
  recentTypes: LandmarkType[];
  onChange: (types: LandmarkType[]) => void;
  onBlur: (types: LandmarkType[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function LandmarkFilterTypes({
  types,
  recentTypes,
  onChange,
  onBlur,
  isPinned,
  onPinChange,
}: LandmarkFilterTypesProps) {
  const { landmarkTypes, isLoading } = useGetLandmarkTypes();

  return (
    <FilterFormControl label="Landmark Type" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={landmarkTypes}
        getOptionId={(option) => option.id}
        getOptionLabel={(option) => option.name ?? option.id.toString()}
        noOptionsText="No types"
        placeholder="Type to find a Landmark Type"
        value={types || []}
        defaultOptions={recentTypes}
        onChange={(_event, types) => onChange(types)}
        onBlur={() => onBlur(types)}
        loading={isLoading}
        maxSelectedOptions={1}
      />
    </FilterFormControl>
  );
}
