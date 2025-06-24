import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ReportDialogProps } from "./reports-dialog.form.types";
import { useSendReportMutation } from "@/views/reports/hooks/use-send-report";
import TagsInput from "@/components/tags-input/tags-input";
import { useShowNotification } from "@/components/notifications/useShowNotification";

export function EmailReportDialog({ open, onClose, report }: ReportDialogProps) {
  const [from, setFrom] = useState("skybitzrpt@skybitz.com"); //static email just for display
  const [toList, setToList] = useState<string[]>([]);
  const [subject, setSubject] = useState(report.name);
  const [loading, setLoading] = useState<boolean>(false);
  const showNotification = useShowNotification();

  const onSuccess = () => {
    setToList([]);
    setLoading(false);
    onClose();
  };

  const onError = () => {
    setLoading(false);
  };

  const sendReport = useSendReportMutation({
    onSuccess,
    onError,
  });

  const emailValidator = (email: string): boolean => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regexEmail.test(email);
  };

  const handleSubmit = async () => {
    if (!report.lastRun || (report.lastRun && report.status != "COMPLETED")) {
      showNotification({
        message: `No completed executions were found to send the report`,
        type: "error",
      });
      return;
    }
    setLoading(true);
    sendReport.mutate({
      reportId: report.id,
      emails: toList,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown fullWidth>
      <DialogTitle>Email Report: {report.name}</DialogTitle>
      <DialogContent>
        <div className="tw-space-y-6">
          <div className="tw-mb-6 tw-space-y-6">
            <TextField
              disabled
              fullWidth
              label="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              margin="dense"
            />
            <TextField
              disabled
              fullWidth
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              margin="dense"
            />
            <TagsInput
              label="Recipients"
              tags={toList}
              placeholder="Add recipients"
              onChange={(tags: string[]) => {
                setToList(tags);
              }}
              validator={emailValidator}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions className="tw-mx-3 tw-my-2">
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={loading} variant="contained" onClick={handleSubmit} disabled={toList.length === 0}>
          Send
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
