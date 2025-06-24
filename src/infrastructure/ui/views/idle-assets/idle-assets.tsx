import { Layout } from "@/views/layout/layout";
import { NavBar } from "@/components/navbar/navbar";
import { useUiStore } from "@/store/ui.store";
import { APP_LINKS } from "@/routes";
// import { ReportsActionsMenu } from "../reports/components/reports-actions-menu";
import { AssetsTable } from "./components/assets-table";
import { useGetIdleAssets } from "./hooks/use-get-idle-assets";
import {
  useIdleAssetActions,
  useIdleAssetPaginationModel,
  useIdleAssetFilterBar,
  useIdleAssetFilters,
  useIdleAssetFiltersCounts,
  useIdleAssetFiltersEqual,
} from "@/store/idle-asset.store";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { IdleAssetSortByField } from "@/domain/services/asset/asset.service";
import { Filters } from "@/components/filters/filters";
import { IdleAssetsFiltersPanel } from "./components/idle-assets-filters-panel";
import { IdleAssetsFiltersBar } from "./components/idle-assets-filters-bar";
import { Feature } from "@/components/feature-flag";
import { IdleAssetsTile } from "@/views/dashboards/components/idle-assets-tile";
import { Button } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { routeConfigs } from "@/infrastructure/ui/routes";
import { SidebarLayout } from "@/views/layout/sidebar-layout";

export const IdleAssets = () => {
  const count = useIdleAssetFiltersCounts(true);
  const { setPaginationModel, setFilter, toggleFilterBar, resetViewFilters } = useIdleAssetActions(true);
  const { asset, location, operational, sensor, display } = useIdleAssetFilters(true);
  const paginationModel = useIdleAssetPaginationModel();
  const showFilterBar = useIdleAssetFilterBar();
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);
  const equal = useIdleAssetFiltersEqual();
  const navigate = useNavigate();

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
        ? { field: model[0].field as IdleAssetSortByField, order: model[0].sort as SortDirection }
        : undefined;

    setFilter("display", "sortBy", sortBy);
  };

  const assetsQuery = useGetIdleAssets({
    landmarkIds: location.names?.map((item) => item.id) ?? [],
    landmarkGroups: location.groups?.map((item) => item.id) ?? [],
    landmarkTypes: location.types?.map((item) => item.id) ?? [],
    excludedAssetIds: asset.excludedIds?.map((item) => item.id) ?? [],
    ids: asset.ids?.map((item) => item.id) ?? [],
    types: asset.types?.map((item) => item.id) ?? [],
    countries: location.countries?.map((item) => item.id) ?? [],
    states: location.states?.map((item) => item.id) ?? [],
    zipCode: location.zipCode,
    lastReported: operational.lastReported,
    cargoStatuses: sensor.cargoStatuses,
    volumetricStatuses: sensor.volumetricStatuses,
    motionStatuses: sensor.motionStatuses,
    idleTime: operational.idleTime,
    sortBy: display?.sortBy,
    byTextSearch: asset.byTextSearch,
    assetLocationType: operational.assetLocationType ?? "ANYWHERE",
    limit: paginationModel.pageSize,
    offset: paginationModel.page * paginationModel.pageSize,
  });
  return (
    <>
      <Layout.Navigation>
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBack className="!tw-text-base" />}
          onClick={() => navigate(routeConfigs.dashboards.path)}
          className="!tw-p-0 !tw-text-base !tw-capitalize !tw-text-text-secondary hover:tw-bg-transparent hover:!tw-underline"
          size="medium"
        >
          Operations
        </Button>
      </Layout.Navigation>
      <Layout.Controls>
        <NavBar leftLinks={APP_LINKS.left} filtersCount={count.total} toggleDrawer={toggleDrawer} rightSection={null} />
        <Feature flag="idle-assets">
          <Filters>
            {showFilterBar && (
              <Filters.Bar>
                <IdleAssetsFiltersBar />
              </Filters.Bar>
            )}
            <Filters.Panel
              count={count.total}
              onResetFilters={() => resetViewFilters(true)}
              showFilterBar={showFilterBar}
              onToggleFilterBar={toggleFilterBar}
              title="Idle Assets Filters"
            >
              <IdleAssetsFiltersPanel view="idle-assets" />
            </Filters.Panel>
          </Filters>
        </Feature>
      </Layout.Controls>
      <Layout.Content>
        <Feature flag="idle-assets">
          <SidebarLayout>
            <SidebarLayout.Sidebar>
              <SidebarLayout.Widget title="Charts">
                <IdleAssetsTile view="idle-assets" {...(!equal && { onResetFilters: () => resetViewFilters() })} />
              </SidebarLayout.Widget>
            </SidebarLayout.Sidebar>
            <SidebarLayout.Content>
              <AssetsTable
                rows={assetsQuery.data?.assets}
                loading={assetsQuery.isFetching}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                totalCount={assetsQuery.data?.totalCount ?? 0}
                sortModel={sortModel}
                onSortModelChange={onSortModelChange}
                error={assetsQuery.error?.message}
              />
            </SidebarLayout.Content>
          </SidebarLayout>
        </Feature>
      </Layout.Content>
    </>
  );
};
