import { ReactNode } from "react";
import { FiltersBar } from "./filters-bar";
import { FilterPanel } from "./filter-panel";
import { FilterDropdown } from "./filter-dropdown";
import { FilterPopover } from "./filter-popover";
import { FilterChip } from "./filter-chip";

type FiltersProps = {
  children: ReactNode;
};

export function Filters({ children }: FiltersProps) {
  return children;
}
Filters.Dropdown = FilterDropdown;
Filters.Popover = FilterPopover;
Filters.Chip = FilterChip;
Filters.Bar = FiltersBar;
Filters.Panel = FilterPanel;
