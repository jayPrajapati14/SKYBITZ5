import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useState } from "react";
import { ReportDialogProps } from "./reports-dialog.form.types";
import { useDeleteReportMutation } from "@/views/reports/hooks/use-delete-report";

export function DeleteReportConfirmationDialog({ open, onClose, report }: ReportDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const onSuccess = () => {
    setLoading(false);
    onClose();
  };

  const onError = () => {
    setLoading(false);
  };

  const runOnDemandReport = useDeleteReportMutation({
    onSuccess,
    onError,
  });

  const handleSubmit = async () => {
    setLoading(true);
    runOnDemandReport.mutate({
      reportId: report.id, //need to change this field name as per API specs
    });
  };

  return (
    <ConfirmationDialog
      title={`Delete Report: ${report.name}`}
      isOpen={open}
      setIsOpen={onClose}
      loading={loading}
      onConfirm={handleSubmit}
      okButtonText="Yes, Proceed"
      cancelButtonText="Cancel"
      okButtonColor="error"
    >
      <div className="tw-text-center">Do you want to proceed?</div>
    </ConfirmationDialog>
  );
}
