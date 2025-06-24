import { NavBar } from "@/components/navbar/navbar";
import { APP_LINKS } from "@/routes";
import {
  useYardCheckActions,
  useYardCheckPaginationModel,
  useYardCheckFilterBar,
  useYardCheckFilters,
  useYardCheckFiltersCounts,
  useYardCheckFiltersEqual,
} from "@/store/yard-check.store";
import { Layout } from "@/views/layout/layout";
import { YardCheckFiltersBar } from "./components/yard-check-filters-bar-2";
import { YardCheckTable } from "./components/yard-check-table2";
import { useGetYardCheckAssets } from "./hooks/use-get-yard-check-assets-2";
import { Filters } from "@/components/filters/filters";
import { YardCheckFiltersPanel } from "./components/yard-check-filters-panel-2";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useUiStore } from "@/store/ui.store";
import { ReportsActionsMenu } from "../reports/components/reports-actions-menu-2";
import { YardCheckTile } from "@/views/dashboards/components/yard-check-tile";
import { YardCheckMap } from "@/views/yard-check/components/map/yard-check-map";
import { YardCheckAssetSortByField } from "@/domain/services/asset/asset.service";
import { Button } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { routeConfigs } from "@/infrastructure/ui/routes";
import { useIsMapExpanded } from "@/store/yard-check-map.store";
import { SidebarLayout } from "@/views/layout/sidebar-layout";

export function YardCheck2() {
  const count = useYardCheckFiltersCounts(true);
  const { setPaginationModel, setFilter, toggleFilterBar, resetViewFilters } = useYardCheckActions(true);
  const { asset, location, operational, sensor, display } = useYardCheckFilters(true);
  const paginationModel = useYardCheckPaginationModel();
  const showFilterBar = useYardCheckFilterBar();
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);
  const equal = useYardCheckFiltersEqual();
  const navigate = useNavigate();
  const isMapExpanded = useIsMapExpanded();

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
        <NavBar
          leftLinks={APP_LINKS.left}
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
            title="Yard Check Filters"
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
        <SidebarLayout>
          <SidebarLayout.Sidebar>
            <SidebarLayout.Widget title="Charts">
              <YardCheckTile view="yard-check" {...(!equal && { onResetFilters: () => resetViewFilters() })} />
            </SidebarLayout.Widget>
          </SidebarLayout.Sidebar>
          <SidebarLayout.Content>
            <div className={`tw-flex tw-flex-col tw-gap-3 ${isMapExpanded ? "tw-h-auto" : "tw-h-full"}`}>
              <div>
                <div
                  className={`tw-relative tw-border ${isMapExpanded ? "tw-mb-10" : "tw-h-[46px] tw-overflow-hidden"}`}
                >
                  <YardCheckMap isExpanded={isMapExpanded} />
                </div>
              </div>
              <div
                className={`tw-h-[calc(100%-60px)] ${isMapExpanded ? (showFilterBar ? "md:tw-h-screen-minus-toolbar" : "md:tw-h-screen-minus-header") : ""}`}
              >
                <YardCheckTable
                  rows={assetsQuery.data?.assets}
                  loading={assetsQuery.isFetching}
                  paginationModel={paginationModel}
                  onPaginationModelChange={onPaginationModelChange}
                  totalCount={assetsQuery.data?.totalCount ?? 0}
                  sortModel={sortModel}
                  onSortModelChange={onSortModelChange}
                  error={assetsQuery.error?.message}
                />
              </div>
            </div>
          </SidebarLayout.Content>
        </SidebarLayout>
      </Layout.Content>
    </>
  );
}
