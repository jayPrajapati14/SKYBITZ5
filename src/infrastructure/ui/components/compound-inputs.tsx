import { ReactNode } from "react";
import { Grid2 as Grid } from "@mui/material";

interface CompoundInputProps {
  children: ReactNode;
  className?: string;
}

export function CompoundInput({ children, className = "" }: CompoundInputProps) {
  return (
    <Grid container className={`tw-rounded-md tw-ring-1 tw-ring-gray-300 ${className}`}>
      {children}
    </Grid>
  );
}

CompoundInput.Left = ({ children }: { children: ReactNode }) => <Grid size={{ xs: 6 }}>{children}</Grid>;
CompoundInput.Right = ({ children }: { children: ReactNode }) => <Grid size={{ xs: 6 }}>{children}</Grid>;
