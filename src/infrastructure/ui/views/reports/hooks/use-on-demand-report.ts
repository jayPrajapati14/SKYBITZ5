import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runOnDemandReport } from "@/domain/services/report/report.service";
import { useShowNotification } from "@/components/notifications/useShowNotification";

export function useRunOnDemandReportMutation({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
  const queryClient = useQueryClient();
  const showNotification = useShowNotification();
  return useMutation({
    mutationFn: runOnDemandReport,
    onSuccess: (_data, _variables) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      showNotification({
        type: "success",
        message: `Report successfully run on demand`,
        duration: 2000,
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      onError();
      showNotification({
        type: "error",
        message: "Failed to run on demand report!",
        duration: 2000,
      });
    },
  });
}
