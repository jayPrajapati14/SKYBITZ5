import { ReactNode, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { ArrowOutward } from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";
import { FilterAltOutlined, RefreshSharp } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

type TileProps = {
  title: string;
  link?: string;
  className?: string;
  children: ReactNode;
  toogleFilter?: () => void;
  tooltip?: ReactNode;
  onResetFilters?: () => void;
  count?: number;
};

export const Tile = ({ title, link, className, children, toogleFilter, tooltip, onResetFilters, count }: TileProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleTooltipOpenHover = () => {
    if (!isClicked) {
      setTooltipOpen(true);
    }
  };

  const handleTooltipCloseHover = () => {
    if (!isClicked) {
      setTooltipOpen(false);
    }
  };

  const handleToggle = () => {
    toogleFilter?.();
    setTooltipOpen(true);
    setIsClicked(true);
  };

  const handleClickAway = () => {
    if (isClicked) {
      setTooltipOpen(false);
      setIsClicked(false);
    }
  };

  return (
    <div
      className={clsx(
        "tw-relative tw-mx-auto tw-flex tw-w-full tw-flex-col tw-gap-2 tw-rounded-md tw-border tw-p-4 tw-pt-2 lg:tw-min-w-[428px] lg:tw-max-w-[428px]",
        className
      )}
    >
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-base tw-font-medium tw-leading-8 tw-text-text-secondary">{title}</h1>
        {toogleFilter && (
          <ClickAwayListener onClickAway={handleClickAway}>
            <div>
              <Tooltip
                title={tooltip || ""}
                placement="top-start"
                open={tooltipOpen}
                disableFocusListener
                disableTouchListener
                PopperProps={{
                  sx: { zIndex: 1100 },
                }}
              >
                <IconButton
                  onClick={handleToggle}
                  onMouseEnter={handleTooltipOpenHover}
                  onMouseLeave={handleTooltipCloseHover}
                  className="!tw-rounded-none !tw-p-1"
                >
                  <span className="tw-text-xs tw-font-medium tw-text-text-primary">{count}</span>
                  <FilterAltOutlined />
                </IconButton>
              </Tooltip>
            </div>
          </ClickAwayListener>
        )}
        {onResetFilters && (
          <Button startIcon={<RefreshSharp />} onClick={onResetFilters} color="secondary">
            Reset
          </Button>
        )}
      </div>
      {link && (
        <div className="tw-absolute tw-right-3 tw-top-3">
          <Link
            to={link}
            className="tw-flex tw-items-center tw-gap-1 tw-text-sm tw-font-medium tw-text-primary hover:tw-text-primary/80"
          >
            View all
            <ArrowOutward sx={{ fontSize: "16px" }} />
          </Link>
        </div>
      )}
      <div className="tw-mt-6">{children}</div>
    </div>
  );
};
