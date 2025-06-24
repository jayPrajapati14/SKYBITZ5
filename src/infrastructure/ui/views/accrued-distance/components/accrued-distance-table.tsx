import { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { Grid } from "@/components/grid/grid";
import { IdCell } from "@/components/grid/cell-renderers/id-cell";
import { dateFormatter } from "@/domain/utils/datetime";
import { LastReportedCell } from "@/components/grid/cell-renderers/last-reported-cell";
import { useUser } from "@/infrastructure/ui/hooks/use-user";
import { useMemo } from "react";

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

  return useMemo<GridColDef<AccruedDistanceAsset>[]>(() => {
    return [
      {
        field: "assetId",
        headerName: "Asset Id",
        flex: 1,
        minWidth: 400,
        sortable: false,
        renderCell: ({ row }) => <IdCell assetId={row.assetId} />,
        display: "flex",
      },
      {
        field: "accruedDistanceInMiles",
        headerName: "Accrued Distance (miles)",
        width: 230,
        valueFormatter: (distance: number) => `${distance.toFixed(1)}`,
        display: "flex",
      },
      { field: "assetType", headerName: "Asset Type", width: 140, sortable: false, display: "flex" },
      { field: "deviceSerialNumber", headerName: "Device Serial Number", width: 200, sortable: false, display: "flex" },
      {
        field: "deviceInstallationDate",
        headerName: "Device Install Date",
        width: 180,
        valueFormatter: (value) => (value ? dateFormatter(value, user?.timezone) : ""),
        sortable: false,
        display: "flex",
      },
      {
        field: "arrivedAt",
        headerName: "Last Reported",
        width: 250,
        sortable: false,
        renderCell: ({ row }) => (
          <LastReportedCell landmark={row.lastReportedLandmark} arrivedAt={row.arrivedAt} timezone={user?.timezone} />
        ),
        display: "flex",
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
      id="accrued-distance-table"
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
    />
  );
}
