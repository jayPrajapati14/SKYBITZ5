import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";

type ViewReportConfirmationDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isEnhancingReport: boolean;
  onConfirmViewReport: () => void;
};

export function ViewReportConfirmationDialog({
  isDialogOpen,
  setIsDialogOpen,
  isEnhancingReport,
  onConfirmViewReport,
}: ViewReportConfirmationDialogProps) {
  return (
    <ConfirmationDialog
      title="View Report"
      isOpen={isDialogOpen}
      setIsOpen={setIsDialogOpen}
      loading={isEnhancingReport}
      onConfirm={onConfirmViewReport}
      okButtonText="Yes, Proceed"
      cancelButtonText="Cancel"
    >
      You will be redirected to the view used to generate this report. Your current filters
      <span className="tw-font-bold"> will be replaced</span> with those from the report. Do you want to proceed?
    </ConfirmationDialog>
  );
}
