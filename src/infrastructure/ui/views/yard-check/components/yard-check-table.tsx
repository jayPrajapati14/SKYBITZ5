import { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { Grid } from "@/components/grid/grid";
import { IdCell } from "@/components/grid/cell-renderers/id-cell";
import { StatusCell } from "@/components/grid/cell-renderers/asset-status-cell";
import { dateFormatter } from "@/domain/utils/datetime";
import { useUser } from "@/infrastructure/ui/hooks/use-user";
import { useMemo } from "react";
import { formatTimePeriod } from "@/domain/utils/datetime";

type YardCheckTableProps = {
  rows?: YardCheckAsset[];
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  totalCount: number;
  disabledMessage?: string;
  error?: string;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  pageSizeOptions?: number[];
};

function useYardCheckColumns() {
  const user = useUser();
  return useMemo<GridColDef<YardCheckAsset>[]>(() => {
    return [
      {
        field: "lastReportedLandmark",
        headerName: "Landmark",
        minWidth: 180,
        flex: 1,
        display: "flex",
        sortable: false,
      },
      {
        field: "assetId",
        headerName: "Asset Id",
        minWidth: 180,
        renderCell: ({ row }) => <IdCell assetId={row.assetId} />,
        flex: 1,
        sortable: false,
        display: "flex",
      },
      {
        field: "arrivedAt",
        headerName: "Arrived",
        minWidth: 150,
        flex: 1,
        valueFormatter: (value) => (value ? dateFormatter(value, user?.timezone) : ""),
        sortable: false,
        display: "flex",
      },
      {
        field: "lastReportedTime",
        headerName: "Last Reported",
        minWidth: 150,
        flex: 1,
        valueFormatter: (value) => (value ? dateFormatter(value, user?.timezone) : ""),
        sortable: false,
        display: "flex",
      },
      {
        field: "idleTimeHours",
        headerName: "Idle Time",
        minWidth: 130,
        flex: 1,
        valueFormatter: (value) => (value ? formatTimePeriod(value ?? 0) : ""),
        display: "flex",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: ({ row }) => <StatusCell sensors={row.sensors} />,
        sortable: false,
        display: "flex",
      },
    ];
  }, [user]);
}

export function YardCheckTable({
  rows,
  loading,
  paginationModel,
  onPaginationModelChange,
  totalCount,
  error,
  disabledMessage,
  sortModel,
  onSortModelChange,
  pageSizeOptions = [25, 50, 100],
}: YardCheckTableProps) {
  const columns = useYardCheckColumns();

  return (
    <Grid
      id="yard-check-table"
      rows={rows}
      loading={loading}
      columns={columns}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={pageSizeOptions}
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      disableColumnMenu
      rowCount={totalCount}
      disableRowSelectionOnClick
      header={
        <div className="tw-flex tw-items-center tw-gap-4">
          <div className="tw-font-medium">Assets</div>
          <div className="tw-text-sm tw-text-gray-500">RESULTS: {totalCount.toLocaleString()}</div>
        </div>
      }
      error={error}
      disabledMessage={disabledMessage}
    />
  );
}
