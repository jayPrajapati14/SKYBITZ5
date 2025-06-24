import { FormControl, FormLabel } from "@mui/material";
import { ReactNode } from "react";
import { FilterPin } from "./filter-pin";

type FilterFormControlProps = {
  label: string;
  children: ReactNode;
  pinned?: boolean;
  onPinClick?: (status: boolean) => void;
};

export function FilterFormControl({ children, label, pinned = false, onPinClick }: FilterFormControlProps) {
  return (
    <FormControl fullWidth>
      <div className="tw-flex tw-items-center tw-justify-between">
        {label ? <FormLabel className="tw-mb-1">{label}</FormLabel> : null}
        {onPinClick ? <FilterPin isPinned={pinned} onPinClick={onPinClick} /> : null}
      </div>
      {children}
    </FormControl>
  );
}
