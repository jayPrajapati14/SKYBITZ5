import { MouseEvent, useState } from "react";
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { GridOn, IosShare } from "@mui/icons-material";
import { ReportModal } from "./reports-modal";
import { getReportsForExport } from "@/domain/services/report/report.service";
import { exportFile } from "@/domain/services/csv/csv.service";
import { useUser } from "@/infrastructure/ui/hooks/use-user";
import { dateFormatter } from "@/domain/utils/datetime";
import { recurrenceSentence } from "../utils/recurrence-sentence";
import { dateRangeSentence } from "../utils/daterange-sentence";
import { getDays } from "@/infrastructure/ui/views/reports/components/reports-table-2";

function schedule(frequency: Frequency, recurrence: Recurrence) {
  if (frequency !== "ONCE") {
    return `Runs ${recurrenceSentence(recurrence)} ${dateRangeSentence(recurrence)}`;
  } else {
    return "Does not repeat";
  }
}

function formatReport(report: ReportFile & { filtersCount: number }, user?: User) {
  return {
    reportName: report.name,
    basedOnView: `Assets: ${report.type === "YARD_CHECK" ? "Yard Check" : "Accrued Distance"} \n ${report.filtersCount ?? 0} filters; ${getDays(report.filters)}`,
    created: dateFormatter(report.createdAt as Date, user?.timezone),
    schedule: schedule(report.recurrence.frequency, report.recurrence),
    recipients: report.recipientsCount,
    lastRun: report.lastRun ? dateFormatter(report.lastRun, user?.timezone) : "Never ran",
    nextRun: report.nextRun ? dateFormatter(report.nextRun, user?.timezone) : "Schedule ended",
  };
}

export function ReportsDownloadMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const user = useUser();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCSV = async () => {
    const reports = await getReportsForExport();
    const date = new Date().toLocaleDateString("en-US").replace(/\//g, "-");
    const formattedReports = reports.map((report) => formatReport(report, user));
    exportFile(formattedReports, `reports_${date}.csv`);
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
        <MenuItem onClick={handleDownloadCSV}>
          <ListItemIcon>
            <GridOn />
          </ListItemIcon>
          <ListItemText>Download CSV Report...</ListItemText>
        </MenuItem>
      </Menu>
      <ReportModal open={isModalOpen} onClose={handleModalClose} />
    </>
  );
}
