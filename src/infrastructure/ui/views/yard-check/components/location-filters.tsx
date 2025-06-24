import { useYardCheckActions, useYardCheckFilters, useYardCheckRecentFilters } from "@/store/yard-check.store";
import { LocationFilterCountry } from "@/components/filters/form-controls/location-filter-country";
import { LocationFilterState } from "@/components/filters/form-controls/location-filter-state";
import { LocationFilterZipCode } from "@/components/filters/form-controls/location-filter-zip-code";

type FiltersProps = {
  view: Extract<ViewType, "yard-check" | "dashboards">;
};

export function LocationFilters({ view }: FiltersProps) {
  const filters = useYardCheckFilters(view === "yard-check");
  const recents = useYardCheckRecentFilters();
  const { setFilter, setRecentFilter, setPinnedFilter, isFilterPinned } = useYardCheckActions(view === "yard-check");

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <LocationFilterCountry
        countries={filters.location.countries ?? []}
        recentCountries={recents.location.countries ?? []}
        onChange={(countries) => {
          setFilter("location", "countries", countries);
          setFilter("location", "states", []);
        }}
        onBlur={(countries) => setRecentFilter("location", "countries", countries)}
        isPinned={isFilterPinned("location", "countries")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("location", "countries", status) : undefined}
      />
      <LocationFilterState
        countries={filters.location.countries ?? []}
        states={filters.location.states ?? []}
        onChange={(states) => setFilter("location", "states", states)}
        isPinned={isFilterPinned("location", "states")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("location", "states", status) : undefined}
      />
      <LocationFilterZipCode
        zipCode={filters.location.zipCode}
        onChange={(zipCode) => setFilter("location", "zipCode", zipCode)}
        isPinned={isFilterPinned("location", "zipCode")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("location", "zipCode", status) : undefined}
      />
    </div>
  );
}
