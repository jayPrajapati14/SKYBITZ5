import React from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface HeaderProps {
  hasAssets: boolean;
  query: string;
  closeRef: React.RefObject<HTMLButtonElement>;
  setOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ hasAssets, query, closeRef, setOpen }) => (
  <div className="tw-relative tw-z-10 tw-mt-[70px] tw-flex tw-items-center tw-justify-between tw-bg-white tw-pl-3">
    {hasAssets && query.length > 0 && (
      <h1 className="tw-mb-3 tw-text-sm tw-font-normal tw-text-text-secondary">ASSETS</h1>
    )}
    <div className="tw-absolute tw-right-[15px] tw-top-[-55px]">
      <IconButton ref={closeRef} className="!tw-p-0" onClick={() => setOpen(false)}>
        <CloseIcon />
      </IconButton>
    </div>
  </div>
);
