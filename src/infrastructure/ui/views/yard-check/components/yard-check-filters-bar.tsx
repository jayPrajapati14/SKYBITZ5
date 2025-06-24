import {
  useYardCheckActions,
  useYardCheckFilters,
  useYardCheckFiltersCounts,
  useYardCheckRecentFilters,
} from "@/store/yard-check.store";
import { Filters } from "@/components/filters/filters";
import { Button } from "@mui/material";
import { LandmarkFilterTypes } from "@/components/filters/form-controls/landmark-filter-types";
import { AssetFilterTypes } from "@/components/filters/form-controls/asset-filter-types";
import { AssetFilterIds } from "@/components/filters/form-controls/asset-filter-ids";
import { AssetFilterExcludeIds } from "@/components/filters/form-controls/asset-filter-exclude-ids";
import { LocationFilterCountry } from "@/components/filters/form-controls/location-filter-country";
import { LocationFilterState } from "@/components/filters/form-controls/location-filter-state";
import { LocationFilterZipCode } from "@/components/filters/form-controls/location-filter-zip-code";
import { OperationalFilterLastReported } from "@/components/filters/form-controls/operational-filter-last-reported";
import { OperationalFilterIdleTime } from "@/components/filters/form-controls/operational-filter-idle-time";
import { getIdleTimeLabel, getLastReportedLabel } from "@/domain/utils/datetime";
import { LandmarkFilterGroups } from "@/components/filters/form-controls/landmark-filter-group";
import { LandmarkFilterNames } from "@/components/filters/form-controls/landmark-filter-names";
import { SensorFilterCargoStatus } from "@/components/filters/form-controls/sensor-filter-cargo-status";
import { OperationalFilterLandmark } from "@/components/filters/form-controls/operational-filter-landmark";

export function YardCheckFiltersBar() {
  const { landmark, asset, location, sensor, operational } = useYardCheckFilters(true);
  const recents = useYardCheckRecentFilters();
  const { setFilter, setRecentFilter, setPinnedFilter, isFilterPinned } = useYardCheckActions(true);
  const count = useYardCheckFiltersCounts();
  const { filtersPinnedCount } = useYardCheckActions();

  const landmarkGroupCount = landmark.groups?.length ?? 0;
  const landmarkNameCount = landmark.names?.length ?? 0;
  const landmarkTypeCount = landmark.types?.length ?? 0;
  const assetIdCount = asset.ids?.length ?? 0;
  const assetTypeCount = asset.types?.length ?? 0;
  const excludedAssetIdCount = asset.excludedIds?.length ?? 0;
  const locationCountryCount = location.countries?.length ?? 0;
  const locationStateCount = location.states?.length ?? 0;
  const locationZipCodeCount = (location.zipCode?.length ?? 0) > 0 ? 1 : 0;
  const operationalLadmarkCount = operational.assetLocationType ? 1 : 0;
  const operationalLastReportedCount = operational.lastReported ? 1 : 0;
  const operationalIdleTimeCount = operational.idleTime ? 1 : 0;
  const sensorCargoStatusCount = sensor.cargoStatuses?.length ?? 0;

  let nonPinnedEnabledFilters = 0;
  if (!isFilterPinned("landmark", "groups") && landmarkGroupCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("landmark", "names") && landmarkNameCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("landmark", "types") && landmarkTypeCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("asset", "ids") && assetIdCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("asset", "types") && assetTypeCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("asset", "excludedIds") && excludedAssetIdCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("location", "countries") && locationCountryCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("location", "states") && locationStateCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("location", "zipCode") && locationZipCodeCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("operational", "assetLocationType") && operationalLadmarkCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("operational", "idleTime") && operationalIdleTimeCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("operational", "lastReported") && operationalLastReportedCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("sensor", "cargoStatuses") && sensorCargoStatusCount > 0) nonPinnedEnabledFilters++;

  const pinnedCount = filtersPinnedCount();
  const showFiltersAppliedMessage = pinnedCount === 0 || (pinnedCount > 0 && nonPinnedEnabledFilters > 0);

  const onShowFilters = () => {
    if (!isFilterPinned("landmark", "groups") && landmarkGroupCount > 0) setPinnedFilter("landmark", "groups", true);
    if (!isFilterPinned("landmark", "names") && landmarkNameCount > 0) setPinnedFilter("landmark", "names", true);
    if (!isFilterPinned("landmark", "types") && landmarkTypeCount > 0) setPinnedFilter("landmark", "types", true);
    if (!isFilterPinned("asset", "ids") && assetIdCount > 0) setPinnedFilter("asset", "ids", true);
    if (!isFilterPinned("asset", "types") && assetTypeCount > 0) setPinnedFilter("asset", "types", true);
    if (!isFilterPinned("asset", "excludedIds") && excludedAssetIdCount > 0)
      setPinnedFilter("asset", "excludedIds", true);
    if (!isFilterPinned("location", "countries") && locationCountryCount > 0)
      setPinnedFilter("location", "countries", true);
    if (!isFilterPinned("location", "states") && locationStateCount > 0) setPinnedFilter("location", "states", true);
    if (!isFilterPinned("location", "zipCode") && locationZipCodeCount > 0)
      setPinnedFilter("location", "zipCode", true);
    if (!isFilterPinned("sensor", "cargoStatuses") && sensorCargoStatusCount > 0)
      setPinnedFilter("sensor", "cargoStatuses", true);
    if (!isFilterPinned("operational", "assetLocationType") && operationalLadmarkCount > 0)
      setPinnedFilter("operational", "assetLocationType", true);
    if (!isFilterPinned("operational", "idleTime") && operationalIdleTimeCount > 0)
      setPinnedFilter("operational", "idleTime", true);
    if (!isFilterPinned("operational", "lastReported") && operationalLastReportedCount > 0)
      setPinnedFilter("operational", "lastReported", true);
  };
  return (
    <>
      {isFilterPinned("landmark", "groups") ? (
        <Filters.Dropdown>
          <Filters.Chip count={landmarkGroupCount} label="Landmark Group" />
          <Filters.Popover>
            <LandmarkFilterGroups
              groups={landmark.groups ?? []}
              recentGroups={recents.landmark.groups ?? []}
              onChange={(groups) => setFilter("landmark", "groups", groups)}
              onBlur={(groups) => setRecentFilter("landmark", "groups", groups)}
              isPinned={isFilterPinned("landmark", "groups")}
              onPinChange={(status) => setPinnedFilter("landmark", "groups", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("landmark", "names") ? (
        <Filters.Dropdown>
          <Filters.Chip count={landmarkNameCount} label="Landmark Name" />
          <Filters.Popover>
            <LandmarkFilterNames
              names={landmark.names ?? []}
              recentNames={recents.landmark.names ?? []}
              onChange={(names) => setFilter("landmark", "names", names)}
              onBlur={(names) => setRecentFilter("landmark", "names", names)}
              isPinned={isFilterPinned("landmark", "names")}
              onPinChange={(status) => setPinnedFilter("landmark", "names", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("landmark", "types") ? (
        <Filters.Dropdown>
          <Filters.Chip count={landmarkTypeCount} label="Landmark Type" />
          <Filters.Popover>
            <LandmarkFilterTypes
              types={landmark.types ?? []}
              recentTypes={recents.landmark.types ?? []}
              onChange={(types) => setFilter("landmark", "types", types)}
              onBlur={(types) => setRecentFilter("landmark", "types", types)}
              isPinned={isFilterPinned("landmark", "types")}
              onPinChange={(status) => setPinnedFilter("landmark", "types", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

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

      {isFilterPinned("asset", "types") ? (
        <Filters.Dropdown>
          <Filters.Chip count={assetTypeCount} label="Asset Type" />
          <Filters.Popover>
            <AssetFilterTypes
              types={asset.types ?? []}
              recentTypes={recents.asset.types ?? []}
              onChange={(types) => setFilter("asset", "types", types)}
              onBlur={(types) => setRecentFilter("asset", "types", types)}
              isPinned={isFilterPinned("asset", "types")}
              onPinChange={(status) => setPinnedFilter("asset", "types", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("asset", "excludedIds") ? (
        <Filters.Dropdown>
          <Filters.Chip count={excludedAssetIdCount} label="Excluded Assets" />
          <Filters.Popover>
            <AssetFilterExcludeIds
              ids={asset.excludedIds ?? []}
              recentIds={recents.asset.excludedIds ?? []}
              onChange={(ids) => setFilter("asset", "excludedIds", ids)}
              onBlur={(ids) => setRecentFilter("asset", "excludedIds", ids)}
              isPinned={isFilterPinned("asset", "excludedIds")}
              onPinChange={(status) => setPinnedFilter("asset", "excludedIds", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("location", "countries") ? (
        <Filters.Dropdown>
          <Filters.Chip count={locationCountryCount} label="Country" />
          <Filters.Popover>
            <LocationFilterCountry
              countries={location.countries ?? []}
              recentCountries={recents.location.countries ?? []}
              onChange={(countries) => setFilter("location", "countries", countries)}
              onBlur={(countries) => setRecentFilter("location", "countries", countries)}
              isPinned={isFilterPinned("location", "countries")}
              onPinChange={(status) => setPinnedFilter("location", "countries", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("location", "states") ? (
        <Filters.Dropdown>
          <Filters.Chip count={locationStateCount} label="State" />
          <Filters.Popover>
            <LocationFilterState
              countries={location.countries ?? []}
              states={location.states ?? []}
              onChange={(states) => setFilter("location", "states", states)}
              isPinned={isFilterPinned("location", "states")}
              onPinChange={(status) => setPinnedFilter("location", "states", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("location", "zipCode") ? (
        <Filters.Dropdown>
          <Filters.Chip count={locationZipCodeCount} label="Zip Code" hideCount />
          <Filters.Popover>
            <LocationFilterZipCode
              zipCode={location.zipCode}
              onChange={(zipCode) => setFilter("location", "zipCode", zipCode)}
              isPinned={isFilterPinned("location", "zipCode")}
              onPinChange={(status) => setPinnedFilter("location", "zipCode", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("sensor", "cargoStatuses") ? (
        <Filters.Dropdown>
          <Filters.Chip count={sensorCargoStatusCount} label="Cargo Status" />
          <Filters.Popover>
            <SensorFilterCargoStatus
              cargoStatuses={sensor.cargoStatuses ?? []}
              onChange={(cargoStatuses) => setFilter("sensor", "cargoStatuses", cargoStatuses)}
              isPinned={isFilterPinned("sensor", "cargoStatuses")}
              onPinChange={(status) => setPinnedFilter("sensor", "cargoStatuses", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("operational", "assetLocationType") ? (
        <Filters.Dropdown>
          <Filters.Chip
            count={operationalLadmarkCount}
            hideCount
            label={
              operational.assetLocationType
                ? {
                    ANYWHERE: "Assets anywhere",
                    AT_LANDMARK: "Only assets at landmarks",
                    NOT_AT_LANDMARK: "Only assets not at landmarks",
                  }[operational.assetLocationType]
                : "Assets anywhere"
            }
          />
          <Filters.Popover>
            <OperationalFilterLandmark
              assetLocationType={operational.assetLocationType}
              onChange={(assetLocationType) => setFilter("operational", "assetLocationType", assetLocationType)}
              isPinned={isFilterPinned("operational", "assetLocationType")}
              onPinChange={(status) => setPinnedFilter("operational", "assetLocationType", status)}
              disabled
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("operational", "idleTime") ? (
        <Filters.Dropdown>
          <Filters.Chip count={operationalIdleTimeCount} label={getIdleTimeLabel(operational.idleTime)} hideCount />
          <Filters.Popover>
            <OperationalFilterIdleTime
              idleTime={operational.idleTime}
              onChange={(idleTime) => setFilter("operational", "idleTime", idleTime)}
              isPinned={isFilterPinned("operational", "idleTime")}
              onPinChange={(status) => setPinnedFilter("operational", "idleTime", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("operational", "lastReported") ? (
        <Filters.Dropdown>
          <Filters.Chip
            count={operationalLastReportedCount}
            label={getLastReportedLabel(operational.lastReported)}
            hideCount
          />
          <Filters.Popover>
            <OperationalFilterLastReported
              lastReported={operational.lastReported}
              onChange={(lastReported) => setFilter("operational", "lastReported", lastReported)}
              isPinned={isFilterPinned("operational", "lastReported")}
              onPinChange={(status) => setPinnedFilter("operational", "lastReported", status)}
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
