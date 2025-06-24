import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useState } from "react";
import { ReportDialogProps } from "./reports-dialog.form.types";
import { useRunOnDemandReportMutation } from "@/views/reports/hooks/use-on-demand-report";

export function RunReportOnDemandConfirmationDialog({ open, onClose, report }: ReportDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const onSuccess = () => {
    setLoading(false);
    onClose();
  };

  const onError = () => {
    setLoading(false);
  };

  const runOnDemandReport = useRunOnDemandReportMutation({
    onSuccess,
    onError,
  });

  const handleSubmit = async () => {
    setLoading(true);
    runOnDemandReport.mutate({
      reportId: report.id, // TODO: change this field name as per API specs
    });
  };

  return (
    <ConfirmationDialog
      title={`Run On Demand Report: ${report.name}`}
      isOpen={open}
      setIsOpen={onClose}
      loading={loading}
      onConfirm={handleSubmit}
      okButtonText="Yes, Proceed"
      cancelButtonText="Cancel"
    >
      <div className="tw-text-center">Do you want to proceed?</div>
    </ConfirmationDialog>
  );
}
