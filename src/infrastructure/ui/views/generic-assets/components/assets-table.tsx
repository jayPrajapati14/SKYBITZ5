import { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { Grid } from "@/components/grid/grid";
import { IdCell } from "@/components/grid/cell-renderers/id-cell";
import { StatusCell } from "@/components/grid/cell-renderers/asset-status-cell";
import { TimePeriodCell } from "@/components/grid/cell-renderers/time-period-cell";
import { useUser } from "@/infrastructure/ui/hooks/use-user";
import { useMemo } from "react";
import { LocationCell } from "@/components/grid/cell-renderers/location-cell";
import { CompactDateCell } from "@/components/grid/cell-renderers/compact-date-cell";
import { useUiStore } from "@/store/ui.store";
import { TextEllipsis } from "@/components/grid/cell-renderers/text-ellipsis";

type AssetsTableProps = {
  rows?: GenericAsset[];
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

function useAssetsColumns() {
  const user = useUser();
  const { getTableColumnWidthParameters } = useUiStore();
  return useMemo<GridColDef<GenericAsset>[]>(() => {
    return [
      {
        field: "lastReportedLandmark",
        headerName: "Last Location",
        renderCell: ({ row }) => (
          <LocationCell
            landmarkName={row.lastReportedLandmark}
            type={row.geoType}
            direction={row.direction}
            miles={row.distanceFromLandmarkInMiles}
            city={row.geoCity}
            state={row.geoState}
            zip={row.geoZipCode}
          />
        ),
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "lastReportedLandmark",
          minWidth: 230,
        }),
      },
      {
        field: "assetId",
        headerName: "Asset Id",
        renderCell: ({ row }) => <IdCell assetId={row.assetId} />,
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "assetId",
          minWidth: 128,
        }),
      },
      {
        field: "deviceSerialNumber",
        headerName: "Device Serial Number",
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "deviceSerialNumber",
          minWidth: 190,
        }),
        renderCell: ({ value }) => <TextEllipsis value={value} />,
      },
      {
        field: "startTime",
        headerName: "Start Time",
        renderCell: ({ value }) => (value ? <CompactDateCell date={value} timezone={user?.timezone} /> : ""),
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "startTime",
          minWidth: 128,
        }),
      },
      {
        field: "duration",
        headerName: "Duration",
        renderCell: ({ row }) => <TimePeriodCell hours={row.duration ?? 0} status="MOVING" />,
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "duration",
          minWidth: 128,
        }),
      },
      {
        field: "idleTimeHours",
        headerName: "Idle Time",
        display: "flex",
        renderCell: ({ row }) => <TimePeriodCell hours={row.idleTimeHours ?? 0} status="IDLE" />,
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "idleTimeHours",
          minWidth: 128,
        }),
      },
      {
        field: "arrivedAt",
        headerName: "Arrived",
        display: "flex",
        renderCell: ({ row }) => <CompactDateCell date={row.arrivedAt} timezone={user?.timezone} />,
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "arrivedAt",
          minWidth: 128,
        }),
      },
      {
        field: "lastReportedTime",
        headerName: "Last Reported",
        display: "flex",
        renderCell: ({ row }) => <CompactDateCell date={row.lastReportedTime} timezone={user?.timezone} />,
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "lastReportedTime",
          minWidth: 140,
        }),
      },
      {
        field: "assetType",
        headerName: "Asset Type",
        display: "flex",
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "assetType",
          minWidth: 128,
        }),
        renderCell: ({ value }) => <TextEllipsis value={value} />,
      },
      {
        field: "status",
        headerName: "Status",
        display: "flex",
        renderCell: ({ row }) => <StatusCell sensors={row.sensors} />,
        sortable: false,
        ...getTableColumnWidthParameters({
          tableId: "assets-table",
          columnId: "status",
          minWidth: 168,
        }),
      },
    ];
  }, [user]);
}

export function AssetsTable({
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
}: AssetsTableProps) {
  const columns = useAssetsColumns();

  return (
    <Grid
      id="assets-table"
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
          <div className="tw-text-base tw-font-medium tw-text-text-secondary">Assets</div>
          <div className="tw-text-sm tw-text-gray-500">RESULTS: {totalCount.toLocaleString()}</div>
        </div>
      }
      error={error}
      disabledMessage={disabledMessage}
      getRowHeight={() => "auto"}
    />
  );
}
