import { NavBar } from "@/components/navbar/navbar";
import { APP_LINKS } from "@/routes";
import {
  useAccruedDistanceActions,
  useAccruedDistanceFilters,
  useAccruedDistanceFiltersCounts,
  useAccruedDistancePaginationModel,
  useAccruedDistanceFilterBar,
} from "@/store/accrued-distance.store";
import { Layout } from "../layout/layout";
import { AccruedDistanceFiltersBar } from "./components/accrued-distance-filters-bar";
import { AccruedDistanceTable } from "./components/accrued-distance-table";
import { Filters } from "@/components/filters/filters";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useGetAccruedDistanceAssets } from "./hooks/use-get-accrued-distance-assets";
import { AccruedDistanceFiltersPanel } from "./components/accrued-distance-filters-panel";
import { useUiStore } from "@/store/ui.store";
import { ReportsActionsMenu } from "../reports/components/reports-actions-menu";
import { AccruedDistanceAssetSortByField } from "@/domain/services/asset/asset.service";
import { useUser } from "@/hooks/use-user";
import { dayjs } from "@/infrastructure/dayjs/dayjs";

export function AccruedDistance() {
  const count = useAccruedDistanceFiltersCounts(true);
  const { asset, operational, display } = useAccruedDistanceFilters(true);
  const paginationModel = useAccruedDistancePaginationModel();
  const showFilterBar = useAccruedDistanceFilterBar();
  const { resetViewFilters, setPaginationModel, toggleFilterBar, setFilter } = useAccruedDistanceActions(true);
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);
  const user = useUser();

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
        ? { field: model[0].field as AccruedDistanceAssetSortByField, order: model[0].sort as SortDirection }
        : undefined;

    setFilter("display", "sortBy", sortBy);
  };

  const timezone = user?.timezone ?? dayjs.tz.guess();

  // 1. Start date at 00:00
  // 2. End date at 23:59:59
  // 3. Convert from user timezone to UTC
  const dateRange = {
    from: dayjs(operational.dateRange?.from || new Date(new Date().setDate(new Date().getDate() - 7)))
      .tz(timezone, true)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate(),
    to: dayjs(operational.dateRange?.to || new Date())
      .tz(timezone, true)
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(999)
      .toDate(),
  };

  const assetsQuery = useGetAccruedDistanceAssets({
    ids: asset.ids?.map((item) => item.id) ?? [],
    dateRange,
    sortBy: display?.sortBy,
    limit: paginationModel.pageSize,
    offset: paginationModel.page * paginationModel.pageSize,
  });

  return (
    <>
      <Layout.Title>Accrued Distance</Layout.Title>
      <Layout.Controls>
        <NavBar
          leftLinks={APP_LINKS.left}
          rightLinks={APP_LINKS.right}
          filtersCount={count.total}
          toggleDrawer={toggleDrawer}
          rightSection={<ReportsActionsMenu view="accrued-distance" totalResults={assetsQuery.data?.totalCount ?? 0} />}
        />

        <Filters>
          {showFilterBar && (
            <Filters.Bar>
              <AccruedDistanceFiltersBar />
            </Filters.Bar>
          )}

          <Filters.Panel
            count={count.total}
            onResetFilters={() => resetViewFilters(true)}
            showFilterBar={showFilterBar}
            onToggleFilterBar={toggleFilterBar}
          >
            <AccruedDistanceFiltersPanel view="accrued-distance" />
          </Filters.Panel>
        </Filters>
      </Layout.Controls>

      <Layout.Content>
        <AccruedDistanceTable
          rows={assetsQuery.data?.assets}
          loading={assetsQuery.isFetching}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          totalCount={assetsQuery.data?.totalCount ?? 0}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          error={assetsQuery.error?.message}
        />
      </Layout.Content>
    </>
  );
}
