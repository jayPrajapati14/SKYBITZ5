import { useRef, useCallback } from "react";
import { Dialog, DialogTitle, DialogActions, DialogContent, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ReportsDialogForm } from "./reports-dialog-form";
import { Dayjs, dayjs } from "@/infrastructure/dayjs/dayjs";
import { useYardCheckFilters } from "@/store/yard-check.store";
import { useAccruedDistanceFilters } from "@/store/accrued-distance.store";
import { useLocation } from "react-router-dom";
import { DialogFormRef, ReportsDialogFormData } from "./reports-dialog.form.types";
import { useSaveReport } from "@/views/reports/hooks/use-save-report";
import { useShowNotification } from "@/components/notifications/useShowNotification";
import { useUser } from "@/hooks/use-user";

type ReportModalProps = {
  open: boolean;
  onClose: () => void;
  report?: ReportFile;
};

const pathToTypeMap: Record<string, ReportFile["type"]> = {
  "/ng/yard-check": "YARD_CHECK",
  "/ng/accrued-distance": "ACCRUED_DISTANCE",
};

export function ReportModal({ open, onClose, report }: ReportModalProps) {
  const user = useUser();
  const formRef = useRef<DialogFormRef>(null);
  const { pathname } = useLocation();
  const yardCheckFilters = useYardCheckFilters(true);
  const accruedDistanceFilters = useAccruedDistanceFilters(true);
  const isEditing = Boolean(report);
  const showNotification = useShowNotification();

  const reportType = report?.id ? report.type : (pathToTypeMap[pathname] ?? "YARD_CHECK");

  const saveReport = useSaveReport({
    onSuccess: onClose,
  });

  const getRecurrence = (formData: ReportsDialogFormData): Recurrence => {
    const baseRecurrence = {
      time: formData.time,
      timezone: formData.timezone,
      interval: formData.interval,
      start: formData.start ?? null,
      end: formData.end ?? null,
    } as RecurrenceBase;

    if (formData.frequency === "ONCE") {
      return {
        ...baseRecurrence,
        frequency: "ONCE",
      };
    }

    if (formData.frequency === "HOURLY") {
      return {
        ...baseRecurrence,
        frequency: "HOURLY",
      };
    }

    if (formData.frequency === "DAILY") {
      return {
        ...baseRecurrence,
        frequency: "DAILY",
      };
    }

    if (formData.frequency === "WEEKLY") {
      return {
        ...baseRecurrence,
        frequency: "WEEKLY",
        days: formData.days,
      };
    }

    if (formData.frequency === "MONTHLY") {
      return {
        ...baseRecurrence,
        frequency: "MONTHLY",
        ordinal: formData.ordinal,
        day: formData.day,
      };
    }

    if (formData.frequency === "YEARLY") {
      return {
        ...baseRecurrence,
        frequency: "YEARLY",
        months: formData.months,
        ordinal: formData.ordinal,
        day: formData.day,
      };
    }

    throw new Error("Invalid frequency");
  };

  const handleSubmit = useCallback(() => {
    if (formRef.current) {
      const formData = formRef.current.submit();
      if (!formData) {
        return;
      }

      const reportData = {
        id: report?.id,
        name: formData.reportName,
        recurrence: getRecurrence(formData),
        type: formData.type,
        recipients: formData.recipients,
      };

      if (reportData.recipients.length === 0) {
        showNotification({
          message: `Please add at least one email address to create a report`,
          type: "error",
        });
        return;
      }

      if (isInvalidDate(reportData.recurrence) && reportData.recurrence.frequency != "ONCE") {
        showNotification({
          message: `Select valid start and end dates to proceed with creating the report`,
          type: "error",
        });
        return;
      }

      if (reportType === "YARD_CHECK") {
        saveReport.mutate({
          ...reportData,
          filters: {
            type: reportType,
            values: report?.type === "YARD_CHECK" && report?.filters ? report?.filters : yardCheckFilters,
          },
        });
      }

      if (reportType === "ACCRUED_DISTANCE") {
        saveReport.mutate({
          ...reportData,
          filters: {
            type: reportType,
            values: report?.type === "ACCRUED_DISTANCE" ? report?.filters : accruedDistanceFilters,
          },
        });
      }
    }
  }, [
    accruedDistanceFilters,
    saveReport,
    report?.filters,
    report?.id,
    report?.type,
    reportType,
    yardCheckFilters,
    showNotification,
  ]);

  const isInvalidDate = ({ start, end }: RecurrenceBase): boolean => {
    const startDate = start ? dayjs(start).startOf("day") : null;
    const endDate = end ? dayjs(end).startOf("day") : null;

    const checkDate = (date: Dayjs | null) => date && !date.isValid();

    if (checkDate(startDate) || checkDate(endDate)) {
      return true;
    }

    if (startDate && endDate) {
      return startDate.isAfter(endDate, "day") || startDate.isSame(endDate, "day");
    }

    return false;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle id="dialog-title">{isEditing ? "Edit Report" : "New Report"}</DialogTitle>
      <DialogContent>
        <ReportsDialogForm
          ref={formRef}
          report={report}
          reportType={reportType}
          timezone={user?.timezone ?? dayjs.tz.guess()}
          disableReportType={!!pathToTypeMap[pathname] || isEditing}
          isEditing={isEditing}
        />
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton size="large" onClick={handleSubmit} variant="contained" loading={saveReport.isPending}>
          {isEditing ? "Update Report" : "Create Report"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
