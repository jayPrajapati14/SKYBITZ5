import {
  useAccruedDistanceActions,
  useAccruedDistanceFilters,
  useAccruedDistanceFiltersCounts,
  useAccruedDistanceRecentFilters,
} from "@/store/accrued-distance.store";
import { Filters } from "@/components/filters/filters";
import { Button } from "@mui/material";
import { OperationalFilterDateRange } from "@/components/filters/form-controls/operational-filter-date-range";
import { getDateRangeLabel } from "@/domain/utils/datetime";
import { AssetFilterIds } from "@/components/filters/form-controls/asset-filter-ids";

export function AccruedDistanceFiltersBar() {
  const { isFilterPinned, setPinnedFilter, setFilter, setRecentFilter, filtersPinnedCount } =
    useAccruedDistanceActions(true);
  const recents = useAccruedDistanceRecentFilters();
  const count = useAccruedDistanceFiltersCounts(true);

  const { asset, operational } = useAccruedDistanceFilters(true);

  const assetIdCount = asset.ids?.length ?? 0;
  const operationalDateRangeCount = operational.dateRange ? 1 : 0;

  let nonPinnedEnabledFilters = 0;
  if (!isFilterPinned("asset", "ids") && assetIdCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("operational", "dateRange") && operationalDateRangeCount > 0) nonPinnedEnabledFilters++;

  const pinnedCount = filtersPinnedCount();
  const showFiltersAppliedMessage = pinnedCount === 0 || (pinnedCount > 0 && nonPinnedEnabledFilters > 0);

  const onShowFilters = () => {
    if (!isFilterPinned("asset", "ids") && assetIdCount > 0) setPinnedFilter("asset", "ids", true);
    if (!isFilterPinned("operational", "dateRange") && operationalDateRangeCount > 0)
      setPinnedFilter("operational", "dateRange", true);
  };

  const onChange = (range: { from: Date; to: Date }) => {
    setFilter("operational", "dateRange", {
      from: range.from,
      to: range.to,
    });
  };

  return (
    <>
      {isFilterPinned("asset", "ids") ? (
        <Filters.Dropdown>
          <Filters.Chip count={assetIdCount} label="Asset Id" />
          <Filters.Popover>
            <AssetFilterIds
              ids={asset.ids ?? []}
              recentIds={recents.asset.ids ?? []}
              onChange={(ids) => setFilter("asset", "ids", ids)}
              onBlur={(ids) => setRecentFilter("asset", "ids", ids)}
              isPinned={isFilterPinned("asset", "ids")}
              onPinChange={(status) => setPinnedFilter("asset", "ids", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("operational", "dateRange") ? (
        <Filters.Dropdown>
          <Filters.Chip count={operationalDateRangeCount} label={getDateRangeLabel(operational.dateRange)} hideCount />
          <Filters.Popover>
            <OperationalFilterDateRange
              dateRange={operational.dateRange}
              onChange={onChange}
              isPinned={isFilterPinned("operational", "dateRange")}
              onPinChange={(status) => setPinnedFilter("operational", "dateRange", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {showFiltersAppliedMessage ? (
        <div className="tw-flex tw-items-center tw-gap-1 tw-pl-px tw-text-sm">
          <div className="tw-relative -tw-top-px tw-text-gray-500">
            {count.total === 0
              ? "There are currently no filters being applied."
              : `${count.total} filter${count.total > 1 ? "s are" : " is"} currently applied.`}
          </div>
          <Button sx={{ textTransform: "capitalize", padding: "1px 5px 0px 5px", top: 0 }} onClick={onShowFilters}>
            {count.total === 0 ? "Add filters" : "Show"}
          </Button>
        </div>
      ) : null}
    </>
  );
}
