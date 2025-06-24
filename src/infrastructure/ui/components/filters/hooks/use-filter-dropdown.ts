import { useContext } from "react";
import { FilterDropdownContext } from "../filter-dropdown";

export function useFilterDropdown() {
  const context = useContext(FilterDropdownContext);
  if (!context) {
    throw new Error("useFilterDropdown must be used within a FilterDropwdownProvider");
  }
  return context;
}
