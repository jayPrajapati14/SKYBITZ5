import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReport,
  CreateReportParams,
  updateReport,
  UpdateReportParams,
} from "@/domain/services/report/report.service";
import { useShowNotification } from "@/components/notifications/useShowNotification";

export function useSaveReport({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const showNotification = useShowNotification();
  return useMutation({
    mutationFn: (data: CreateReportParams | UpdateReportParams) => {
      if ("id" in data && data.id) {
        return updateReport(data);
      }
      return createReport(data);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      showNotification({
        type: "success",
        message: "Report saved successfully!",
        duration: 2000,
      });
    },
    onError: () => {
      showNotification({
        type: "error",
        message: "Failed to save the report!",
        duration: 2000,
      });
    },
  });
}
