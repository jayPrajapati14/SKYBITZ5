import {
  useGenericAssetActions,
  useGenericAssetFilters,
  useGenericAssetFiltersCounts,
  useGenericAssetRecentFilters,
} from "@/store/generic-asset.store";
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
import { SensorFilterCargoStatus } from "@/components/filters/form-controls/sensor-filter-cargo-status-2";
import { OperationalFilterLandmark } from "@/components/filters/form-controls/operational-filter-landmark";
import { AssetTextSearch } from "@/components/filters/form-controls/asset-filter-text-search";
import { Feature } from "@/components/feature-flag";
import { SensorFilterMotionStatus } from "@/components/filters/form-controls/sensor-filter-motion-status";

export function GenericAssetsFiltersBar() {
  const { asset, location, sensor, operational } = useGenericAssetFilters(true);
  const recents = useGenericAssetRecentFilters();
  const { setFilter, setRecentFilter, setPinnedFilter, isFilterPinned } = useGenericAssetActions(true);
  const count = useGenericAssetFiltersCounts(true);
  const { filtersPinnedCount, activeFiltersCount } = useGenericAssetActions(true);

  const landmarkGroupCount = activeFiltersCount("location", "groups");
  const landmarkNameCount = activeFiltersCount("location", "names");
  const landmarkTypeCount = activeFiltersCount("location", "types");
  const assetIdCount = activeFiltersCount("asset", "ids");
  const assetTypeCount = activeFiltersCount("asset", "types");
  const excludedAssetIdCount = activeFiltersCount("asset", "excludedIds");
  const locationCountryCount = activeFiltersCount("location", "countries");
  const locationStateCount = activeFiltersCount("location", "states");
  const locationZipCodeCount = activeFiltersCount("location", "zipCode");
  const operationalLadmarkCount = activeFiltersCount("operational", "assetLocationType");
  const operationalLastReportedCount = activeFiltersCount("operational", "lastReported");
  const operationalIdleTimeCount = activeFiltersCount("operational", "idleTime");
  const sensorCargoStatusCount = activeFiltersCount("sensor", "cargoStatuses");
  const sensorVolumetricStatusCount = activeFiltersCount("sensor", "volumetricStatuses");
  const sensorMotionStatusCount = activeFiltersCount("sensor", "motionStatuses");
  const assetTextSearchCount = activeFiltersCount("asset", "byTextSearch");

  let nonPinnedEnabledFilters = 0;
  if (!isFilterPinned("location", "groups") && landmarkGroupCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("location", "names") && landmarkNameCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("location", "types") && landmarkTypeCount > 0) nonPinnedEnabledFilters++;
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
  if (!isFilterPinned("sensor", "volumetricStatuses") && sensorVolumetricStatusCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("asset", "byTextSearch") && assetTextSearchCount > 0) nonPinnedEnabledFilters++;
  if (!isFilterPinned("sensor", "motionStatuses") && sensorMotionStatusCount > 0) nonPinnedEnabledFilters++;

  const pinnedCount = filtersPinnedCount();
  const showFiltersAppliedMessage = pinnedCount === 0 || (pinnedCount > 0 && nonPinnedEnabledFilters > 0);

  const onShowFilters = () => {
    if (!isFilterPinned("location", "groups") && landmarkGroupCount > 0) setPinnedFilter("location", "groups", true);
    if (!isFilterPinned("location", "names") && landmarkNameCount > 0) setPinnedFilter("location", "names", true);
    if (!isFilterPinned("location", "types") && landmarkTypeCount > 0) setPinnedFilter("location", "types", true);
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
    if (!isFilterPinned("asset", "byTextSearch") && assetTextSearchCount > 0)
      setPinnedFilter("asset", "byTextSearch", true);
    if (!isFilterPinned("sensor", "motionStatuses") && sensorMotionStatusCount > 0)
      setPinnedFilter("sensor", "motionStatuses", true);
    if (!isFilterPinned("sensor", "volumetricStatuses") && sensorVolumetricStatusCount > 0)
      setPinnedFilter("sensor", "volumetricStatuses", true);
  };
  return (
    <>
      <Feature flag="generic-assets" option="showTextSearch">
        {isFilterPinned("asset", "byTextSearch") ? (
          <div className="tw-w-48">
            <AssetTextSearch
              placeholder="Search Assets"
              byTextSearch={asset.byTextSearch}
              onChange={(asset) => setFilter("asset", "byTextSearch", asset)}
              isPinned={isFilterPinned("asset", "byTextSearch")}
            />
          </div>
        ) : null}
      </Feature>

      {isFilterPinned("location", "groups") ? (
        <Filters.Dropdown>
          <Filters.Chip count={landmarkGroupCount} label="Landmark Group" />
          <Filters.Popover>
            <LandmarkFilterGroups
              groups={location.groups ?? []}
              recentGroups={recents.location.groups ?? []}
              onChange={(groups) => setFilter("location", "groups", groups)}
              onBlur={(groups) => setRecentFilter("location", "groups", groups)}
              isPinned={isFilterPinned("location", "groups")}
              onPinChange={(status) => setPinnedFilter("location", "groups", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("location", "names") ? (
        <Filters.Dropdown>
          <Filters.Chip count={landmarkNameCount} label="Landmark Name" />
          <Filters.Popover>
            <LandmarkFilterNames
              names={location.names ?? []}
              recentNames={recents.location.names ?? []}
              onChange={(names) => setFilter("location", "names", names)}
              onBlur={(names) => setRecentFilter("location", "names", names)}
              isPinned={isFilterPinned("location", "names")}
              onPinChange={(status) => setPinnedFilter("location", "names", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("location", "types") ? (
        <Filters.Dropdown>
          <Filters.Chip count={landmarkTypeCount} label="Landmark Type" />
          <Filters.Popover>
            <LandmarkFilterTypes
              types={location.types ?? []}
              recentTypes={recents.location.types ?? []}
              onChange={(types) => setFilter("location", "types", types)}
              onBlur={(types) => setRecentFilter("location", "types", types)}
              isPinned={isFilterPinned("location", "types")}
              onPinChange={(status) => setPinnedFilter("location", "types", status)}
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
          <Filters.Chip count={sensorCargoStatusCount + sensorVolumetricStatusCount} label="Cargo Status" />
          <Filters.Popover>
            <SensorFilterCargoStatus
              cargoStatuses={sensor.cargoStatuses || []}
              volumetricStatus={sensor.volumetricStatuses || []}
              onChangeCargo={(statuses) => setFilter("sensor", "cargoStatuses", statuses)}
              onChangeVolumetric={(statuses) => setFilter("sensor", "volumetricStatuses", statuses)}
              isPinned={isFilterPinned("sensor", "cargoStatuses")}
              onPinChange={(status) => setPinnedFilter("sensor", "cargoStatuses", status)}
            />
          </Filters.Popover>
        </Filters.Dropdown>
      ) : null}

      {isFilterPinned("sensor", "motionStatuses") ? (
        <Filters.Dropdown>
          <Filters.Chip count={sensorMotionStatusCount} label="Motion Status" />
          <Filters.Popover>
            <SensorFilterMotionStatus
              motionStatuses={sensor.motionStatuses ?? []}
              onChange={(motionStatuses) => setFilter("sensor", "motionStatuses", motionStatuses)}
              isPinned={isFilterPinned("sensor", "motionStatuses")}
              onPinChange={(status) => setPinnedFilter("sensor", "motionStatuses", status)}
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
