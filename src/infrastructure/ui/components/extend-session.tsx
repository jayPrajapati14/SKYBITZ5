import { extendCurrentSession } from "@/domain/services/user/user.service";

/**
 * Setup the interval to extend the session
 * @returns void
 */
export function setupExtendSessionInterval() {
  const sessionTime = import.meta.env.VITE_SESSION_EXTEND_TIME_MILLIS as number;

  if (!sessionTime || import.meta.env.VITE_MOCK_API === "true") return;

  setInterval(() => {
    extendCurrentSession();
  }, sessionTime);
}
