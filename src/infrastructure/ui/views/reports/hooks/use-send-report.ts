import { useMutation } from "@tanstack/react-query";
import { sendReport } from "@/domain/services/report/report.service";
import { useShowNotification } from "@/components/notifications/useShowNotification";

export function useSendReportMutation({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
  const showNotification = useShowNotification();
  return useMutation({
    mutationFn: sendReport,
    onSuccess: () => {
      onSuccess();
      showNotification({
        type: "success",
        message: "Report sent on successfully!",
        duration: 2000,
      });
    },
    onError: () => {
      onError();
      showNotification({
        type: "error",
        message: "Failed to send the report!",
        duration: 2000,
      });
    },
  });
}
