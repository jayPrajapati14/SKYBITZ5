import { MouseEvent, useState } from "react";
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { GridOn, IosShare, PendingActions } from "@mui/icons-material";
import { ReportModal } from "./reports-modal";
import { useYardCheckFilters } from "@/store/yard-check.store";
import {
  getAccruedDistanceAssetsForExport,
  GetAccruedDistanceAssetsParams,
  getYardCheck2AssetsForExport,
  GetYardCheckAssetsParams,
} from "@/domain/services/asset/asset.service";
import { exportFile } from "@/domain/services/csv/csv.service";
import { useAccruedDistanceFilters } from "@/store/accrued-distance.store";
import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useUser } from "@/hooks/use-user";

type ReportsActionsMenuProps = {
  view: ViewType;
  totalResults?: number;
};

const RESULTS_THRESHOLD_FOR_DOWNLOAD_WARNING = 10000;

const formatDate = (date: Date | null, timezone: string): string => {
  if (!date) return "";

  const formattedDate = date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });

  return formattedDate.replace(",", "");
};

export function ReportsActionsMenu({ view, totalResults = 0 }: ReportsActionsMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const user = useUser();

  const { asset, location, display } = useYardCheckFilters(true);
  const { asset: accruedDistanceAsset, operational, display: accruedDistanceDisplay } = useAccruedDistanceFilters(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onConfirmDownloadReport = async () => {
    setIsGeneratingReport(true);

    const timezone = user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (view === "yard-check") {
      const options: GetYardCheckAssetsParams = {
        landmarkIds: location.names?.map((item) => item.id) ?? [],
        landmarkTypes: location.types?.map((item) => item.id) ?? [],
        landmarkGroups: location.groups?.map((item) => item.id) ?? [],
        excludedAssetIds: asset.excludedIds?.map((item) => item.id) ?? [],
        ids: asset.ids?.map((item) => item.id) ?? [],
        types: asset.types?.map((item) => item.id) ?? [],
        countries: location.countries?.map((item) => item.id) ?? [],
        zipCode: location.zipCode,
        sortBy: display?.sortBy,
      };

      const assets = await getYardCheck2AssetsForExport(options);

      const formattedAssets = assets.map(({ id: _, ...rest }) => ({
        ...rest,
        lastReportedTime: formatDate(rest.lastReportedTime, timezone),
        arrivedAt: formatDate(rest.arrivedAt, timezone),
      }));

      const date = new Date().toLocaleDateString("en-US").replace(/\//g, "-");
      exportFile(formattedAssets, `yard-check-report_${date}.csv`);
    } else if (view === "accrued-distance") {
      const options: GetAccruedDistanceAssetsParams = {
        ids: accruedDistanceAsset.ids?.map((item) => item.id) ?? [],
        dateRange: operational.dateRange,
        sortBy: accruedDistanceDisplay?.sortBy,
      };

      const assets = await getAccruedDistanceAssetsForExport(options);

      const formattedAssets = assets.map(({ id: _, ...rest }) => ({
        ...rest,
        arrivedAt: formatDate(rest.arrivedAt, timezone),
        deviceInstallationDate: formatDate(rest.deviceInstallationDate, timezone),
      }));

      const date = new Date().toLocaleDateString("en-US").replace(/\//g, "-");
      exportFile(formattedAssets, `accrued-distance-report_${date}.csv`);
    }

    setIsGeneratingReport(false);
    setIsDialogOpen(false);
    handleClose();
  };

  const handleDownloadCSV = () => {
    if (totalResults > RESULTS_THRESHOLD_FOR_DOWNLOAD_WARNING) {
      setIsDialogOpen(true);
    } else {
      onConfirmDownloadReport();
    }
  };

  const handleCreateSchedule = () => {
    setIsModalOpen(true);
    handleClose();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button startIcon={<IosShare />} onClick={handleClick}>
        Report
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {view !== "reports" ? (
          <MenuItem onClick={handleDownloadCSV}>
            <ListItemIcon>
              <GridOn />
            </ListItemIcon>
            <ListItemText>Download CSV Report...</ListItemText>
          </MenuItem>
        ) : null}

        {view !== "accrued-distance" && (
          <>
            <Divider />
            <MenuItem onClick={handleCreateSchedule}>
              <ListItemIcon>
                <PendingActions />
              </ListItemIcon>
              <ListItemText>Create & Schedule Report...</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
      <ReportModal open={isModalOpen} onClose={handleModalClose} />
      <ConfirmationDialog
        title="Download Report"
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        loading={isGeneratingReport}
        onConfirm={onConfirmDownloadReport}
        okButtonText="Continue Download"
        cancelButtonText="Cancel"
      >
        With your current filter selection, the number of results is large ({Intl.NumberFormat().format(totalResults)}).
        This may cause the download process to take longer. Do you want to continue or would you prefer to apply more
        restrictive filters before downloading the report?
      </ConfirmationDialog>
    </>
  );
}
