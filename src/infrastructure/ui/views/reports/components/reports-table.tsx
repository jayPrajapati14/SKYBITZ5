import { GridColDef, GridMoreVertIcon, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { Grid } from "@/components/grid/grid";
import { useCallback, useMemo, useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { recurrenceSentence } from "../utils/recurrence-sentence";
import { dateRangeSentence } from "../utils/daterange-sentence";
import { CompactDateCell } from "@/components/grid/cell-renderers/compact-date-cell";
import { EmailReportDialog } from "./email-report-dialog";
import { RunReportOnDemandConfirmationDialog } from "./run-report-on-demand-confirmation-dialog";
import { DeleteReportConfirmationDialog } from "./delete-report-confirmation-dialog";
import { useUser } from "@/infrastructure/ui/hooks/use-user";
import { dayjs } from "@/infrastructure/dayjs/dayjs";

type ReportAction = (report: ReportFile) => void;

const OptionsMenu = ({
  row,
  onViewReport,
  onEditReport,
  onDownloadReport,
}: {
  row: ReportFile;
  onViewReport: (report: ReportFile) => void;
  onEditReport: (report: ReportFile) => void;
  onDownloadReport: (report: ReportFile) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openOnDemandDialog, setOnDemandDialog] = useState(false);
  const [openDeleteDialog, setDeleteDialog] = useState(false);

  const onOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onOptionClick = useCallback(
    (view: "view" | "download" | "email" | "run-on-demand" | "delete" | "edit") => {
      if (view === "email") setOpenEmailDialog(true);
      if (view === "run-on-demand") setOnDemandDialog(true);
      if (view === "delete") setDeleteDialog(true);
      if (view === "edit") onEditReport(row);
      if (view === "download") onDownloadReport(row);
      if (view === "view") onViewReport(row);
      setAnchorEl(null);
    },
    [row, onViewReport, onEditReport, onDownloadReport]
  );

  const menuItems = useMemo(() => {
    return [
      { label: "View", onClick: () => onOptionClick("view") },
      { label: "Edit", onClick: () => onOptionClick("edit") },
      { label: "Download", onClick: () => onOptionClick("download") },
      { label: "Email", onClick: () => onOptionClick("email") },
      { label: "Run on demand", onClick: () => onOptionClick("run-on-demand") },
      { label: "Delete", onClick: () => onOptionClick("delete") },
    ].map(({ label, onClick }) => (
      <MenuItem key={label} onClick={onClick}>
        {label}
      </MenuItem>
    ));
  }, [onOptionClick]);

  return (
    <>
      <IconButton onClick={onOpen}>
        <GridMoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {menuItems}
      </Menu>
      {openEmailDialog && (
        <EmailReportDialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)} report={row} />
      )}
      {openOnDemandDialog && (
        <RunReportOnDemandConfirmationDialog
          open={openOnDemandDialog}
          onClose={() => setOnDemandDialog(false)}
          report={row}
        />
      )}
      {openDeleteDialog && (
        <DeleteReportConfirmationDialog open={openDeleteDialog} onClose={() => setDeleteDialog(false)} report={row} />
      )}
    </>
  );
};

type ReportFileWithFiltersCount = ReportFile & {
  filtersCount?: number;
};

type ReportsTableProps = {
  rows: ReportFileWithFiltersCount[] | undefined;
  loading: boolean;
  error?: string;
  paginationModel: GridPaginationModel;
  pageSizeOptions?: number[];
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  totalCount: number;
  onViewReport: (report: ReportFile) => void;
  onEditReport: (report: ReportFile) => void;
  onDownloadReport: (report: ReportFile) => void;
  header?: React.ReactNode;
};

const getDaysFromDateRange = (dateRange: { from: Date; to: Date } | undefined) => {
  if (!dateRange) return "No date range";
  const days = dayjs(dateRange.to).diff(dayjs(dateRange.from), "day");
  return `Past ${days} days`;
};

const getDaysFromLastReported = (lastReported: number | undefined) => {
  if (!lastReported) return "No date range";
  const days = dayjs().diff(dayjs().subtract(lastReported, "day"), "day");
  return `Past ${days} days`;
};

const getDays = (filters: AccruedDistanceFilters | YardCheckFilters) => {
  if ("dateRange" in filters.operational) return getDaysFromDateRange(filters.operational.dateRange);
  if ("lastReported" in filters.operational) return getDaysFromLastReported(filters.operational.lastReported);
  return "No date range";
};

function useColumns(onViewReport: ReportAction, onEditReport: ReportAction, onDownloadReport: ReportAction) {
  const user = useUser();

  const columns = useMemo<GridColDef<ReportFileWithFiltersCount>[]>(
    () =>
      [
        { field: "name", headerName: "Report Name", minWidth: 200, flex: 0.5, sortable: false },
        {
          field: "view",
          headerName: "Based on view",
          width: 200,
          sortable: false,
          renderCell: ({ row }) => (
            <div className="tw-flex tw-h-full tw-flex-col tw-justify-center tw-text-sm">
              <a
                className="tw-font-medium tw-text-primary"
                /* onClick={() => onViewReport(row)} */
              >
                Assets: {row.type === "YARD_CHECK" ? "Yard Check" : "Accrued Distance"}
              </a>
              {row.filtersCount} filters; {getDays(row.filters)}
            </div>
          ),
        },
        {
          field: "createdAt",
          width: 150,
          headerName: "Created At",
          type: "dateTime",
          sortable: false,
          renderCell: ({ row }) => <CompactDateCell date={row.createdAt} timezone={user?.timezone} />,
        },
        {
          field: "recurrence",
          headerName: "Schedule",
          minWidth: 400,
          flex: 1,
          sortable: false,
          renderCell: ({ row }) => (
            <div className="tw-flex tw-h-full tw-flex-col tw-justify-center tw-text-wrap tw-text-sm">
              {row.recurrence.frequency !== "ONCE" ? (
                <>
                  <div className="tw-truncate" title={`Runs ${recurrenceSentence(row.recurrence)}`}>
                    Runs {recurrenceSentence(row.recurrence)}
                  </div>
                  <div className="tw-truncate" title={dateRangeSentence(row.recurrence)}>
                    {dateRangeSentence(row.recurrence)}
                  </div>
                </>
              ) : (
                "Does not repeat"
              )}
            </div>
          ),
        },
        { field: "recipientsCount", headerName: "Recipients", maxWidth: 90, sortable: false },
        {
          field: "lastRun",
          headerName: "Last Run",
          minWidth: 120,
          type: "dateTime",
          sortable: false,
          renderCell: ({ row }) =>
            row.lastRun ? <CompactDateCell date={row.lastRun} timezone={user?.timezone} /> : "Never ran",
        },
        {
          field: "nextRun",
          headerName: "Next Run",
          minWidth: 120,
          type: "dateTime",
          sortable: false,
          renderCell: ({ row }) =>
            row.nextRun ? <CompactDateCell date={row.nextRun} timezone={user?.timezone} /> : "Already run",
        },
        {
          field: "options",
          align: "right",
          headerClassName: "!tw-hidden",
          width: 50,
          renderCell: ({ row }) => (
            <OptionsMenu
              row={row}
              onViewReport={onViewReport}
              onEditReport={onEditReport}
              onDownloadReport={onDownloadReport}
            />
          ),
        },
      ] as const,
    [onViewReport, onEditReport, onDownloadReport]
  );
  return columns;
}

export function ReportsTable({
  rows,
  loading,
  paginationModel,
  totalCount,
  error,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  pageSizeOptions = [25, 50, 100],
  onViewReport,
  onEditReport,
  onDownloadReport,
  header,
}: ReportsTableProps) {
  const columns = useColumns(onViewReport, onEditReport, onDownloadReport);

  return (
    <Grid
      id="reports-table"
      header={header}
      loading={loading}
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      rowCount={totalCount}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={pageSizeOptions}
      paginationMode="server"
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      disableRowSelectionOnClick
      disableColumnMenu
      error={error}
    />
  );
}
