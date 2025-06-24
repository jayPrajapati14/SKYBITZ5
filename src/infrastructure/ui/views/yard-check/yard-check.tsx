import { NavBar } from "@/components/navbar/navbar";
import { APP_LINKS } from "@/routes";
import {
  useYardCheckActions,
  useYardCheckPaginationModel,
  useYardCheckFilterBar,
  useYardCheckFilters,
  useYardCheckFiltersCounts,
} from "@/store/yard-check.store";
import { Layout } from "@/views/layout/layout";
import { YardCheckFiltersBar } from "./components/yard-check-filters-bar";
import { YardCheckTable } from "./components/yard-check-table";
import { useGetYardCheckAssets } from "./hooks/use-get-yard-check-assets";
import { Filters } from "@/components/filters/filters";
import { YardCheckFiltersPanel } from "./components/yard-check-filters-panel";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useUiStore } from "@/store/ui.store";
import { ReportsActionsMenu } from "../reports/components/reports-actions-menu";
// import { TopLandmarksTile } from "@/views/dashboards/components/top-landmarks-tile";
// import { Tile } from "@/components/tile/tile";
// import { YardCheckMap } from "@/views/yard-check/components/yard-check-map";

// const topLandmarks = [
//   { landmarkName: "Skybitz Distro 1", emptyAssets: 17, totalAssets: 19 },
//   { landmarkName: "Skybitz Distro 7", emptyAssets: 3, totalAssets: 5 },
//   { landmarkName: "Skybitz HQ", emptyAssets: 1, totalAssets: 3 },
// ];

import { YardCheckAssetSortByField } from "@/domain/services/asset/asset.service";

export function YardCheck() {
  const count = useYardCheckFiltersCounts(true);
  const { setPaginationModel, setFilter, toggleFilterBar, resetViewFilters } = useYardCheckActions(true);
  const { landmark, asset, location, operational, sensor, display } = useYardCheckFilters(true);
  const paginationModel = useYardCheckPaginationModel();
  const showFilterBar = useYardCheckFilterBar();
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);
  // const equal = useYardCheckFiltersEqual();

  const onPaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel({
      // Reset page to 0 when page size changes
      page: newModel.pageSize !== paginationModel.pageSize ? 0 : newModel.page,
      pageSize: newModel.pageSize,
    });
  };

  const sortModel = display?.sortBy ? [{ field: display.sortBy.field, sort: display.sortBy.order }] : [];

  const onSortModelChange = (model: GridSortModel) => {
    // Reset page to 0 when sort model changes
    setPaginationModel({ ...paginationModel, page: 0 });
    const sortBy =
      model.length > 0
        ? { field: model[0].field as YardCheckAssetSortByField, order: model[0].sort as SortDirection }
        : undefined;

    setFilter("display", "sortBy", sortBy);
  };

  const assetsQuery = useGetYardCheckAssets({
    landmarkIds: landmark.names?.map((item) => item.id) ?? [],
    landmarkGroups: landmark.groups?.map((item) => item.id) ?? [],
    landmarkTypes: landmark.types?.map((item) => item.id) ?? [],
    excludedAssetIds: asset.excludedIds?.map((item) => item.id) ?? [],
    ids: asset.ids?.map((item) => item.id) ?? [],
    types: asset.types?.map((item) => item.id) ?? [],
    countries: location.countries?.map((item) => item.id) ?? [],
    states: location.states?.map((item) => item.id) ?? [],
    zipCode: location.zipCode,
    lastReported: operational.lastReported,
    cargoStatuses: sensor.cargoStatuses,
    motionStatuses: sensor.motionStatuses,
    idleTime: operational.idleTime,
    sortBy: display?.sortBy,
    byTextSearch: asset.byTextSearch,
    limit: paginationModel.pageSize,
    offset: paginationModel.page * paginationModel.pageSize,
  });

  const hasLandmarkIds = (landmark.names?.map((item) => item.id) ?? []).length > 0;
  const hasLandmarkGroupIds = (landmark.groups?.map((item) => item.id) ?? []).length > 0;
  const hasAssetIds = (asset.ids?.map((item) => item.id) ?? []).length > 0;

  const isQueryEnabled = hasLandmarkIds || hasLandmarkGroupIds || hasAssetIds;

  return (
    <>
      <Layout.Title>Yard Check</Layout.Title>
      <Layout.Controls>
        <NavBar
          leftLinks={APP_LINKS.left}
          rightLinks={APP_LINKS.right}
          filtersCount={count.total}
          toggleDrawer={toggleDrawer}
          rightSection={<ReportsActionsMenu view="yard-check" totalResults={assetsQuery.data?.totalCount ?? 0} />}
        />

        <Filters>
          {showFilterBar && (
            <Filters.Bar>
              <YardCheckFiltersBar />
            </Filters.Bar>
          )}

          <Filters.Panel
            count={count.total}
            onResetFilters={() => resetViewFilters(true)}
            showFilterBar={showFilterBar}
            onToggleFilterBar={toggleFilterBar}
          >
            <YardCheckFiltersPanel view="yard-check" />
          </Filters.Panel>
        </Filters>
      </Layout.Controls>

      <Layout.Content>
        <div className="tw-grid tw-h-full tw-grid-cols-12 tw-grid-rows-5 tw-gap-3">
          {/* <div className="tw-col-span-4 tw-row-span-5">
            <Tile title="Charts" className="tw-h-full">
              <TopLandmarksTile landmarks={topLandmarks} />
            </Tile>
          </div>
          <div className="tw-col-span-8 tw-row-span-2 tw-overflow-hidden tw-rounded-md tw-border tw-border-gray-200">
            <YardCheckMap />
          </div> */}
          {/* <div className="tw-col-span-8 tw-row-span-3"> */}
          <div className="tw-col-span-12 tw-row-span-12">
            <YardCheckTable
              rows={assetsQuery.data?.assets}
              loading={assetsQuery.isFetching}
              paginationModel={paginationModel}
              onPaginationModelChange={onPaginationModelChange}
              totalCount={assetsQuery.data?.totalCount ?? 0}
              sortModel={sortModel}
              onSortModelChange={onSortModelChange}
              error={assetsQuery.error?.message}
              disabledMessage={
                !isQueryEnabled
                  ? "Start by applying at least one of these filters to see results:\nLandmark Group, Landmark Names, Asset IDs"
                  : undefined
              }
            />
          </div>
        </div>
      </Layout.Content>
    </>
  );
}
