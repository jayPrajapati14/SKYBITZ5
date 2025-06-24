import {
  useAccruedDistanceActions,
  useAccruedDistanceFilters,
  useAccruedDistanceRecentFilters,
} from "@/store/accrued-distance.store";
import { AssetFilterIds } from "@/components/filters/form-controls/asset-filter-ids";

type FiltersProps = {
  view: Extract<ViewType, "accrued-distance" | "dashboards">;
};

export function AssetFilters({ view }: FiltersProps) {
  const { asset } = useAccruedDistanceFilters(view === "accrued-distance");
  const recents = useAccruedDistanceRecentFilters();

  const { setFilter, setRecentFilter, setPinnedFilter } = useAccruedDistanceActions(view === "accrued-distance");
  const { isFilterPinned } = useAccruedDistanceActions(view === "accrued-distance");

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <AssetFilterIds
        ids={asset.ids ?? []}
        recentIds={recents.asset.ids ?? []}
        onChange={(ids) => setFilter("asset", "ids", ids)}
        onBlur={(ids) => setRecentFilter("asset", "ids", ids)}
        isPinned={isFilterPinned("asset", "ids")}
        onPinChange={(status) => setPinnedFilter("asset", "ids", status)}
      />
    </div>
  );
}
