import { Layout } from "@/views/layout/layout";
import { NavBar } from "@/components/navbar/navbar";
import { useUiStore } from "@/store/ui.store";
import { APP_LINKS } from "@/routes";
// import { ReportsActionsMenu } from "../reports/components/reports-actions-menu";
import { AssetsTable } from "./components/assets-table";
import { useGetMovingAssets } from "./hooks/use-get-moving-assets";
import {
  useMovingAssetActions,
  useMovingAssetPaginationModel,
  useMovingAssetFilterBar,
  useMovingAssetFilters,
  useMovingAssetFiltersCounts,
  useMovingAssetFiltersEqual,
} from "@/store/moving-asset.store";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { MovingAssetSortByField } from "@/domain/services/asset/asset.service";
import { Filters } from "@/components/filters/filters";
import { MovingAssetsFiltersPanel } from "./components/moving-assets-filters-panel";
import { MovingAssetsFiltersBar } from "./components/moving-assets-filters-bar";
import { Feature } from "@/components/feature-flag";
import { MovingAssetsTile } from "@/views/dashboards/components/moving-assets-tile";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { routeConfigs } from "@/infrastructure/ui/routes";
import { Button } from "@mui/material";
import { SidebarLayout } from "@/views/layout/sidebar-layout";

export const MovingAssets = () => {
  const count = useMovingAssetFiltersCounts(true);
  const { setPaginationModel, setFilter, toggleFilterBar, resetViewFilters } = useMovingAssetActions(true);
  const { asset, location, operational, sensor, display } = useMovingAssetFilters(true);
  const paginationModel = useMovingAssetPaginationModel();
  const showFilterBar = useMovingAssetFilterBar();
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);
  const equal = useMovingAssetFiltersEqual();
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
        ? { field: model[0].field as MovingAssetSortByField, order: model[0].sort as SortDirection }
        : undefined;

    setFilter("display", "sortBy", sortBy);
  };

  const assetsQuery = useGetMovingAssets({
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
        <Feature flag="moving-assets">
          <Filters>
            {showFilterBar && (
              <Filters.Bar>
                <MovingAssetsFiltersBar />
              </Filters.Bar>
            )}
            <Filters.Panel
              count={count.total}
              onResetFilters={() => resetViewFilters(true)}
              showFilterBar={showFilterBar}
              onToggleFilterBar={toggleFilterBar}
              title="Moving Assets Filters"
            >
              <MovingAssetsFiltersPanel view="moving-assets" />
            </Filters.Panel>
          </Filters>
        </Feature>
      </Layout.Controls>
      <Layout.Content>
        <Feature flag="moving-assets">
          <SidebarLayout>
            <SidebarLayout.Sidebar>
              <SidebarLayout.Widget title="Charts">
                <MovingAssetsTile view="moving-assets" {...(!equal && { onResetFilters: () => resetViewFilters() })} />
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
