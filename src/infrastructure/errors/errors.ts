export const ZOD_ERROR_CODE = 0;
import { showNotification } from "@/components/notifications/useShowNotification";
export class APIError extends Error {
  constructor(
    message: string,
    public readonly errorCode: number,
    public readonly error?: Error | unknown
  ) {
    super(message);
    this.name = "APIError";
    console.error("[APIError]", message, errorCode, error);

    if (errorCode) {
      showNotification({
        type: "error",
        message: `We are experiencing an issue. Please try again or contact SkyBitz Customer Care: customercare.skybitz@ametek.com`,
      });
    } else {
      const notificationMessage = navigator.onLine
        ? "We're having trouble reaching the server. Please try again."
        : "You're offline. Please connect to the internet and try again.";
      showNotification({ type: "error", message: notificationMessage });
    }
  }
}
