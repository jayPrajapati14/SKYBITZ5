import { useUiStore } from "@/store/ui.store";
import { Button } from "@mui/material";
import { DataGrid, DataGridProps, gridClasses, GridColumnResizeParams } from "@mui/x-data-grid";

type GripdProps = DataGridProps & {
  id: string;
  header?: React.ReactNode;
  error?: string;
  disabledMessage?: string;
};

function CustomHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="tw-flex tw-rounded-t tw-border tw-border-b-0 tw-border-gray-300 tw-px-2.5 tw-py-3">{children}</div>
  );
}

export function Grid({ id, header, error, disabledMessage, ...props }: GripdProps) {
  const { setTableColumnWidth } = useUiStore();

  const onColumnResize = (params: GridColumnResizeParams) => {
    setTableColumnWidth(id, params.colDef.field, params.width);
  };

  return (
    <div className="tw-flex tw-h-full tw-flex-col">
      {header && <CustomHeader>{header}</CustomHeader>}
      <DataGrid
        density="standard"
        disableRowSelectionOnClick
        disableColumnSelector
        disableColumnFilter
        onColumnResize={onColumnResize}
        sx={{
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: { outline: "none" },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: { outline: "none" },
          [`&.${gridClasses.root}`]: header ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : undefined,
          [`& .${gridClasses.cell}`]: {
            paddingTop: "8px",
            paddingBottom: "8px",
          },
          [`& .${gridClasses.columnHeaderTitle}`]: {
            whiteSpace: "normal",
          },
          [`& .${gridClasses["columnSeparator--resizable"]}`]: {
            opacity: "1 !important",
          },
        }}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <div className="tw-flex tw-items-center tw-justify-center tw-whitespace-pre tw-p-4 tw-pt-20 tw-text-center tw-text-base">
              {error ? (
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-4">
                  <span className="tw-text-gray-600">An error ocurred while fetching data</span>
                  <Button variant="text" color="primary" onClick={() => window.location.reload()}>
                    Try again
                  </Button>
                </div>
              ) : (
                (disabledMessage ?? "The filters applied don't return any results")
              )}
            </div>
          ),
        }}
        {...props}
      />
    </div>
  );
}
