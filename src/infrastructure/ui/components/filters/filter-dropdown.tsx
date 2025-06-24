import React, { useState, createContext } from "react";

export const FilterDropdownContext = createContext<{
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleClose: () => void;
} | null>(null);

export function FilterDropdown({ children }: { children: React.ReactNode }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <FilterDropdownContext.Provider value={{ open, anchorEl, handleClick, handleClose }}>
      {children}
    </FilterDropdownContext.Provider>
  );
}
