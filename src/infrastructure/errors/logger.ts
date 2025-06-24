import { apiFetch } from "../api-fetch/api-fetch";

export type ErrorData = {
  customerId: number;
  message: string;
  stack: string;
  timestamp: string;
  path: string;
};

export function sendNotification(error: ErrorData): void {
  if (import.meta.env.DEV) return;
  apiFetch("/api/v1/ui/error", {
    method: "POST",
    body: JSON.stringify(error),
  });
}
