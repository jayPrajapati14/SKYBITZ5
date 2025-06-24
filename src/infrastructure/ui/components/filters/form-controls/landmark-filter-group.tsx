import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { getLandmarkGroups } from "@/infrastructure/repositories/landmark/landmark.repository";
import { FilterFormControl } from "@/components/filters/filter-form-control";
import { CONFIG } from "@/domain/config";
import { useQuery } from "@tanstack/react-query";

function useGetLandmarkGroups() {
  const { data, isLoading } = useQuery({
    queryKey: ["landmark-groups"],
    queryFn: getLandmarkGroups,
    staleTime: CONFIG.staticValuesStaleTime,
  });
  return { landmarkGroups: data ?? [], isLoading };
}

type LandmarkFilterGroupsProps = {
  groups: LandmarkGroup[];
  recentGroups: LandmarkGroup[];
  onChange: (groups: LandmarkGroup[]) => void;
  onBlur: (groups: LandmarkGroup[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function LandmarkFilterGroups({
  groups,
  recentGroups,
  onChange,
  onBlur,
  isPinned,
  onPinChange,
}: LandmarkFilterGroupsProps) {
  const { landmarkGroups, isLoading } = useGetLandmarkGroups();

  return (
    <FilterFormControl label="Landmark Group" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={landmarkGroups}
        getOptionId={(option) => option.id}
        getOptionLabel={(option) => option.name ?? option.id.toString()}
        noOptionsText="No groups"
        placeholder="Type to find a Landmark Group"
        value={groups}
        defaultOptions={recentGroups}
        onChange={(_event, groups) => onChange(groups)}
        onBlur={() => onBlur(groups)}
        loading={isLoading}
      />
    </FilterFormControl>
  );
}
