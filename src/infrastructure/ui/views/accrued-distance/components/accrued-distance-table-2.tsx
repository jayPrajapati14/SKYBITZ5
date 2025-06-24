import { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { Grid } from "@/components/grid/grid";
import { IdCell } from "@/components/grid/cell-renderers/id-cell";
import { CompactDateCell } from "@/components/grid/cell-renderers/compact-date-cell";
import { LastReportedCell } from "@/components/grid/cell-renderers/last-reported-cell";
import { useUser } from "@/infrastructure/ui/hooks/use-user";
import { useMemo } from "react";
import { useUiStore } from "@/store/ui.store";

type AccruedDistanceTableProps = {
  rows?: AccruedDistanceAsset[];
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  totalCount: number;
  error?: string;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  pageSizeOptions?: number[];
};

function useAccruedDistanceColumns() {
  const user = useUser();
  const { getTableColumnWidthParameters } = useUiStore();
  return useMemo<GridColDef<AccruedDistanceAsset>[]>(() => {
    return [
      {
        field: "assetId",
        headerName: "Asset Id",
        sortable: false,
        renderCell: ({ row }) => <IdCell assetId={row.assetId} />,
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "accrued-distance-table-2",
          columnId: "assetId",
          minWidth: 128,
        }),
      },
      {
        field: "accruedDistanceInMiles",
        headerName: "Accrued Distance (miles)",
        valueFormatter: (distance: number) => `${distance.toFixed(1)}`,
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "accrued-distance-table-2",
          columnId: "accruedDistanceInMiles",
          minWidth: 128,
        }),
      },
      {
        field: "assetType",
        headerName: "Asset Type",
        sortable: false,
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "accrued-distance-table-2",
          columnId: "assetType",
          minWidth: 128,
        }),
      },
      {
        field: "deviceSerialNumber",
        headerName: "Device Serial Number",
        sortable: false,
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "accrued-distance-table-2",
          columnId: "deviceSerialNumber",
          minWidth: 140,
        }),
      },
      {
        field: "deviceInstallationDate",
        headerName: "Device Install Date",
        renderCell: ({ value }) => <CompactDateCell date={value} timezone={user?.timezone} />,
        sortable: false,
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "accrued-distance-table-2",
          columnId: "deviceInstallationDate",
          minWidth: 128,
        }),
      },
      {
        field: "arrivedAt",
        renderHeader: () => (
          <div className="tw-font-medium">
            <div>Last Yard </div>
            <div>(when report ran)</div>
          </div>
        ),
        sortable: false,
        renderCell: ({ row }) => (
          <LastReportedCell landmark={row.lastReportedLandmark} arrivedAt={row.arrivedAt} timezone={user?.timezone} />
        ),
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "accrued-distance-table-2",
          columnId: "arrivedAt",
          minWidth: 200,
        }),
      },
    ];
  }, [user]);
}

export function AccruedDistanceTable({
  rows,
  loading,
  paginationModel,
  onPaginationModelChange,
  totalCount,
  error,
  sortModel,
  onSortModelChange,
  pageSizeOptions = [25, 50, 100],
}: AccruedDistanceTableProps) {
  const columns = useAccruedDistanceColumns();

  return (
    <Grid
      id="accrued-distance-table-2"
      rows={rows}
      loading={loading}
      columns={columns}
      getRowId={(row: AccruedDistanceAsset) => row.id}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={pageSizeOptions}
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      disableColumnMenu={true}
      rowCount={totalCount}
      disableRowSelectionOnClick
      header={
        <div className="tw-flex tw-items-center tw-gap-4">
          <div className="tw-font-medium">Assets</div>
          <div className="tw-text-sm tw-text-gray-500">RESULTS: {totalCount.toLocaleString()}</div>
        </div>
      }
      error={error}
      getRowHeight={() => "auto"}
    />
  );
}
