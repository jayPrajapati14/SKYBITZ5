import { useSnackbar, EnqueueSnackbar } from "notistack";
import { useEffect } from "react";

interface NotificationOptions {
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

const DEFAULT_DURATION = 3000;

export function useShowNotification() {
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = ({ type, message, duration }: NotificationOptions) => {
    enqueueSnackbar(message, {
      variant: type,
      autoHideDuration: duration || DEFAULT_DURATION,
    });
  };

  return showNotification;
}

let enqueueSnackbarRef: EnqueueSnackbar | null = null;
export function SnackbarUtilsConfigurator() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    enqueueSnackbarRef = enqueueSnackbar;
  }, [enqueueSnackbar]);

  return null;
}

export function showNotification({ type, message, duration }: NotificationOptions) {
  if (enqueueSnackbarRef) {
    enqueueSnackbarRef(message, {
      variant: type,
      autoHideDuration: duration || DEFAULT_DURATION,
    });
  }
}
