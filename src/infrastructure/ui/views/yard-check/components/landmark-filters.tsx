import { LandmarkFilterGroups } from "@/components/filters/form-controls/landmark-filter-group";
import { LandmarkFilterTypes } from "@/components/filters/form-controls/landmark-filter-types";
import { LandmarkFilterNames } from "@/components/filters/form-controls/landmark-filter-names";
import { useYardCheckActions, useYardCheckFilters } from "@/store/yard-check.store";
import { useYardCheckRecentFilters } from "@/store/yard-check.store";

type FiltersProps = {
  view: Extract<ViewType, "yard-check" | "dashboards">;
};

export function LandmarkFilters({ view }: FiltersProps) {
  const { landmark } = useYardCheckFilters(view === "yard-check");
  const recents = useYardCheckRecentFilters();

  const { setFilter, setRecentFilter, setPinnedFilter, isFilterPinned } = useYardCheckActions(view === "yard-check");

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <LandmarkFilterGroups
        groups={landmark.groups ?? []}
        recentGroups={recents.landmark.groups ?? []}
        onChange={(groups) => setFilter("landmark", "groups", groups)}
        onBlur={(groups) => setRecentFilter("landmark", "groups", groups)}
        isPinned={isFilterPinned("landmark", "groups")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("landmark", "groups", status) : undefined}
      />
      <LandmarkFilterTypes
        types={landmark.types ?? []}
        recentTypes={recents.landmark.types ?? []}
        onChange={(types) => setFilter("landmark", "types", types)}
        onBlur={(types) => setRecentFilter("landmark", "types", types)}
        isPinned={isFilterPinned("landmark", "types")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("landmark", "types", status) : undefined}
      />
      <LandmarkFilterNames
        names={landmark.names ?? []}
        recentNames={recents.landmark.names ?? []}
        onChange={(names) => setFilter("landmark", "names", names)}
        onBlur={(names) => setRecentFilter("landmark", "names", names)}
        isPinned={isFilterPinned("landmark", "names")}
        onPinChange={view === "yard-check" ? (status) => setPinnedFilter("landmark", "names", status) : undefined}
      />
    </div>
  );
}
