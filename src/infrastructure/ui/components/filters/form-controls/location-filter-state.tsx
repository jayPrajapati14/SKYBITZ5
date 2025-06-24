import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { FilterFormControl } from "@/components/filters/filter-form-control";
import { CONFIG } from "@/domain/config";
import { getCountries } from "@/domain/services/location/location.service";
import { useQuery } from "@tanstack/react-query";

function useGetCountries() {
  const { data, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: CONFIG.staticValuesStaleTime,
  });

  return { allCountries: data ?? [], isLoading };
}

type LocationFilterStateProps = {
  countries: Country[];
  states: State[];
  onChange: (states: State[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function LocationFilterState({ countries, states, onChange, isPinned, onPinChange }: LocationFilterStateProps) {
  const { allCountries, isLoading } = useGetCountries();

  const selectedCountries =
    countries.length > 0 ? allCountries.filter((country) => countries.some((c) => c.id === country.id)) : allCountries;

  const allStates = selectedCountries
    .map((country) =>
      country.states.map((state) => ({
        ...state,
        name: countries.length !== 1 ? `${state.name}, ${country.id}` : state.name,
      }))
    )
    .flat();

  return (
    <FilterFormControl label="State" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={allStates}
        getOptionId={(option) => option.id}
        getOptionLabel={(option) => option.name ?? option.id}
        noOptionsText="No states"
        maxSelectedOptions={1}
        placeholder="Type to find a State"
        value={states}
        onChange={(_event, states) => onChange(states)}
        loading={isLoading}
      />
    </FilterFormControl>
  );
}
