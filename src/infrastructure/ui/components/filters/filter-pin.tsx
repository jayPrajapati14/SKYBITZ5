import { IconButton, Tooltip } from "@mui/material";
import { PushPin } from "@mui/icons-material";
import clsx from "clsx";

type FilterPinProps = {
  isPinned: boolean;
  onPinClick: (status: boolean) => void;
};

export function FilterPin({ isPinned, onPinClick }: FilterPinProps) {
  return (
    <Tooltip title="Pinned to Filters Bar">
      <IconButton onClick={() => onPinClick(!isPinned)}>
        <PushPin
          fontSize="small"
          className={clsx("tw-cursor-pointer tw-text-xs tw-text-gray-400", {
            "tw-text-primary": isPinned,
            "tw-rotate-0": isPinned,
            "tw-rotate-45": !isPinned,
          })}
        />
      </IconButton>
    </Tooltip>
  );
}
