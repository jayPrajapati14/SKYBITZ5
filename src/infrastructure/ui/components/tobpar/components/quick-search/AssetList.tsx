import React from "react";
import { Button } from "@mui/material";

interface AssetListProps {
  options: QuickSearchResult;
  query: string;
  itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  openAssetDetailsPage: (assetId: Nullable<string>) => void;
  highlightMatch: (text: string, query: string) => string;
}

export const AssetList: React.FC<AssetListProps> = ({
  options,
  query,
  itemRefs,
  openAssetDetailsPage,
  highlightMatch,
}) =>
  options.assets.map((option, index) => (
    <div
      ref={(el) => (itemRefs.current[index] = el)}
      className={`group tw-grid tw-grid-cols-12 tw-gap-1 tw-p-3 hover:tw-cursor-pointer hover:tw-bg-gray-50 focus:tw-bg-gray-100 focus:tw-outline-none`}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        openAssetDetailsPage(option.assetId);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          openAssetDetailsPage(option.assetId);
        }
      }}
      key={option.id}
    >
      <div className="tw-col-span-12 md:tw-col-span-10">
        <div className="tw-cursor-pointer">
          <p
            className="tw-text-sm tw-text-text-primary"
            dangerouslySetInnerHTML={{ __html: highlightMatch(option.assetId || "- No Asset Id -", query) }}
          />
          <p
            className="tw-text-sm tw-font-normal tw-text-text-secondary"
            dangerouslySetInnerHTML={{
              __html: highlightMatch(
                `Type: ${option.assetType || "None"} ${option.deviceSerialNumber ? "| Device Serial No: " + option.deviceSerialNumber : ""}`,
                query
              ),
            }}
          />
        </div>
      </div>
      <div className="tw-col-span-12 tw-pt-1 md:tw-col-span-2">
        <div className="tw-flex tw-h-full tw-justify-start tw-gap-1">
          <Button
            className="tw-h-full tw-opacity-0 group-hover:tw-opacity-100"
            tabIndex={-1}
            variant="text"
            onClick={(e) => {
              e.stopPropagation();
              openAssetDetailsPage(option.assetId);
            }}
          >
            DETAILS
          </Button>
        </div>
      </div>
    </div>
  ));
