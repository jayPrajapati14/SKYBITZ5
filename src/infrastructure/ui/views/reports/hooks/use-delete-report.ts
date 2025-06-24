import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReport } from "@/domain/services/report/report.service";
import { useShowNotification } from "@/components/notifications/useShowNotification";

export function useDeleteReportMutation({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
  const showNotification = useShowNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      showNotification({
        type: "success",
        message: "Report deleted successfully!",
        duration: 2000,
      });
    },
    onError: () => {
      onError();
      showNotification({
        type: "error",
        message: "Failed to delete the report!",
        duration: 2000,
      });
    },
  });
}
