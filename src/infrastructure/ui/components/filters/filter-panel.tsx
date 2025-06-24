import { Button, Drawer, FormControlLabel, Switch } from "@mui/material";
import { Close, FilterAltOutlined } from "@mui/icons-material";
import { ReactNode } from "react";
import { Count } from "../count/count";
import { useUiStore } from "@/store/ui.store";

type FilterPanelProps = {
  count: number;
  children: ReactNode;
  onResetFilters?: () => void;
  showFilterBar?: boolean;
  onToggleFilterBar?: () => void;
  title?: string;
};

export function FilterPanel({
  count,
  children,
  onResetFilters,
  showFilterBar,
  onToggleFilterBar,
  title,
}: FilterPanelProps) {
  const openDrawer = useUiStore((state) => state.openDrawer);
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);

  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      onClose={toggleDrawer}
      classes={{
        paper: "tw-w-full md:tw-w-[480px]",
      }}
      ModalProps={{
        BackdropProps: {
          style: { backgroundColor: "transparent" },
        },
      }}
    >
      <div className="tw-z-0 tw-flex tw-h-full tw-flex-col tw-justify-between">
        <div className="tw-flex tw-items-center tw-justify-between tw-border">
          <div className="tw-flex tw-items-center tw-gap-2 tw-p-5 tw-pl-3">
            <FilterAltOutlined />
            <h3 className="tw-text-sm tw-font-medium tw-text-text-secondary">{title || "Filters"}</h3>
            <Count count={count} />
          </div>
          {onToggleFilterBar && (
            <FormControlLabel
              control={<Switch checked={showFilterBar} onChange={onToggleFilterBar} />}
              label="Filter Bar"
            />
          )}
        </div>
        <div className="tw-flex-1 tw-overflow-y-auto">{children}</div>
        <div id="actions-footer" className="tw-flex tw-justify-between tw-gap-2 tw-border-t tw-border-gray-300 tw-p-5">
          {onResetFilters && (
            <Button variant="text" startIcon={<Close />} onClick={() => onResetFilters()}>
              Clear All
            </Button>
          )}
          <div className="tw-flex tw-gap-2">
            <Button variant="text" onClick={toggleDrawer}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
