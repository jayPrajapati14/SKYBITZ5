import { FormControl, Popover } from "@mui/material";
import { useFilterDropdown } from "./hooks/use-filter-dropdown";

export function FilterPopover({ children }: { children: React.ReactNode }) {
  const { open, anchorEl, handleClose } = useFilterDropdown();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <FormControl sx={{ m: 2, width: 350 }}>{children}</FormControl>
    </Popover>
  );
}
