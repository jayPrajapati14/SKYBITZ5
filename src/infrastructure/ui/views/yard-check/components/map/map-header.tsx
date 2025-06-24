import { IconButton } from "@mui/material";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

interface MapHeaderProps {
  isMapExpanded: boolean;
  onToogleMapBar: () => void;
}

export const MapHeaderBar = ({ isMapExpanded, onToogleMapBar }: MapHeaderProps): React.ReactNode => {
  return (
    <div className="tw-absolute tw-left-0 tw-top-0 tw-z-10 tw-flex tw-w-full tw-items-center tw-justify-between tw-bg-white/70 tw-px-4">
      <h1 className="tw-text-base tw-font-medium tw-text-text-secondary">Map</h1>
      <IconButton size="small" onClick={onToogleMapBar}>
        {isMapExpanded ? <KeyboardArrowUp fontSize="large" /> : <KeyboardArrowDown fontSize="large" />}
      </IconButton>
    </div>
  );
};
