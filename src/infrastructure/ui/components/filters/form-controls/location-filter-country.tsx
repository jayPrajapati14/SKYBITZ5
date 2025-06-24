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

type LocationFilterCountryProps = {
  countries: Country[];
  recentCountries: Country[];
  onChange: (countries: Country[]) => void;
  onBlur: (countries: Country[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function LocationFilterCountry({
  countries,
  recentCountries,
  onChange,
  onBlur,
  isPinned,
  onPinChange,
}: LocationFilterCountryProps) {
  const { allCountries, isLoading } = useGetCountries();

  return (
    <FilterFormControl label="Country" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={allCountries}
        getOptionId={(option) => option.id}
        getOptionLabel={(option) => option.name ?? option.id}
        noOptionsText="No countries"
        placeholder="Type to find a Country"
        value={countries}
        defaultOptions={recentCountries}
        onChange={(_event, countries) => onChange(countries)}
        maxSelectedOptions={1}
        onBlur={() => onBlur(countries)}
        loading={isLoading}
      />
    </FilterFormControl>
  );
}
