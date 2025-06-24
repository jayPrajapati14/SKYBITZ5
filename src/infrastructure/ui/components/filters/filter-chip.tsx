import { ExpandMore } from "@mui/icons-material";
import { Avatar, Chip } from "@mui/material";
import { useFilterDropdown } from "./hooks/use-filter-dropdown";
import { useRef } from "react";

export function FilterChip({
  count,
  label,
  hideCount,
  onClick,
}: {
  count: number;
  label: string;
  hideCount?: boolean;
  onClick?: () => void;
}) {
  const { handleClick } = useFilterDropdown();

  const ref = useRef<HTMLDivElement>(null);

  return (
    <Chip
      ref={ref}
      color={count > 0 ? "secondary" : undefined}
      variant="outlined"
      label={label}
      avatar={count > 0 && !hideCount ? <Avatar>{count}</Avatar> : undefined}
      size="small"
      onDelete={() => ref.current?.click()}
      deleteIcon={<ExpandMore />}
      onClick={onClick ?? handleClick}
      sx={count > 0 ? { "&.MuiChip-root": { backgroundColor: "rgba(156, 39, 176, 0.05)" } } : undefined}
    />
  );
}
