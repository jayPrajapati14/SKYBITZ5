import { OperationalFilterDateRange } from "@/components/filters/form-controls/operational-filter-date-range";
import { useAccruedDistanceActions } from "@/store/accrued-distance.store";
import { useAccruedDistanceFilters } from "@/store/accrued-distance.store";

type FiltersProps = {
  view: Extract<ViewType, "accrued-distance" | "dashboards">;
};

export function OperationalFilters({ view }: FiltersProps) {
  const { operational } = useAccruedDistanceFilters(view === "accrued-distance");
  const { setFilter, setPinnedFilter, isFilterPinned } = useAccruedDistanceActions(view === "accrued-distance");

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <OperationalFilterDateRange
        placement="right"
        dateRange={operational.dateRange}
        onChange={(range) => setFilter("operational", "dateRange", range)}
        isPinned={isFilterPinned("operational", "dateRange")}
        onPinChange={(status) => setPinnedFilter("operational", "dateRange", status)}
      />
    </div>
  );
}
