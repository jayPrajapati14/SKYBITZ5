import React from "react";
import { Button, Divider } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForward";

export type FooterProps = {
  hasAssets: boolean;
  query: string;
  viewAllRef: React.RefObject<HTMLButtonElement>;
  handleOpenListView: (value: string) => void;
};

export const Footer: React.FC<FooterProps> = ({ hasAssets, query, viewAllRef, handleOpenListView }) =>
  hasAssets && query.length > 0 ? (
    <div className="tw-z-10 tw-bg-white">
      <Divider />
      <Button
        ref={viewAllRef}
        fullWidth
        className={`tw-flex tw-items-center tw-justify-start !tw-rounded-none !tw-p-3 hover:tw-bg-gray-200`}
        onClick={() => handleOpenListView(query)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenListView(query);
          }
        }}
      >
        <span className="tw-font-normal tw-text-text-primary">View all results</span>
        <ArrowForwardIosIcon fontSize="small" className="tw-ml-auto tw-text-gray-500" />
      </Button>
    </div>
  ) : null;
